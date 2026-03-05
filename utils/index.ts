// import { createClient } from "@/utils/supabase/client";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { QueryClient } from "@tanstack/react-query";
import { FcUserRole } from "./fc/fc-user-roles";

dayjs.extend(utc);
dayjs.extend(timezone);
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key";
const BUCKET_URL =
  process.env.NEXT_PUBLIC_BUCKET_URL ||
  "https://star-shop.s3.ap-northeast-1.amazonaws.com";

/**
 * Convert price to yen
 * @param price - Price
 * @returns Yen (ja-JP)
 * @author ヤン
 */
export const convertToYen = (price: number) => {
  const yen = "¥";
  return yen + Math.floor(price).toLocaleString("ja-JP");
};

export const parseJapaneseAddress = (address?: string) => {
  const raw = address?.trim() ?? "";
  const match = raw.match(/^(.*?[市区町村])\s*(.*)$/);

  return {
    city: match?.[1] ?? "",
    street_address: match?.[2] ?? "",
  };
};

/**
 * Convert date to locale date time
 * @param date - Date
 * @returns Locale date time (ja-JP)
 * @author ヤン
 */
export const convertToLocaleDateTime = (
  date: string,
  city: string,
  format: string = "YYYY/MM/DD"
) => {
  const convertedTime = dayjs.utc(date).tz(city).format(format);
  return convertedTime;
};

export const formatOrderDate = (orderDate: number[]) => {
  if (!orderDate || orderDate.length < 6) return "";

  const [year, month, day, hour, minute, second] = orderDate;

  // JS Date: month is 0-based
  const date = new Date(year, month - 1, day, hour, minute, second);

  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
/**
 * Get public URL
 * @param path - Path
 * @returns Public URL
 * @author ヤン
 */
export const getPublicUrl = (path: string) => {
  if (!path) return "";

  const cleanedPath = path.startsWith("/") ? path.slice(1) : path;

  const encodedPath = encodeURI(cleanedPath);

  return `${BUCKET_URL}/${encodedPath}`;
};

/**
 * Get profile image
 * @param path - Path
 * @returns Profile image URL
 * @author ヤン
 */
export const getProfileImage = (path: string) => {
  // const supabase = createClient();
  // const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
  const data = path;
  if (!data) {
    return "";
  }
  return data;
};
/**
 * Calculate price with tax
 * @param price - Price
 * @param tax - Tax
 * @returns Price with tax
 * @author ヤン
 */
export const priceWithTax = (price: number, tax: number | null) => {
  if (!tax) {
    return price;
  }
  return Math.floor(price + (price * tax) / 100);
};

/**
 * Encrypt a string using AES encryption.
 * @param str - The plain string to encrypt
 * @returns Encrypted string (Base64)
 * @author ヤン
 */
export const encryptString = (data: string) => {
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY
  ).toString();
  return btoa(cipherText)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Make URL-safe
};

/**
 * Decrypt an AES-encrypted string.
 * @param encrypted - The encrypted string (Base64)
 * @returns Decrypted plain text string
 * @author ヤン
 */
export const decryptString = (cipherText: string) => {
  try {
    const base64CipherText = cipherText.replace(/-/g, "+").replace(/_/g, "/"); // Convert back to original Base64
    const bytes = CryptoJS.AES.decrypt(atob(base64CipherText), ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    if (error) {
      return null;
    }
  }
};

/**
 * Encode a string to a URL-safe short string
 * @param data - The string to encode
 * @returns URL-safe encoded string
 * @author Paing Sett Kyaw
 */
export const encodeShortString = (data: string) => {
  const paddedData = `user:${data.padStart(6, "0")}`;
  return btoa(paddedData)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**
 * Decode a URL-safe short string back to original string
 * @param encoded - The URL-safe encoded string
 * @returns Decoded string or null if decoding fails
 * @author Paing Sett Kyaw
 */
export const decodeShortString = (encoded: string) => {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const decoded = atob(base64);
    return decoded.replace("user:", "").replace(/^0+/, "") || "0";
  } catch (_error) {
    return null;
  }
};

/**
 * Trim string to a specified length and end with "..."
 * @param str - String
 * @param length - Length
 * @returns Trimmed string
 * @author ヤン
 */
export const trimString = (str: string, length: number) => {
  if (str.length <= length) {
    return str;
  }
  return str.trim().slice(0, length) + "...";
};
/**
 *  Format  datetime
 * @param dateString
 * @returns
 */
export const formatDate = (dateString: string | number[]) => {
  if (!dateString) return "-";
  try {
    // If it's an array format: [year, month, day, hour, minute, second, millisecond]
    if (Array.isArray(dateString)) {
      const [year, month, day, hour, minute, second] = dateString;
      const paddedMonth = String(month).padStart(2, "0");
      const paddedDay = String(day).padStart(2, "0");
      const paddedHour = String(hour).padStart(2, "0");
      const paddedMinute = String(minute).padStart(2, "0");
      const paddedSecond = String(second).padStart(2, "0");
      if (paddedSecond === "undefined") {
        return `${year}/${paddedMonth}/${paddedDay} ${paddedHour}:${paddedMinute}`;
      }
      return `${year}/${paddedMonth}/${paddedDay} ${paddedHour}:${paddedMinute}:${paddedSecond}`;
    }
  } catch {
    return String(dateString); // Return original value as string if error occurs
  }
};
/**
 *  Format  date for form input (YYYY-MM-DD)
 * @param dateString
 * @returns
 */
export const formatDateForInput = (dateString: string | number[]) => {
  if (!dateString) return "-";
  try {
    // If it's an array format: [year, month, day, hour, minute, second, millisecond]
    if (Array.isArray(dateString)) {
      const [year, month, day] = dateString;
      const paddedMonth = String(month).padStart(2, "0");
      const paddedDay = String(day).padStart(2, "0");
      return `${year}-${paddedMonth}-${paddedDay}`;
    }
  } catch {
    return String(dateString); // Return original value as string if error occurs
  }
};

/**
 *  Format  date
 * @param dateString
 * @returns
 */
export const formatDate2 = (dateString: string | number[]) => {
  if (!dateString) return "-";
  try {
    // If it's an array format: [year, month, day, hour, minute, second, millisecond]
    if (Array.isArray(dateString)) {
      const [year, month, day] = dateString;
      const paddedMonth = String(month).padStart(2, "0");
      const paddedDay = String(day).padStart(2, "0");
      return `${year}/${paddedMonth}/${paddedDay}`;
    }
  } catch {
    return String(dateString); // Return original value as string if error occurs
  }
};

/**
 *  Format  date
 * @param dateString
 * @returns
 */
export const orderFormatDate = (dateString: string | number[]) => {
  if (!dateString) return "-";
  try {
    // If it's an array format: [year, month, day, hour, minute, second, millisecond]
    if (Array.isArray(dateString)) {
      const [year, month, day] = dateString;
      const paddedMonth = String(month).padStart(2, "0");
      const paddedDay = String(day).padStart(2, "0");
      return `${year}${paddedMonth}${paddedDay}`;
    }
  } catch {
    return String(dateString); // Return original value as string if error occurs
  }
};

/**
 * Convert date array to string
 * @param arr
 * @returns
 */
export const dateArrayToString = (arr: number[]) => {
  const [y, m, d, hh, mm, ss] = arr;

  return dayjs(new Date(y, m - 1, d, hh, mm, ss)).format("YYYY/MM/DD HH:mm");
};

/**
 * Convert to Japanese date
 * @param date
 * @returns
 */
export const convertToJapaneseDate = (date: string | number[]) => {
  if (Array.isArray(date)) {
    return convertToJapaneseDate2(date);
  }
  const dayjsDate = dayjs(date).tz("Asia/Tokyo");
  const month = String(dayjsDate.month() + 1).padStart(2, "0");
  return `${dayjsDate.year()}年${month}月${dayjsDate.date()}日`;
};

/**
 * Convert to Japanese date from array
 * @param date
 * @returns
 */
export const convertToJapaneseDate2 = (date: number[]) => {
  const [year, month, day] = date;
  const month1 = String(month).padStart(2, "0");
  return `${year}年${month1}月${day}日`;
};

/**
 * Navigate to delivery service tracking page
 * @param code - Tracking number
 * @param type - Delivery service type
 * @returns URL for tracking page
 */
export const navigateToDeliveryService = (
  code: string = "",
  type: number
): string => {
  if (!code) return "#";
  switch (type) {
    case 1: // クロネコヤマト
      return `https://jizen.kuronekoyamato.co.jp/jizen/servlet/crjz.b.NQ0010?id=${code}`;
    case 2: // 佐川急便
      return `https://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo=${code}`;
    case 3: // 日本郵便
      return `https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1=${code}`;
    case 4: // DHL
      return `https://www.dhl.com/en/express/tracking.html?AWB=${code}&brand=DHL`;
    case 5: // FedEx
      return `https://www.fedex.com/fedextrack/?tracknumbers=${code}&cntry_code=jp`;
    default:
      return "";
  }
};

/**
 * Get order status text
 * @param status - Order status number
 * @returns Japanese status text
 */
export const getOrderStatus = (status: number, isAdmin: boolean = false) => {
  switch (status) {
    case -1:
      return "-1:クレジットカード支払い待ち";
    case 1:
      return isAdmin ? "新規受付" : "支払い済み";
    case 2:
      return "配送済み";
    case 3:
      return "入金待ち";
    case 4:
      return "失敗";
    case 5:
      return "キャンセル";
  }
};

/**
 * Get order status class for styling
 * @param status - Order status number
 * @returns CSS class for status styling
 */
export const getOrderStatusClass = (status: number) => {
  switch (status) {
    case -1:
      return "bg-yellow-100 text-yellow-800";
    case 1:
      return "bg-green-100 text-green-800";
    case 2:
      return "bg-blue-100 text-blue-800";
    case 3:
      return "bg-purple-100 text-purple-800";
    case 4:
      return "bg-red-100 text-red-800";
    case 5:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const userType = (type: number) => {
  switch (type) {
    case FcUserRole.MANAGER:
      return "代理店マネージャー";
    case FcUserRole.CONSULTANT:
      return "代理店コンサルタント";
    case FcUserRole.LEADER:
      return "代理店リーダー";
    case FcUserRole.SPECIALIST:
      return "代理店スペシャリスト";
    case FcUserRole.NORMAL:
      return "代理店メンバー";
  }
};

/**
 * Get class => used in admin customer list page
 * @param userType
 * @param bonusType which is fcRole
 * @returns
 */
export const getUserTypeClass = (userType: number, bonusType: number) => {
  if (userType === 3) return "bg-yellow-100 text-yellow-800";
  if (userType === 2) {
    switch (bonusType) {
      case FcUserRole.MANAGER:
        return "bg-green-100 text-green-800";
      case FcUserRole.CONSULTANT:
        return "bg-blue-100 text-blue-800";
      case FcUserRole.LEADER:
        return "bg-purple-100 text-purple-800";
      case FcUserRole.SPECIALIST:
        return "bg-red-100 text-red-800";
      case FcUserRole.NORMAL:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
};

/**
 * getUserType => used in admin customer list page
 * @param type
 * @param bonusType = fcRole
 * @returns
 */
export const getUserType = (type: number, bonusType: number) => {
  if (type === 3) return "一般顧客";
  if (type === 2) {
    return userType(bonusType);
  }
};

// all => fc.role 1, 2, 3, 4, 5 and user
// memberfees => fc.role 1, 2, 3, 4, 5
// adminfees =>  fc.role 1, 2, 3, 4
/**
 * bonus type => used in admin customer list
 * @param type
 * @param bonusType
 * @returns
 */
export const getBonusType = (type: number, bonusType: number) => {
  if (type === 3) return [];
  if (type === 2) {
    if (bonusType === FcUserRole.NORMAL) {
      return [{ label: "募集お祝金", color: "bg-yellow-100 text-yellow-800" }];
    } else {
      return [
        { label: "募集お祝金", color: "bg-yellow-100 text-yellow-800" },
        { label: "管理費", color: "bg-blue-100 text-blue-800" },
      ];
    }
  }
};

/**
 * formatId
 * @param createdAt
 * @param id
 * @returns
 */
export const formatId = (
  createdAt:
    | [number, number, number, number, number, number, number]
    | number[],
  id: number
) => {
  // Extract year, month, day
  const [year, month, day] = createdAt;

  // Format each component to ensure 2 digits for month and day
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  // Combine into YYYYMMDDID format
  return `#${year}${formattedMonth}${formattedDay}-${id}`;
};

let queryClient: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  queryClient = client;
};

export const clearAllQueries = () => {
  if (queryClient) {
    queryClient.clear();
  }
};

export const getPlanName = (planId: number) => {
  switch (planId) {
    case 1:
      return "スタンダード";
    case 2:
      return "ゴールド";
    default:
      return "";
  }
};
