export interface ApiTypeError extends Error {
  response?: {
    data?: {
      errors?: string[];
      message?: string;
    };
  };
  data?: {
    errors?: string[];
    message?: string;
  };
}