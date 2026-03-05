import jsPDF, { GState } from "jspdf"
import autoTable from "jspdf-autotable"

// No custom declare module for GState here to avoid conflicts.
// We will use 'as any' directly where GState is instantiated.

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

const addJapaneseFont = (doc: jsPDF) => {
  doc.setFont("helvetica")
}

export const generateInvoicePDF = async (orderData: OrderData) => {
  const doc = new jsPDF()
  addJapaneseFont(doc)

  const primaryColor: [number, number, number] = [41, 128, 185]
  const secondaryColor: [number, number, number] = [52, 73, 94]
  const lightGray: [number, number, number] = [236, 240, 241]

  const companyInfo = {
    name: "Star Shop",
    address: "6丁目1-9 1 門跡木村ビル2階",
    city: "〒104-0045 東京都中央区築地築地",
    phone: "03-5801-5968",
    email: "starshop@beau-tech.jp",
    website: "https://star-shop.co/",
  }

  // Translate order status for watermark
  const statusTranslation: { [key: string]: string } = {
    キャンセル済み: "CANCELLED",
    処理中: "PROCESSING",
    配送済み: "SHIPPED",
    完了: "COMPLETED",
    // Add more statuses as needed
  }
  const watermarkText = statusTranslation[orderData.order_status] || orderData.order_status.toUpperCase()

  // Function to add watermark to each page
  const addWatermark = (doc: jsPDF, text: string) => {
    // More specific type assertion for getNumberOfPages
    const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setTextColor(190, 190, 190) // Light gray color
      doc.setFontSize(60) // Large font size
      doc.setFont("helvetica", "bold")
      // Use 'as any' directly on jsPDF to access GState as a constructor
      doc.setGState(new (jsPDF as unknown as { GState: new (options: { opacity: number }) => GState }).GState({ opacity: 0.1 })) // Set opacity for watermark

      // Rotate and position the text
      const x = doc.internal.pageSize.getWidth() / 2
      const y = doc.internal.pageSize.getHeight() / 2
      doc.text(text, x, y, {
        angle: 45, // Rotate by 45 degrees
        align: "center",
        baseline: "middle",
      })

      doc.setGState(new (jsPDF as unknown as { GState: new (options: { opacity: number }) => GState }).GState({ opacity: 1 })) // Reset opacity
    }
  }

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(companyInfo.name, 20, 25)
  doc.setFontSize(24)
  doc.text("INVOICE", 150, 25)

  // Company details
  doc.setTextColor(...secondaryColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(companyInfo.city, 20, 58)
  doc.text(companyInfo.address, 20, 50)
  doc.text(`Tel: ${companyInfo.phone}`, 20, 66)
  doc.text(`Email: ${companyInfo.email}`, 20, 74)

  // Invoice details box
  doc.setFillColor(...lightGray)
  doc.rect(120, 45, 70, 35, "F")
  doc.setDrawColor(...secondaryColor)
  doc.rect(120, 45, 70, 35, "S")
  doc.setTextColor(...secondaryColor)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Invoice No:", 125, 55)
  doc.text("Issue Date:", 125, 63)
  doc.text("Due Date:", 125, 71)
  doc.setFont("helvetica", "normal")
  doc.text(`INV-${orderData.order_id.toString().padStart(6, "0")}`, 155, 55)
  doc.text(formatDate(orderData.order_date), 155, 63)
  const dueDate = new Date(orderData.order_date)
  dueDate.setDate(dueDate.getDate() + 30)
  doc.text(formatDate(dueDate.toISOString()), 155, 71)

  // Bill To section
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("Bill To:", 20, 95)
  doc.setTextColor(...secondaryColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`${orderData.billing_address.first_name} ${orderData.billing_address.last_name}`, 20, 105)
  doc.text(`Postal: ${orderData.billing_address.postal_code}`, 20, 113)
  const addressLine1 = `${orderData.billing_address.prefecture}`
  const addressLine2 = `${orderData.billing_address.city} ${orderData.billing_address.street}`
  const addressLine3 = `${orderData.billing_address.building}`
  doc.text(addressLine1, 20, 121)
  doc.text(addressLine2, 20, 129)
  doc.text(addressLine3, 20, 137)
  doc.text(`Tel: ${orderData.billing_address.phone}`, 20, 145)

  // Ship To section (if different from billing)
  const isDifferentAddress = JSON.stringify(orderData.shipping_address) !== JSON.stringify(orderData.billing_address)
  if (isDifferentAddress) {
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...primaryColor)
    doc.text("Ship To:", 120, 95)
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`${orderData.shipping_address.first_name} ${orderData.shipping_address.last_name}`, 120, 105)
    doc.text(`Postal: ${orderData.shipping_address.postal_code}`, 120, 113)
    const shipAddressLine1 = `${orderData.shipping_address.prefecture}`
    const shipAddressLine2 = `${orderData.shipping_address.city} ${orderData.shipping_address.street}`
    const shipAddressLine3 = `${orderData.shipping_address.building}`
    doc.text(shipAddressLine1, 120, 121)
    doc.text(shipAddressLine2, 120, 129)
    doc.text(shipAddressLine3, 120, 137)
    doc.text(`Tel: ${orderData.shipping_address.phone}`, 120, 145)
  }

  // Products table
  const tableStartY = 160
  const tableData = orderData.products.map((product, index) => [
    (index + 1).toString(),
    product.product_name,
    formatCurrency(product.price),
    product.quantity.toString(),
    `${product.tax}%`,
    formatCurrency(product.tax_amount),
    formatCurrency(product.subtotal),
  ])
  autoTable(doc, {
    startY: tableStartY,
    head: [["#", "Product Name", "Unit Price", "Qty", "Tax Rate", "Tax Amount", "Subtotal"]],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 4,
      font: "helvetica",
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 25, halign: "right" },
      6: { cellWidth: 25, halign: "right" },
    },
  })

  // Calculate totals
  const subtotal = orderData.products.reduce((total, item) => total + item.price * item.quantity, 0)
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  const totalsX = 130
  doc.setFillColor(...lightGray)
  doc.rect(totalsX, finalY, 60, 50, "F")
  doc.setDrawColor(...secondaryColor)
  doc.rect(totalsX, finalY, 60, 50, "S")
  doc.setTextColor(...secondaryColor)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Subtotal:", totalsX + 5, finalY + 10)
  doc.text(formatCurrency(subtotal), totalsX + 50, finalY + 10, { align: "right" })
  doc.text("Shipping:", totalsX + 5, finalY + 18)
  doc.text(formatCurrency(orderData.shipping_cost), totalsX + 50, finalY + 18, { align: "right" })
  doc.text("Tax (8%):", totalsX + 5, finalY + 26)
  doc.text(formatCurrency(orderData.eight_percent_total), totalsX + 50, finalY + 26, { align: "right" })
  doc.text("Tax (10%):", totalsX + 5, finalY + 34)
  doc.text(formatCurrency(orderData.ten_percent_total), totalsX + 50, finalY + 34, { align: "right" })
  doc.setLineWidth(0.5)
  doc.line(totalsX + 5, finalY + 38, totalsX + 55, finalY + 38)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("TOTAL:", totalsX + 5, finalY + 46)
  doc.text(formatCurrency(orderData.order_total), totalsX + 50, finalY + 46, { align: "right" })

  // Payment information
  doc.setTextColor(...primaryColor)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Payment Information", 20, finalY + 20)
  doc.setTextColor(...secondaryColor)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Payment Method: ${orderData.payment_method}`, 20, finalY + 30)
  const orderStatus = statusTranslation[orderData.order_status] || orderData.order_status
  doc.text(`Order Status: ${orderStatus}`, 20, finalY + 38)

  // Notes section (if cancelled)
  if (orderData.notes && orderData.order_status === "キャンセル済み") {
    doc.setTextColor(...primaryColor)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Notes", 20, finalY + 55)
    doc.setTextColor(...secondaryColor)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitNotes = doc.splitTextToSize(orderData.notes, 170)
    doc.text(splitNotes, 20, finalY + 65)
  }

  // Footer
  const footerY = doc.internal.pageSize.height - 30
  doc.setFillColor(...primaryColor)
  doc.rect(0, footerY, 210, 30, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("For any questions regarding this invoice, please contact us using the above information.", 20, footerY + 10)
  doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, 20, footerY + 18)
  doc.text("Thank you for your business.", 20, footerY + 26)

  // Add watermark to all pages
  addWatermark(doc, watermarkText)

  const fileName = `invoice-${orderData.order_id.toString().padStart(6, "0")}.pdf`
  doc.save(fileName)
}
