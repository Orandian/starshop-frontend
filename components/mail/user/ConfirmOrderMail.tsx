import { convertToYen } from "@/utils"
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
    name: string
    quantity: number
    price: number
    taxPrice: number
  }
  
  interface ConfirmOrderMailProps {
    orderId: number
    userName: string
    userEmail: string
    products: ProductItem[]
    total: number
  }
  
  export const ConfirmOrderMail = ({
    orderId,
    userName,
    userEmail,
    products,
    total,
  }: ConfirmOrderMailProps) => (
    <Html>
      <Head />
      <Preview>ご注文ありがとうございます - STAR SHOP</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img src="https://oyoazrgseubztzqrrrbu.supabase.co/storage/v1/object/public/profile-images//logo.png" width="60" height="60" alt="STAR SHOP" style={logo} />
          </Section>
  
          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>ご注文ありがとうございます</Heading>
  
            <Text style={greeting}>{userName} 様</Text>
  
            <Text style={text}>
              この度は STAR SHOP にてご注文いただき、誠にありがとうございます。
              <br />
              以下の内容でご注文を承りました。
            </Text>
  
            {/* Order Details */}
            <Section style={orderDetailsSection}>
              <Heading style={h2}>ご注文詳細</Heading>
  
              <Row style={orderInfoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>注文番号:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>#{orderId}</Text>
                </Column>
              </Row>
  
              <Row style={orderInfoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>ご注文者:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{userName}</Text>
                </Column>
              </Row>
  
              <Row style={orderInfoRow}>
                <Column style={labelColumn}>
                  <Text style={label}>メールアドレス:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{userEmail}</Text>
                </Column>
              </Row>
            </Section>
  
            <Hr style={divider} />
  
            {/* Products */}
            <Section style={productsSection}>
              <Heading style={h2}>ご注文商品一覧</Heading>
  
              {products.map((product, index) => (
                <Section key={index} style={productItem}>
                  <Row>
                    <Column style={productNameColumn}>
                      <Text style={productName}>{product.name}</Text>
                    </Column>
                    <Column style={productDetailsColumn}>
                      <Text style={productDetails}>
                        数量: {product.quantity}
                        <br />
                        金額: {convertToYen(product.price)}
                        <br />
                        税金: {convertToYen(product.taxPrice)}
                      </Text>
                    </Column>
                  </Row>
                  {index < products.length - 1 && <Hr style={productDivider} />}
                </Section>
              ))}
            </Section>
  
            <Hr style={divider} />
  
            {/* Total */}
            <Section style={totalSection}>
              <Row>
                <Column style={totalLabelColumn}>
                  <Text style={totalLabel}>合計金額:</Text>
                </Column>
                <Column style={totalValueColumn}>
                  <Text style={totalValue}>{convertToYen(total)}</Text>
                </Column>
              </Row>
            </Section>
  
            <Hr style={divider} />
  
            {/* Shipping Info */}
            <Section style={shippingInfo}>
              <Text style={text}>
                商品は通常、2〜5営業日以内に発送いたします。
                <br />
                ご不明点がございましたら、お気軽にお問い合わせください。
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
  
  const orderDetailsSection = {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    margin: "20px 0",
  }
  
  const orderInfoRow = {
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
  
  const totalSection = {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "8px",
    margin: "20px 0",
  }
  
  const totalLabelColumn = {
    width: "70%",
    verticalAlign: "middle" as const,
  }
  
  const totalValueColumn = {
    width: "30%",
    verticalAlign: "middle" as const,
    textAlign: "right" as const,
  }
  
  const totalLabel = {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
  }
  
  const totalValue = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
  }
  
  const shippingInfo = {
    backgroundColor: "#eff6ff",
    padding: "20px",
    borderRadius: "8px",
    margin: "20px 0",
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
  
  export default ConfirmOrderMail
  