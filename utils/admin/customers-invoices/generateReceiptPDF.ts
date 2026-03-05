import jsPDF from "jspdf";
import { convertToJapaneseDate2 } from "@/utils";
import { CustomerDetail } from "@/types/customers";
import { Invoice } from "@/types/admin/invoice.type";
import { OrderDetail, OrderProduct } from "@/types/orders/index";

const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString()}`;
};

//helpers
const productRows = (orderItems: OrderProduct[], startIndex: number, endIndex: number) =>
  orderItems
    .slice(startIndex, endIndex)
    .map((p) => {
      return `
        <tr>
          <td style="padding: 0.5rem; border: 1px solid #e5e7eb;">${p.productName}</td>
          <td style="
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            text-align: center;
          ">${p.quantity}</td>
          <td style="
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            text-align: right;
          ">${formatCurrency(Number(p.price))}</td>
          <td style="
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            text-align: right;
          ">${formatCurrency(Number(p.price) * p.quantity)}</td>
        </tr>
    `;
    })
    .join("");

const starShopInfo = {
  name: "BEAUTECH株式会社",
  postalAddress: "〒104-0045 東京都中央区築地6丁目1-9 門跡木村ビル2F",
  address: "【コスメ事業】",
  phone: "03-5801-5968",
  email: "starshop@beau-tech.jp",
};

const getAddress = (userDetail: CustomerDetail) => {
  return `${userDetail?.billing_address?.[0].prefecture} ${userDetail?.billing_address?.[0].city} ${userDetail?.billing_address?.[0].address1} ${userDetail?.billing_address?.[0].address2}`;
};

// Alternative approach using HTML to Canvas to PDF for Japanese text
export const generateReceiptPDF = async (
  invoiceData: Invoice,
  userDetail: CustomerDetail,
  order: OrderDetail,
  returnBlob: boolean = false, //default false state
): Promise<boolean | Blob> => {
  if (!order || order.products.length === 0) {
    console.error("No order items provided");
    return false;
  }

  // Create a temporary div for HTML content
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "210mm"; // A4 width
  tempDiv.style.height = "297mm"; // A4 height
  tempDiv.style.padding = "50px";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.fontSize = "12px";
  tempDiv.style.lineHeight = "1.4";
  tempDiv.style.color = "#333";
  tempDiv.style.backgroundColor = "white";
  tempDiv.style.boxSizing = "border-box";

  //helpers
  const subtotal = order?.orderTotalNoTax || 0;
  const tax8 = order?.eightPercentTotal || 0;
  const tax10 = order?.tenPercentTotal || 0;
  const totalTax = tax8 + tax10;
  const shippingCost = order?.shippingCost || 0;
  const grandTotal = order?.orderTotal || 0;

  const totals = {
    subtotal,
    tax8,
    tax10,
    totalTax,
    shippingCost,
    grandTotal,
  };

  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(order.products.length / ITEMS_PER_PAGE);

  try {
    const html2canvas = (await import("html2canvas")).default;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    for (let page = 0; page < totalPages; page++) {
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, order.products.length);

      // Add new page if not first page
      if (page > 0) {
        pdf.addPage();
      }

      const headerContent = page === 0 ? `
        <!-- Header Section -->
        <div style="
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        ">
          <!-- Left Side -->
          <div>
            <div>
              <p style="font-size: 0.875rem; line-height: 1.25rem; margin: 0 0 0.5rem 0;">
                領収番号: <span>${invoiceData?.idNumber || "-"}</span>
              </p>
              <p style="font-size: 0.875rem; line-height: 1.25rem; margin: 0 0 1rem 0;">
                発行日付: <span>${invoiceData?.createdAt && convertToJapaneseDate2(invoiceData.createdAt)}</span>
              </p>
            </div>
            <div style="margin-top: 1rem;">
              <h3 style="
                border-bottom: 2px solid black;
                padding-bottom: 0.25rem;
                margin: 0 0 1rem 0;
              ">
                ${userDetail?.username || "-"}
              </h3>
              <p style="
                font-size: 0.875rem;
                line-height: 1.25rem;
                margin: 0 0 0.5rem 0;
              ">
                <span>〒 ${userDetail?.billing_address?.[0].postalCode}</span> <span>${getAddress(userDetail)}</span>
              </p>
              <!-- off this coz nomral user don't have this info
              <p style="
                font-size: 0.875rem;
                line-height: 1.25rem;
                margin: 0 0 1rem 0;
                text-indent: 5rem;
              ">
                <span>${userDetail?.company_info?.tantoPosition || "-"}</span>
                <span>担当者：</span>
                <span>${userDetail?.company_info?.representativeName || "-"}</span>
              </p> -->
              <p style="
                font-size: 0.875rem;
                line-height: 1.25rem;
                margin: 0 0 1rem 0;
              ">
                下記の通りご請求申し上げます。
              </p>
            </div>
            <div style="border-bottom: 4px double black; padding-bottom: 0.5rem;">
              <h3 style="font-weight: 700; margin: 1rem 0 0 0;">
                【 合計金額 】 <span style="margin-left: 5rem;">${formatCurrency(invoiceData?.totalAmount || 0)}</span>
              </h3>
            </div>
          </div>

          <!-- Right Side -->
          <div>
            <p style="
              font-size: 6rem;
              line-height: 1;
              text-align: center;
              margin: 0 0 3rem 0;
            ">
              領収書
            </p>
           <div style="
              margin: 0.5rem 0 0 0.5rem;
              background-color: #e5e7eb;
              padding: 1.5rem;
              position: relative;
            ">
            <div>
              <p style="font-weight: 700; margin: 0 0 0.5rem 0;">${starShopInfo?.name || "-"}</p>
              <p style="margin: 0 0 0.5rem 0;">${starShopInfo?.postalAddress + " " + starShopInfo?.address || "-"}</p>
              <div style="
                display: flex;
                align-items: center;
                font-size: 0.875rem;
                line-height: 1.25rem;
                margin: 0 0 0.25rem 0;
              ">
                <span style="margin-right: 0.5rem;">専用窓口：</span>
                <span>${starShopInfo?.phone || "-"}</span>
              </div>
              <div style="
                display: flex;
                align-items: center;
                font-size: 0.875rem;
                line-height: 1.25rem;
                margin: 0;
              ">
                <span style="margin-right: 0.5rem;">✉️</span>
                <span>${starShopInfo?.email || "-"}</span>
              </div>
              </div>
              <div style="
                position: absolute;
                bottom: 0.3rem;
                right: 0.2rem;
              ">
              <img 
                src="/stamp/stamp.png" 
                alt="company-stamp" 
                style="max-width: 75%; height: auto; object-fit: contain;"
            />
              </div>
            </div>
          </div>
        </div>
      ` : '';

      const tableHeader = `
        <thead>
          <tr style="border-top: 2px solid #d1d5db; background-color: #f3f4f6;">
            <th style="
              padding: 0.5rem;
              border: 1px solid #d1d5db;
              text-align: left;
            ">商品名 / 品目</th>
            <th style="
              padding: 0.5rem;
              border: 1px solid #d1d5db;
              text-align: center;
            ">数量</th>
            <th style="
              padding: 0.5rem;
              border: 1px solid #d1d5db;
              text-align: right;
            ">単価</th>
            <th style="
              padding: 0.5rem;
              border: 1px solid #d1d5db;
              text-align: right;
            ">金額</th>
          </tr>
        </thead>
      `;

      const footerContent = page === totalPages - 1 ? `
        <tfoot>
       <tr>
            <td colspan="2" style="border: none;"></td>
           <td style="padding: 0.5rem; text-align: right;">小計 (税別)</td>
           <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totals.subtotal)}</td>
          </tr> 
          <tr>
            <td colspan="2" style="border: none;"></td>
            <td style="padding: 0.5rem; text-align: right;">送料</td>
            <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totals.shippingCost)}</td>
          </tr>
          ${
            totals.tax8 > 0
              ? `<tr>
            <td colspan="2" style="border: none;"></td>
            <td style="padding: 0.5rem; text-align: right;">消費税 (8%)</td>
            <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totals.tax8)}</td>
                 </tr>`
              : ""
          }
          <tr>
            <td colspan="2" style="border: none;"></td>
            <td style="padding: 0.5rem; text-align: right;">消費税 (10%)</td>
           <td style="padding: 0.5rem; text-align: right;">${formatCurrency(totals.tax10)}</td>
         </tr>
        <tr>
            <td colspan="2" style="border: none;"></td>
            <td style="padding: 0.5rem; text-align: right; border-bottom: 2px solid #d1d5db;">合計 (税込)</td>
            <td style="padding: 0.5rem; text-align: right; border-bottom: 2px solid #d1d5db;">${formatCurrency(totals.grandTotal)}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem;" colspan="4">備考欄：</td>
          </tr>
        </tfoot>
      ` : '';

      const htmlContent = `
        <div style="
          padding: 2rem 2rem 0.5rem;
          background-color: white;
          margin: 0 auto;
          width: 100%;
          border: 0;
          box-shadow: 0 0 15px 0 rgba(0,0,0,0.1);
          max-width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        ">
          ${headerContent}
          
          <!-- Table Section -->
          <div style="margin-top: 2rem; width: 100%;">
            <table style="width: 100%; border-collapse: collapse;">
              ${tableHeader}
              <tbody>
                ${productRows(order.products, startIndex, endIndex)}
              </tbody>
              ${footerContent}
            </table>
          </div>
        </div>
      `;

      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      document.body.removeChild(tempDiv);
    }

    const fileName = `領収書-${invoiceData.idNumber}.pdf`;
    if (returnBlob) {
      return pdf.output("blob");
    } else {
      pdf.save(fileName);
      return true;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  } finally {
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }
  }
};