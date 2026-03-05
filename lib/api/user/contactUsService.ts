"use server";

import nodemailer from "nodemailer";

export const contactUs = async ({
  name,
  phone,
  email,
  subject,
  message,
}: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}) => {
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

    // Send mail to customer
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: email,
      subject: "【自動返信】お問い合わせありがとうございます（STAR SHOP）",
      text: `
${name} 様

この度は STAR SHOP にお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けいたしました。

------------------------------------------------
【お名前】  : ${name}
【メールアドレス】: ${email}
【電話番号】: ${phone}
【件名】: ${subject}
【お問い合わせ内容】:
${message}
------------------------------------------------

担当者より、2〜3営業日以内にご連絡差し上げますので、今しばらくお待ちくださいませ。

なお、このメールは自動送信です。
ご返信いただいてもお返事できませんので、ご了承ください。

────────────────────────────
STAR SHOP（スターショップ）
URL: https://www.starshop.co
メール: support@beau-tech.co.jp
専用窓口：03-5801-5968【コスメ事業】
────────────────────────────
            `,
    });

    // Send mail to admin
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_SMTP_USERNAME,
      to: process.env.NEXT_PUBLIC_MAIL_ADMIN_ADDRESS,
      subject:
        "【お客様問い合わせ通知】新しいお問い合わせが届きました（STAR SHOP）",
      text: `
管理者様

以下の内容で、お客様よりお問い合わせが届きました。

━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お名前       : ${name}
■ メールアドレス : ${email}
■ 電話番号 : ${phone}
■ 件名 : ${subject}
■ お問い合わせ内容 :
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━

至急ご確認のうえ、対応をお願いいたします。

────────────────────────────
STAR SHOP（スターショップ）管理通知システム
自動送信日時: ${new Date().toLocaleString()}
────────────────────────────
※このメールは自動送信です。
            `,
    });

    return {
      success: true,
      message: "お問い合わせありがとうございます。",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
};
