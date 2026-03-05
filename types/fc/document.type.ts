import { FCBrand } from "./plan.type";

export interface Document {
  docId: number;
  docName: string;
  docPath: string;
  docType: number;
  brand: FCBrand
  docStatus: number;
  createdAt: number[];
  updatedAt: number[];
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface DocumentResponse {
  data: Document[];
  pagination: Pagination;
}

// Document type enum for better type safety
export enum DocumentType {
  TYPE_1 = 1,
  TYPE_2 = 2,
  // Add more types as needed
}

// Document status enum
export enum DocumentStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  // Add more statuses as needed
}