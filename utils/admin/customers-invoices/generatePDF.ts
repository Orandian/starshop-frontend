import jsPDF from "jspdf";
import { convertToJapaneseDate, formatDate2, formatId } from "@/utils";
import { CustomerInvoice, CustomerDetail } from "@/types/customers/index";
import { formatDate } from "date-fns";

interface PlanWithCount {
  type: string;
  name: string;
  basePrice: number;
  taxReducedPrice: number;
  taxPrice: number;
  userName: string;
  tantoName: string;
  count: number;
  category: string;
}

//temp brands data
const INVOICE_CONFIG = {
  TAX_RATE: 0.1,
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  PADDING_MM: 50,
  CANVAS_SCALE: 2,
} as const;

const PLAN_CONFIGS = [
  {
    type: "1A" as const,
    name: "スタンダード(10万コース)",
    basePrice: 10000,
    category: "紹介料",
  },
  {
    type: "1B" as const,
    name: "ゴールド(20万コース)",
    basePrice: 20000,
    category: "紹介料",
  },
  {
    type: "2" as const,
    name: "管理金",
    basePrice: 0,
    category: "管理金",
  },
];

const createPlanWithCount = (
  invoiceData: CustomerInvoice,
  userDetail: CustomerDetail | null | undefined,
) =>
  PLAN_CONFIGS.map((plan) => {
    const basePlan = {
      ...plan,
      count:
        plan.type === "1A"
          ? invoiceData.type1ACount
          : plan.type === "1B"
            ? invoiceData.type1BCount
            : 0,
      taxReducedPrice:
        plan.type === "1A" || plan.type === "1B"
          ? plan.basePrice * (1 - INVOICE_CONFIG.TAX_RATE)
          : invoiceData.type2Amount * (1 - INVOICE_CONFIG.TAX_RATE),
      taxPrice:
        plan.type === "1A" || plan.type === "1B"
          ? plan.basePrice * INVOICE_CONFIG.TAX_RATE
          : invoiceData.type2Amount * INVOICE_CONFIG.TAX_RATE,
      userName:
        `${userDetail?.username}${userDetail?.usernameKana ? `(${userDetail.usernameKana})` : ""}` ||
        "",
      tantoName: userDetail?.tantoName || "",
    };

    // Only modify the name for type "2"
    if (plan.type === "2") {
      return {
        ...basePlan,
        name: formatCurrency(invoiceData.type2TotalCost),
      };
    }

    return basePlan;
  });

const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString()}`;
};

const calculateTotals = (plans: PlanWithCount[]) => {
  const subtotal = plans.reduce((sum, plan) => {
    const multiplier =
      plan.type === "1A" || plan.type === "1B" ? plan.count : 1;
    return sum + plan.taxReducedPrice * multiplier;
  }, 0);

  const tax = plans.reduce((sum, plan) => {
    const multiplier =
      plan.type === "1A" || plan.type === "1B" ? plan.count : 1;
    return sum + plan.taxPrice * multiplier;
  }, 0);

  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const formatUserAddress = (
  userDetail: CustomerDetail | null | undefined,
): string => {
  if (!userDetail?.billing_address?.[0]) return "住所情報なし";
  const address = userDetail.billing_address[0];
  return (
    [address.prefecture, address.city, address.address1, address.address2]
      .filter(Boolean)
      .join("") || "住所情報なし"
  );
};

const processDate = (dateStr: string): string => {
  // Extract year and month from the input string (format: YYYYMM)
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6));

  // Get the first day of the next month, then subtract one day to get the last day of current month
  const lastDay = new Date(year, month, 0);

  // Format the date as YYYY/MM/DD
  const day = String(lastDay.getDate()).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");

  return `${year}/${formattedMonth}/${day}`;
};

// Alternative approach using HTML to Canvas to PDF for Japanese text
export const generatePDF = async (
  invoiceData: CustomerInvoice,
  userDetail: CustomerDetail,
  invoiceDate: string,
) => {
  const planWithCount = createPlanWithCount(invoiceData, userDetail);
  const totals = calculateTotals(planWithCount);

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

  const htmlContent = `
<div style="font-family: Arial, sans-serif;">
  <div style="padding-bottom:20px; margin-bottom:20px;">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <p style="font-size:12px; text-align:right;">
        BEAUTECH株式会社　様
      </p>
      <p style="font-size:12px;">
        ${convertToJapaneseDate(new Date().toDateString())}
      </p>
    </div>

    <h1 style="margin:0; margin-top: 10px; padding-bottom:15px; font-size:24px; text-align:center; width: 100%; background-color: lightgray;">
      請　　　求　　　書
    </h1>
    <p style="margin:0; font-size:12px; text-align:left;">
      以下の通り御請求申し上げます
    </p>
    <p style="margin:0; font-size:12px; text-align:left;">
      御手数ですが下記の口座に御振込下さい
    </p>
    <p style="margin:0; font-size:12px; text-align:left; margin-bottom: 10px;">
      ※お支払いは、${formatDate2(invoiceData?.paymentDate) || processDate(invoiceDate)} までお願いいたします。
    </p>

  <div style="
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 20px;
  width: 100%;
  font-size: 12px;
">
  <!-- Bank Info Column -->
  <div style="
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 8px 16px;
  ">
    <div style="font-weight: bold;">金融機関名</div>
    <div>${userDetail?.bank_info?.branchName || "-"}</div>
    
    <div style="font-weight: bold;">口座種別</div>
    <div>${userDetail?.bank_info?.branchNumber || "-"}</div>
    
    <div style="font-weight: bold;">口座番号</div>
    <div>${userDetail?.bank_info?.bankAccountNumber || "-"}</div>
    
    <div style="font-weight: bold;">口座名義</div>
    <div>${userDetail?.bank_info?.bankAccountName || "-"}</div>
  </div>

  <!-- User Details Column -->
  <div style="
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 8px 16px;
  ">
    <div style="font-weight: bold;">社名</div>
    <div>${userDetail?.username || "-"}</div>
    
    <div style="font-weight: bold;">〒</div>
    <div>${userDetail?.billing_address?.[0]?.postalCode || "-"}</div>
    
    <div style="font-weight: bold;">住所</div>
    <div>${formatUserAddress(userDetail)}</div>
    
    <div style="font-weight: bold;">電話</div>
    <div>${userDetail?.phone_number || "-"}</div>
    
    <div style="font-weight: bold;">メール</div>
    <div>${userDetail?.email || "-"}</div>
    
    <div style="font-weight: bold;">登録番号</div>
    <div>${(userDetail?.createdAt && formatId(userDetail?.createdAt as number[], Number(userDetail?.user_id))) || " -"}</div>
  </div>

  <!-- Signature Column -->
  <div style="  
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
  ">
    <div style="
      text-align: center;
      padding: 10px;
      min-width: 60px;
    ">
     <div style="
          bottom: 0.5rem;
          right: 0.5rem;
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

    <div style="
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 10px 0;
  font-size: 12px;
  gap: 20px;
">
  <!-- Empty left column -->
  <div></div>
  
  <!-- Middle column with border -->
  <div style="
    text-align: center;
  ">
    <div style="border: 1px solid #000; padding-bottom:10px; background-color:lightgray;">ご請求金額(税込)</div>
    <div style="font-size: 16px; border:1px solid #000; padding-bottom:10px;">
      ${formatCurrency(invoiceData?.totalAmount)}
    </div>
  </div>
  
  <!-- Empty right column -->
  <div></div>
</div>

    <table style="
      width:100%;
      border-collapse:collapse;
      font-size:12px;
      margin-top:10px;
    ">
      <thead style="background-color:lightgray;">
        <tr>
          <th style="border:1px solid black; padding:10px 5px;">項目</th>
          <th style="border:1px solid black; padding:10px 5px;">申込日</th>
          <th style="border:1px solid black; padding:10px 5px;">サロン名</th>
          <th style="border:1px solid black; padding:10px 5px;">氏名</th>
          <th style="border:1px solid black; padding:10px 5px;">コース</th>
          <th style="border:1px solid black; padding:10px 5px;">金額（税込）</th>
        </tr>
      </thead>
      <tbody>
        ${planWithCount
          .map(
            (plan, index) => `
          <tr key=${index}>
            <td style="border:1px solid black; padding:10px 5px; text-align:center;">
              ${plan.category}
            </td>
            <td style="border:1px solid black; padding:10px 5px;">
              ${formatDate(new Date(), "yyyy/MM/dd")}
            </td>
            <td style="border:1px solid black; padding:10px 5px; text-align:right;">
              ${plan.userName}
            </td>
            <td style="border:1px solid black; padding:10px 5px; text-align:center;">
              ${plan.tantoName}
            </td>
            <td style="border:1px solid black; padding:10px 5px; text-align:right;">
              ${plan.name}
            </td>
            <td style="border:1px solid black; padding:10px 5px; text-align:right;">
              ${plan.type === "2" ? formatCurrency(plan.taxReducedPrice) : formatCurrency(plan.taxReducedPrice * plan.count)}
            </td>
          </tr>
        `,
          )
          .join("")}

        <tr>
          <td colspan="4"></td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right; background-color:lightgray;" >小計</td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right;">${formatCurrency(totals.subtotal)}</td>
        </tr>

        <tr>
          <td colspan="4"></td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right; background-color:lightgray;" >消費税等10%対象</td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right;">${formatCurrency(totals.tax)}</td>
        </tr>

        <tr>
        <td colspan="4"></td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right; background-color:lightgray;" >消費税等8%対象</td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right;">-</td>
        </tr>

        <tr>
          <td colspan="4"></td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right; background-color:lightgray;" >小計総合計金額</td>
          <td style="border:1px solid black; padding:10px 5px; text-align:right;">${formatCurrency(totals.total)}</td>
        </tr>
      </tbody>
    </table>

    <p style="width:100%; font-size:12px; margin-top:30px; padding-bottom:10px; text-align: center; border: 1px solid #000; background-color:lightgray;">
      備考
    </p>
    <p style="width:100%; height:100px; border:1px solid #000;"></p>
  </div>
</div>
`;

  tempDiv.innerHTML = htmlContent;
  document.body.appendChild(tempDiv);

  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const doc = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = 210;
    const pageHeight = 297;

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * pageWidth) / canvas.width;
    // If the calculated height is greater than A4 height, scale it down
    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      imgWidth = imgWidth * scale;
      imgHeight = pageHeight;
    }

    // Position at top of page
    const x = (pageWidth - imgWidth) / 2; // Center horizontally
    const y = 0; // Align to top

    let position = 0;
    doc.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    while (imgHeight > pageHeight) {
      position = imgHeight - pageHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", x, position, imgWidth, pageHeight);
      imgHeight -= pageHeight;
    }

    const fileName = `請求書-${invoiceDate.slice(4, 6)}月-${userDetail?.username}.pdf`;
    doc.save(fileName);
  } finally {
    document.body.removeChild(tempDiv);
  }
};
