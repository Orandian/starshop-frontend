import { ApiResponse } from "../api/api-response";

export interface InvoiceResponse {
  data: Invoice[];
  pagination: Pagination;
  extra: ExtraInvoiceData;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface Invoice {
  id:number;
  userId:number;
  userName: string;
  totalAmount: number;
  status: number;
  idNumber: string;
  orderId: number;
  orderNumber: string;
  createdAt: number[];
  year: string;
  month: string;
}

export interface userInvoiceResponse {
  data: Invoice;
  message: string;
  code: string;
  status: string;
}

export interface ExtraInvoiceData{
    totalInvoices: number,
    totalReceipts: number,
}

export type UpdateInvoiceStatus = {
  invoiceId: number | string;
  status: number;
  userType: string;
};

export type UpdateInvoiceStatusResponse = {
 status: string,
 message: string,
 code: string,
};
