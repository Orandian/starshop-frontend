import { Pagination } from "../dashboard/products";

export interface News {
    news_id: number;
    title: string;
    content: string;
    news_date: string;
    is_active: boolean;
}

export interface NewsResponse {
  status: string;
  message: string;
  code: number;
  data: NewsItem[];
  pagination: Pagination
}

export interface NewsItem {
  newsId: number;
  title: string;
  content: string;
  newsDate: [number, number, number]; // [YYYY, M, D]
  isActive: boolean;
  target?: number;
  expireLength?: number;
  expireType?: number;
  createdAt: [number, number, number, number, number, number, number];
  updatedAt: [number, number, number, number, number, number, number];
}

export interface DateTimeArray {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface NewsList {
    newsId: number;
    title: string;
    content: string;
    newsDate: string[];
    isActive: boolean;
}
