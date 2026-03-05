"use server"

import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { createClient } from "@/utils/supabase/server"
import { ConfirmOrderMail as CustomerOrderConfirmation } from "@/components/mail/user/ConfirmOrderMail"
import { ConfirmOrderMail as AdminOrderConfirmation } from "@/components/mail/admin/ConfirmOrderMail"

type ProductItem = {
  name: string
  quantity: number
  price: number
  taxPrice: number
}

type OrderEmailBody = {
  email?: string
  orderId: number
  username: string
  total: number
  products: ProductItem[]
}

/**
 * Create order mail with beautiful HTML templates
 * @param orderEmailBody - Order email body
 * @returns Created order mail result
 * @author ヤン
 */
export async function createOrderMail(orderEmailBody: OrderEmailBody) {
  const supabase = await createClient()
  const { email, orderId, username, total, products } = orderEmailBody;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!email && (userError || !user)) {
    return {
      success: false,
      message: "メールアドレスまたはユーザー情報の取得に失敗しました。",
    }
  }

  const userName = username
  const userEmail = email || user?.email || ""
  const orderDate = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  })

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      },
    })

    const customerEmailHtml = await render(
      CustomerOrderConfirmation({
        orderId,
        userName,
        userEmail,
        products,
        total,
      }),
    )

    const adminEmailHtml = await render(
      AdminOrderConfirmation({
        orderId,
        userName,
        userEmail,
        products,
        total,
        orderDate,
      }),
    )

    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: userEmail,
      subject: `【ご注文確認】ご注文ありがとうございます（注文番号: ${orderId}）`,
      html: customerEmailHtml,
      text: `${userName} 様

            この度は STAR SHOP にてご注文いただき、誠にありがとうございます。
            以下の内容でご注文を承りました。

            【注文番号】: ${orderId}
            【ご注文者】: ${userName}
            【メールアドレス】: ${userEmail}
            【合計金額】: ¥${total.toLocaleString()}

            商品は通常、2〜5営業日以内に発送いたします。
            ご不明点がございましたら、お気軽にお問い合わせください。

            STAR SHOP（スターショップ）
            URL: https://www.starshop.co
            メール: starshop@beau-tech.jp
            営業時間: 平日09:00～18:00（土日祝除く）

            ※このメールは自動送信です。`,
    })

    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: process.env.NEXT_PUBLIC_MAIL_ADMIN_ADDRESS,
      subject: `【新規注文通知】注文番号: ${orderId}（STAR SHOP）`,
      html: adminEmailHtml,
      text: `管理者様

            以下の内容で新しい注文が入りました。

            ■ 注文番号 : ${orderId}
            ■ お名前   : ${userName}
            ■ メールアドレス : ${userEmail}
            ■ 合計金額: ¥${total.toLocaleString()}

            至急ご確認ください。

            STAR SHOP（スターショップ）
            管理通知システム
            自動送信日時: ${orderDate}

            ※このメールは自動送信です。`,
    })

    return {
      success: true,
      message: "注文メールを送信しました。",
    }
  } catch (error) {
    return {
      success: false,
      message: `メール送信に失敗しました: ${(error as Error).message}`,
    }
  }
}
