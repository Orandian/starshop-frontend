export interface Faqs {
    faqs_id: number;
    question: string;
    answer: string;
    created_at: string;
    is_active: boolean;
}

export interface FAQ{
  faqId: number;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: [number, number, number, number, number, number, number]; // [year, month, day, hour, minute, second, millisecond]
  updatedAt: [number, number, number, number, number, number, number]; // same format as createdAt
}

export interface FAQResponse {
  status: string;
  message: string;
  code: number;
  data: FAQ[];
}

export type ContactFormRequest = {
  name: string;
  phoneNumber: string;
  email: string;
  subject: string;
  body: string;
};


export interface ContactResponse {
  status: string;
  message: string;
  code: number;
}