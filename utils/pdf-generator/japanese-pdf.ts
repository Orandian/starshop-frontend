import jsPDF from "jspdf"

interface Product {
  product_id: number
  product_name: string
  price: number
  quantity: number
  subtotal: number
  tax: number
  tax_amount: number
  images: string[]
}

interface Address {
  first_name: string
  last_name: string
  phone: string
  postal_code: string
  prefecture: string
  city: string
  street: string
  building: string
  room: string
  country: string
}

interface OrderData {
  order_id: number
  order_date: string
  payment_method: string
  order_status: string
  notes: string
  shipping_company: string | null
  shipping_date: string | null
  tracking_number: string | null
  shipping_cost: number
  order_total: number
  eight_percent_total: number
  ten_percent_total: number
  customer_id: string
  customer_name: string
  shipping_address: Address
  billing_address: Address
  products: Product[]
}

const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString()}`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

// Alternative approach using HTML to Canvas to PDF for Japanese text
export const generateJapaneseInvoicePDF = async (orderData: OrderData) => {
  // Create a temporary div for HTML content
  const tempDiv = document.createElement("div")
  tempDiv.style.position = "absolute"
  tempDiv.style.left = "-9999px"
  tempDiv.style.width = "210mm" // A4 width
  tempDiv.style.height = "297mm" // A4 height
  tempDiv.style.padding = "20px"
  tempDiv.style.fontFamily = "Arial, sans-serif"
  tempDiv.style.fontSize = "12px"
  tempDiv.style.lineHeight = "1.4"
  tempDiv.style.color = "#333"
  tempDiv.style.backgroundColor = "white"
  tempDiv.style.boxSizing = "border-box"

  // const statusTranslation: { [key: string]: string } = {
  //   キャンセル済み: "キャンセル済み",
  //   処理中: "処理中",
  //   配送済み: "配送済み",
  //   完了: "完了",
  // }
  // const watermarkText = statusTranslation[orderData.order_status] || orderData.order_status

  // const htmlContent = `
  //   <div style="position: relative; width: 100%; height: 100%;">
  //     <div style="
  //       position: absolute;
  //       top: 50%;
  //       left: 50%;
  //       transform: translate(-50%, -50%) rotate(-45deg);
  //       font-size: 80px;
  //       color: rgba(0, 0, 0, 0.1);
  //       font-weight: bold;
  //       text-align: center;
  //       white-space: nowrap;
  //       z-index: -1;
  //       pointer-events: none;
  //     ">
  //       ${watermarkText}
  //     </div>

  const htmlContent = `
    <div style="position: relative; width: 100%; height: 100%;">
      <div style="border-bottom: 3px solid #9399d4; padding-bottom: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="color: #9399d4; margin: 0; font-size: 24px;">Star Shop</h1>
            <p style="margin: 5px 0;">〒104-0045 東京都中央区築地築地6丁目</p>
            <p style="margin: 5px 0;">1-9 1 門跡木村ビル2階</p>
            <p style="margin: 5px 0;">Tel: 03-5801-5968</p>
          </div>
          <div style="text-align: right;">
            <h2 style="color: #9399d4; margin: 0; font-size: 28px;">領収書</h2>
            <p style="margin: 5px 0;"><strong>領収書番号:</strong> INV-${orderData.order_id.toString().padStart(6, "0")}</p>
            <p style="margin: 5px 0;"><strong>発行日:</strong> ${formatDate(orderData.order_date)}</p>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="width: 45%;">
          <h3 style="color: #9399d4; border-bottom: 1px solid #9399d4; padding-bottom: 5px;">領収先</h3>
          <p><strong>${orderData.billing_address.first_name} ${orderData.billing_address.last_name}</strong></p>
          <p>〒${orderData.billing_address.postal_code}</p>
          <p>${orderData.billing_address.city} ${orderData.billing_address.street}</p>
          <p>${orderData.billing_address.building}</p>
          <p>Tel: ${orderData.billing_address.phone}</p>
        </div>
        <div style="width: 45%;">
          <h3 style="color: #9399d4; border-bottom: 1px solid #9399d4; padding-bottom: 5px;">配送先</h3>
          <p><strong>${orderData.shipping_address.first_name} ${orderData.shipping_address.last_name}</strong></p>
          <p>〒${orderData.shipping_address.postal_code}</p>
          <p>${orderData.shipping_address.city} ${orderData.shipping_address.street}</p>
          <p>${orderData.shipping_address.building}</p>
          <p>Tel: ${orderData.shipping_address.phone}</p>
        </div>
      </div>


      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #9399d4; color: white;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">#</th>
            <th style="border: 1px solid #ddd; padding: 8px;">商品名</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">単価</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">数量</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">税率</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">税額</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">小計</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.products
            .map(
              (product, index) => `
            <tr style="background-color: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${product.product_name}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(product.price)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${product.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${product.tax}%</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(product.tax_amount)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatCurrency(product.subtotal)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
        <div style="width: 300px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>小計:</span>
            <span>${formatCurrency(orderData.products.reduce((total, item) => total + item.price * item.quantity, 0))}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>送料:</span>
            <span>${formatCurrency(orderData.shipping_cost)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>消費税(8%):</span>
            <span>${formatCurrency(orderData.eight_percent_total)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>消費税(10%):</span>
            <span>${formatCurrency(orderData.ten_percent_total)}</span>
          </div>
          <div style="border-top: 2px solid #9399d4; padding-top: 10px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
            <span>合計:</span>
            <span>${formatCurrency(orderData.order_total)}</span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #9399d4;">お支払い情報</h3>
        <p><strong>支払方法:</strong> ${orderData.payment_method}</p>
        <p><strong>注文状況:</strong> ${orderData.order_status}</p>
        ${
          orderData.notes && orderData.order_status === "キャンセル済み"
            ? `
          <h3 style="color: #9399d4;">備考</h3>
          <p>${orderData.notes}</p>
        `
            : ""
        }
      </div>

      <div style="border-top: 2px solid #9399d4; padding-top: 15px; text-align: center; color: #666; font-size: 10px;">
        <p>この領収書に関するご質問は、上記連絡先までお問い合わせください。</p>
        <p>発行日時: ${new Date().toLocaleString("ja-JP")}</p>
        <p>ありがとうございました。</p>
      </div>
    </div>
  `

  tempDiv.innerHTML = htmlContent
  document.body.appendChild(tempDiv)

  try {
    const html2canvas = (await import("html2canvas")).default
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    })

    const doc = new jsPDF("p", "mm", "a4")
    const imgData = canvas.toDataURL("image/png")
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const fileName = `invoice-${orderData.order_id.toString().padStart(6, "0")}.pdf`
    doc.save(fileName)
  } finally {
    document.body.removeChild(tempDiv)
  }
}
