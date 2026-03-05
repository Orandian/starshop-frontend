import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

export const useGetDocumentList = (page: number, pageSize: number) =>
  useQuery({
    queryKey: ["document-list"],
    queryFn: () => apiRoutes.fc.document.fcGetDocumentList(page, pageSize),
  });
