import { apiRoutes } from "@/lib/api/api.route";
import { ContactFormRequest } from "@/types/faqs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use faqs
 * @returns
 * @author ヤン
 */
export const useFaqs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get("/api/faqs");
      return res.data;
    },
  });
};

/**
 * Use faqs by id
 * @param faqId - Faq id
 * @returns
 * @author ヤン
 */
export const useFaqsById = (faqId: number) => {
  return useQuery({
    queryKey: ["faqsById", faqId],
    queryFn: async () => {
      const res = await axios.get(`/api/faqs/${faqId}`);
      return res.data;
    },
  });
};


export const usePublicFaqs = () => {
  return useQuery({
    queryKey: ["faqs-public"],
    queryFn: async () => {
      return await apiRoutes.public.faqs();
    },
  });
};

export const useContactUs= () => {
  return useMutation({
    mutationFn: ({
      requestData    
    }: {
      requestData: ContactFormRequest;
    }) =>{
    const payload: ContactFormRequest = requestData;
    return apiRoutes.public.contactUs(payload);
    },
  });
};
