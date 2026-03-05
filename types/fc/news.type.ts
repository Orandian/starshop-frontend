import { Pagination } from "./document.type";

export interface NewsItem {
  newsId: number;
  title: string;
  content: string;
  newsDate: number[];
  isActive: boolean;
  target: number;
  createdAt: number[];
  updatedAt: number[];
}

export interface NewsResponse {
  data: NewsItem[];
  pagination: Pagination;
  extra: null;
}
