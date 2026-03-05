"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { createClient } from "@/utils/supabase/server";
import {
  ShippingNotificationMail,
  ShippingNotificationMailProps,
} from "@/components/mail/admin/ShippingNotificationMail";

/**
 * Send shipping notification mail to user
 * @param shippingEmailBody - Shipping email body
 * @returns Shipping notification mail result
 * @author ヤン
 */
export async function sendShippingNotificationMail(
  shippingEmailBody: ShippingNotificationMailProps
) {
  const supabase = await createClient();
  const {
    orderId,
    userName,
    userEmail,
    products,
    trackingNumber,
    carrier,
    shippingAddress,
    shippingDate,
  } = shippingEmailBody;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "ユーザー情報の取得に失敗しました。",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USERNAME,
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      },
    });

    const shippingEmailHtml = await render(
      ShippingNotificationMail({
        orderId,
        userName,
        userEmail,
        products,
        trackingNumber,
        carrier,
        shippingDate,
        shippingAddress,
      })
    );

    // Send shipping notification to customer
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: userEmail,
      subject: `【発送完了】商品を発送いたしました（注文番号: ${orderId}）`,
      html: shippingEmailHtml,
      text: `${userName} 様
  
  ご注文いただいた商品を発送いたしました。
  
  【配送情報】
  注文番号: ${orderId}
  発送日: ${shippingDate}
  配送業者: ${carrier}
  追跡番号: ${trackingNumber}
  ${shippingAddress ? `お届け先: ${shippingAddress}` : ""}
  
  配送状況は追跡番号でご確認いただけます。
  商品到着まで今しばらくお待ちください。
  
  STAR SHOP（スターショップ）
  URL: https://www.starshop.co
  メール: starshop@beau-tech.jp
  営業時間: 平日09:00～18:00（土日祝除く）
  
  ※このメールは自動送信です。`,
    });

    return {
      success: true,
      message: "発送通知メールを送信しました。",
    };
  } catch (error) {
    return {
      success: false,
      message: `メール送信に失敗しました: ${(error as Error).message}`,
    };
  }
}
