export type BrandType = {
  brandId: number;
  name: string;
};

export type PaginationType = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
};

export type BrandResponseData = {
  data: BrandType[];
  pagination: PaginationType;
};

export type BrandResponse = {
  status: string;   // "OK"
  message: string;  // "ブランド情報の取得が完了しました。"
  code: number;     // 200
  data: BrandResponseData;
};
