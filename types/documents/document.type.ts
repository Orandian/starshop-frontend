import { Brand } from "../admin/brand.type";

;

export interface Document {
  docId: number;
  docName: string;
  docPath: string;
  docType: number;
  docStatus: number;
  brand:Brand
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

export interface DocumentCreateRequest {
  docName: string;
  docPath?: string;
  docType: number;
  brandId:number;
  docStatus: number;
  file: File[];
}

export interface DocumentCreateResponse {
  status: string;
  message: string;
  code: number;
  data: Document;
}

export interface DocumentUpdateRequest {
  docId: number;
  docName?: string;
  brandId?: number;
  docPath?: string;
  docType?: number;
  docStatus?: number;
  file?: File[] ;
}

export interface DocumentUpdateResponse {
  data: Document;
}
