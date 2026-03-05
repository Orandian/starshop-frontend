import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";

/**
 * Use faqs
 * @param page - Page number
 * @param pageSize - Page size
 * @param keyword - Faq keyword
 * @param status - Faq status
 * @param faqDate - Faq date (created_at)
 * @returns
 * @example
 * const { data, isLoading, error } = useFaqs(page, pageSize, keyword, status, faqDate);
 * @author ヤン
 */
export const useFaqs = (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  status: string = "",
  faqDate: string = ""
) => {
  return useQuery({
    queryKey: ["faqs", page, pageSize, keyword, status, faqDate],
    queryFn: () => apiRoutes.admin.faq.getFaqs(page, pageSize, keyword, status, faqDate),
  });
};

/**
 * Use faqs by id
 * @param faqId - Faq id
 * @returns
 * @example
 * const { data, isLoading, error } = useFaqsById(faqId);
 * @author ヤン
 */
export const useFaqsById = (faqId: number) => {
  return useQuery({
    queryKey: ["faqsById", faqId],
    queryFn: () => apiRoutes.admin.faq.getFaqById(faqId),
    select: (data) => data.data,
    enabled: !!faqId,
  });
};

/**
 * Use change faq status
 * @param faqId - Faq id
 * @param status - Faq status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeFaqStatus(faqId, status);
 * @author ヤン
 */
export const useChangeFaqStatus = (faqId: number, status: boolean) => {
  return useMutation({
    mutationKey: ["changeFaqStatus", faqId],
    mutationFn: () => apiRoutes.admin.faq.updateFaqStatus(faqId, status),
  });
};

/**
 * Use create faq
 * @param faq - Faq
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateFaq(faq);
 * @author ヤン
 * @updated Phway
 */
export const useCreateFaq = () => {
  return useMutation({
    mutationKey: ["createFaq"],
    mutationFn: (faq: { question: string; answer: string }) => apiRoutes.admin.faq.createFaq(faq),
  });
};

/**
 * Use update faq
 * @param faq - Faq
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateFaq(faq);
 * @author ヤン
 * @updated Phway
 */
export const useUpdateFaq = () => {
  return useMutation({
    mutationKey: ["updateFaq"],
    mutationFn: (faq: { question: string; answer: string; faqs_id: number }) =>
      apiRoutes.admin.faq.updateFaq(faq.faqs_id, faq),
  });
};

/**
 * Use delete faq
 * @param faqId - Faq id
 * @returns
 * @example
 * const { mutate, isLoading, error } = useDeleteFaq(faqId);
 * @author ヤン
 */
export const useDeleteFaq = () => {
  return useMutation({
    mutationFn: (faqId: number) => apiRoutes.admin.faq.deleteFaq(faqId),
  });
};
