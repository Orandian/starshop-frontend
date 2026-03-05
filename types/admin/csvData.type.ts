export interface CSVRow {
  注文ID: string; //orderId
  伝票番号: string; //trackingNumber
  発送日: string; //shippingDate
  運送会社: string; //deliveryCompany
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validData: CSVRow[];
}

export interface ImportCSVResponse {
  status: "OK";
  message: null;
  code: 200;
  data: {
    successCount: number;
    failureCount: number;
    errors: string[];
  };
}
