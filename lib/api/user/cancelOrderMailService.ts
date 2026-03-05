"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { createClient } from "@/utils/supabase/server";
import { CancelOrderMail as CustomerCancelOrderMail } from "@/components/mail/user/CancelOrderMail";
import { CancelOrderMail as AdminCancelOrderMail } from "@/components/mail/admin/CancelOrderMail";

type ProductItem = {
  product_name: string;
  quantity: number;
  price: number;
  tax_amount: number;
};

type CancelOrderEmailBody = {
  orderId: number;
  total: number;
  eightPercentTotal: number;
  tenPercentTotal: number;
  products: ProductItem[];
  cancelReason?: string;
  username: string;
};

/**
 * Create order cancellation mail with beautiful HTML templates
 * @param cancelOrderEmailBody - Cancel order email body
 * @returns Created cancel order mail result
 * @author ヤン
 */
export async function cancelOrderMail(
  cancelOrderEmailBody: CancelOrderEmailBody
) {
  const supabase = await createClient();
  const {
    orderId,
    total,
    eightPercentTotal,
    tenPercentTotal,
    products,
    cancelReason,
    username,
  } = cancelOrderEmailBody;

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

  const userEmail = user.email || "";
  const cancelDate = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

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

    const customerCancelEmailHtml = await render(
      CustomerCancelOrderMail({
        orderId,
        userName: username,
        userEmail,
        products,
        total,
        eightPercentTotal,
        tenPercentTotal,
        cancelReason,
        cancelDate,
      })
    );

    const adminCancelEmailHtml = await render(
      AdminCancelOrderMail({
        orderId,
        userName: username,
        userEmail,
        products,
        total,
        eightPercentTotal,
        tenPercentTotal,
        cancelReason,
        cancelDate,
      })
    );

    // Send cancellation email to customer
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: userEmail,
      subject: `【Star Shop】注文番号: ${orderId} のキャンセルが完了しました`,
      html: customerCancelEmailHtml,
      text: `${username} 様
  
  ご注文番号: ${orderId} のキャンセルが完了いたしました。
  
  【キャンセル詳細】
  注文番号: ${orderId}
  キャンセル日時: ${cancelDate}
  8%税率: ¥${Math.floor(eightPercentTotal).toLocaleString()}
  10%税率: ¥${Math.floor(tenPercentTotal).toLocaleString()}
  返金予定金額: ¥${Math.floor(total).toLocaleString()}
  ${cancelReason ? `キャンセル理由: ${cancelReason}` : ""}
  
  返金処理は通常3〜7営業日以内に完了いたします。
  ご不明点がございましたら、お気軽にお問い合わせください。
  
  STAR SHOP（スターショップ）
  URL: https://www.starshop.co
  メール: starshop@startech.co.jp
  営業時間: 平日09:00～18:00（土日祝除く）
  
  ※このメールは自動送信です。`,
    });

    // Send cancellation notification to admin
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: process.env.NEXT_PUBLIC_MAIL_ADMIN_ADDRESS,
      subject: `【注文キャンセル通知】注文番号: ${orderId}（STAR SHOP）`,
      html: adminCancelEmailHtml,
      text: `管理者様
  
  以下の注文がキャンセルされました。返金処理等の対応をお願いいたします。
  
  ■ 注文番号 : ${orderId}
  ■ お客様名 : ${username}
  ■ メールアドレス : ${userEmail}
  ■ キャンセル日時 : ${cancelDate}
  ■ 8%税率: ¥${eightPercentTotal.toLocaleString()}
  ■ 10%税率: ¥${tenPercentTotal.toLocaleString()}
  ■ 返金予定金額: ¥${total.toLocaleString()}
  ${cancelReason ? `■ キャンセル理由: ${cancelReason}` : ""}
  
  【必要なアクション】
  • 返金処理の実行
  • 在庫の復元確認
  • 発送済みの場合は回収手配
  • お客様への返金完了通知
  
  STAR SHOP（スターショップ）
  管理通知システム
  自動送信日時: ${cancelDate}
  
  ※このメールは自動送信です。`,
    });

    return {
      success: true,
      message: "キャンセルメールを送信しました。",
    };
  } catch (error) {
    return {
      success: false,
      message: `メール送信に失敗しました: ${(error as Error).message}`,
    };
  }
}
