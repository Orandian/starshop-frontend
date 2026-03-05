export interface Faqs {
  faqs_id: number;
  question: string;
  answer: string;
  created_at: string;
  is_active: boolean;
}

export interface FAQ {
  faqId: number;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: [number, number, number, number, number, number, number]; // [year, month, day, hour, minute, second, millisecond]
  updatedAt: [number, number, number, number, number, number, number]; // same format as createdAt
}

export interface FAQStatus {
  faq_id: string | number;
  is_active: boolean;
}

export interface FAQPayload {
  question: string;
  answer: string;
}

export interface FAQResponse {
  status: string;
  message: string;
  code: number;
  data: FAQ[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
