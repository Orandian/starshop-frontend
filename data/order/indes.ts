import { FcUserRole } from "@/utils/fc/fc-user-roles";

export const orderStatus = [
  { value: -1, label: "クレジットカード支払い待ち" }, // Waiting for credit card payment
  { value: 1, label: "支払い確認済み" },               // Payment confirmed
  { value: 2, label: "配送済み" },                     // Shipped / Delivered
  { value: 3, label: "入金確認待ち" },                 // Waiting for payment confirmation
  { value: 4, label: "失敗" },                         // Failed
  { value: 5, label: "キャンセル" },                   // Canceled
];

export const shippingCompany = [
  { value: 1, label: "ヤマト運輸" },
  { value: 2, label: "佐川急便" },
  { value: 3, label: "日本郵便" },
  { value: 4, label: "DHL" },
  { value: 5, label: "FedEx" },
];

export const userType = [
  { value: 1, label: "管理者" },
  { value: 2, label: "代理店" },
  { value: 3, label: "一般" },
  { value: 4, label: "愛用者" },
];

export const fcRoles = [
  { value: FcUserRole.MANAGER, label: "代理店マネージャー" },
  { value: FcUserRole.CONSULTANT, label: "代理店コンサルタント" },
  { value: FcUserRole.LEADER, label: "代理店リーダー" },
  { value: FcUserRole.SPECIALIST, label: "代理店スペシャリスト" },
  { value: FcUserRole.NORMAL, label: "代理店メンバー" },
]

