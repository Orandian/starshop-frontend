import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
    Img,
  } from "@react-email/components"
  
  interface ProductItem {
    product_name: string
    quantity: number
    price: number
    tax_amount: number
  }
  
  interface CancelOrderMailProps {
    orderId: number
    userName: string
    userEmail: string
    products: ProductItem[]
    total?: number
    cancelReason?: string
    cancelDate: string
    eightPercentTotal?: number
    tenPercentTotal?: number
  }
  
  export const CancelOrderMail = ({
    orderId,
    userName,
    products,
    cancelReason,
    cancelDate,
  }: CancelOrderMailProps) => (
    <Html>
      <Head />
      <Preview>ご注文キャンセルのお知らせ - STAR SHOP</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img src="https://oyoazrgseubztzqrrrbu.supabase.co/storage/v1/object/public/profile-images//logo.png" width="60" height="60" alt="STAR SHOP" style={logo} />
          </Section>
  
          {/* Cancel Notice Banner */}
          <Section style={cancelBanner}>
            <Text style={cancelBannerText}>❌ ご注文がキャンセルされました</Text>
          </Section>
  
          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>ご注文キャンセルのお知らせ</Heading>
  
            <Text style={greeting}>{userName} 様</Text>
  
            <Text style={text}>
              以下のご注文がキャンセルされました。
              <br />
              ご不便をおかけして申し訳ございません。
            </Text>
  
            {/* Cancel Details */}
            <Section style={cancelDetailsSection}>
              <Heading style={h2}>キャンセル詳細</Heading>
  
              <Row style={detailRow}>
                <Column style={labelColumn}>
                  <Text style={label}>注文番号:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>#{orderId}</Text>
                </Column>
              </Row>
  
              <Row style={detailRow}>
                <Column style={labelColumn}>
                  <Text style={label}>キャンセル日時:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{cancelDate}</Text>
                </Column>
              </Row>
  
              <Row style={detailRow}>
                <Column style={labelColumn}>
                  <Text style={label}>ご注文者:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{userName} 様</Text>
                </Column>
              </Row>
  
              {cancelReason && (
                <Row style={detailRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>キャンセル理由:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>{cancelReason}</Text>
                  </Column>
                </Row>
              )}
            </Section>
  
            <Hr style={divider} />
  
            {/* Cancelled Products */}
            <Section style={productsSection}>
              <Heading style={h2}>キャンセルされた商品</Heading>
  
              {products.map((product, index) => (
                <Section key={index} style={productItem}>
                  <Row>
                    <Column style={productNameColumn}>
                      <Text style={productName}>{product.product_name}</Text>
                    </Column>
                    <Column style={productDetailsColumn}>
                      <Text style={productDetails}>
                        数量: {product.quantity}
                        <br />
                        金額: ¥{product.price?.toLocaleString()}
                        <br />
                        税金: ¥{product.tax_amount?.toLocaleString()}
                      </Text>
                    </Column>
                  </Row>
                  {index < products.length - 1 && <Hr style={productDivider} />}
                </Section>
              ))}
            </Section>
  
            <Hr style={divider} />
  
            {/* Refund Information */}
            <Section style={refundSection}>
              <Row>
                <Column style={refundIconColumn}>
                  <Text style={refundIcon}>💰</Text>
                </Column>
                <Column style={refundContentColumn}>
                  <Text style={refundTitle}>返金について</Text>
                  {/* <Text style={refundTitle}>8%税率</Text>
                  <Text style={refundAmount}>¥{Math.floor(eightPercentTotal)}</Text>
                  <Text style={refundTitle}>10%税率</Text>
                  <Text style={refundAmount}>¥{Math.floor(tenPercentTotal)}</Text>
                  <Text style={refundAmount}>返金予定金額: ¥{Math.floor(total)}</Text> */}
                  <Text style={refundText}>
                    返金処理は通常3〜7営業日以内に担当者によりお知らせいたします。
                    <br />
                    お支払い方法により返金までの期間が異なる場合がございます。
                  </Text>
                </Column>
              </Row>
            </Section>
  
            <Hr style={divider} />
  
            {/* Support Information */}
            <Section style={supportSection}>
              <Text style={supportTitle}>📞 お困りの際は</Text>
              <Text style={supportText}>
                ご不明点やご質問がございましたら、お気軽に 03-6661-2879 お問い合わせください。
                <br />
                カスタマーサポートが丁寧にサポートいたします。
              </Text>
            </Section>
          </Section>
  
          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>STAR SHOP（スターショップ）</strong>
              <br />
              URL:{" "}
              <Link href="https://www.starshop.co" style={link}>
                https://www.starshop.co
              </Link>
              <br />
              メール:{" "}
              <Link href="mailto:starshop@beau-tech.jp" style={link}>
                starshop@beau-tech.jp
              </Link>
              <br />
              営業時間: 平日09:00～18:00（土日祝除く）
            </Text>
  
            <Text style={disclaimer}>※このメールは自動送信です。</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
  
  // Styles
  const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  }
  
  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
  }
  
  const header = {
    padding: "20px 30px",
    backgroundColor: "#1a1a1a",
    textAlign: "center" as const,
  }
  
  const logo = {
    margin: "0 auto",
  }
  
  const cancelBanner = {
    backgroundColor: "#fef2f2",
    padding: "15px 30px",
  }
  
  const cancelBannerText = {
    color: "#dc2626",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
    textAlign: "center" as const,
  }
  
  const content = {
    padding: "30px",
  }
  
  const h1 = {
    color: "#1a1a1a",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 30px",
    textAlign: "center" as const,
  }
  
  const h2 = {
    color: "#1a1a1a",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 16px",
  }
  
  const greeting = {
    color: "#1a1a1a",
    fontSize: "16px",
    margin: "0 0 16px",
    fontWeight: "bold",
  }
  
  const text = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px",
  }
  
  const cancelDetailsSection = {
    backgroundColor: "#fef2f2",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    margin: "20px 0",
  }
  
  const detailRow = {
    marginBottom: "8px",
  }
  
  const labelColumn = {
    width: "40%",
    verticalAlign: "top" as const,
  }
  
  const valueColumn = {
    width: "60%",
    verticalAlign: "top" as const,
  }
  
  const label = {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0",
    fontWeight: "500",
  }
  
  const value = {
    color: "#1a1a1a",
    fontSize: "14px",
    margin: "0",
    fontWeight: "bold",
  }
  
  const divider = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  }
  
  const productsSection = {
    margin: "20px 0",
  }
  
  const productItem = {
    padding: "16px 0",
  }
  
  const productNameColumn = {
    width: "60%",
    verticalAlign: "top" as const,
  }
  
  const productDetailsColumn = {
    width: "40%",
    verticalAlign: "top" as const,
    textAlign: "right" as const,
  }
  
  const productName = {
    color: "#1a1a1a",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0",
  }
  
  const productDetails = {
    color: "#525f7f",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
  }
  
  const productDivider = {
    borderColor: "#f1f5f9",
    margin: "8px 0",
  }
  
  const refundSection = {
    backgroundColor: "#f0f9ff",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #bae6fd",
    margin: "20px 0",
  }
  
  const refundIconColumn = {
    width: "40px",
    verticalAlign: "top" as const,
  }
  
  const refundContentColumn = {
    verticalAlign: "top" as const,
  }
  
  const refundIcon = {
    fontSize: "24px",
    margin: "0",
  }
  
  const refundTitle = {
    color: "#0c4a6e",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 8px",
  }
  
  // const refundAmount = {
  //   color: "#dc2626",
  //   fontSize: "20px",
  //   fontWeight: "bold",
  //   margin: "0 0 12px",
  // }
  
  const refundText = {
    color: "#0c4a6e",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
  }
  
  const supportSection = {
    backgroundColor: "#fffbeb",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #fed7aa",
    margin: "20px 0",
  }
  
  const supportTitle = {
    color: "#92400e",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 12px",
  }
  
  const supportText = {
    color: "#92400e",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0",
  }
  
  const footer = {
    padding: "30px",
    backgroundColor: "#f8f9fa",
    textAlign: "center" as const,
  }
  
  const footerText = {
    color: "#525f7f",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0 0 16px",
  }
  
  const link = {
    color: "#2563eb",
    textDecoration: "underline",
  }
  
  const disclaimer = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0",
  }
  
  export default CancelOrderMail
  