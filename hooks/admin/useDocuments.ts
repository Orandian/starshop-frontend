import { apiRoutes } from "@/lib/api/api.route";
import {
  DocumentCreateRequest,
  DocumentUpdateRequest,
} from "@/types/documents/document.type";
import { useMutation, useQuery } from "@tanstack/react-query";

// Get documents
export const useDocuments = (
  page: number,
  pageSize: number,
  searchDocumentName: string,
  searchStatus: string,
  searchDocumentDate: string,
  searchBrandId: string
) => {
  return useQuery({
    queryKey: [
      "documents",
      page,
      pageSize,
      searchDocumentName,
      searchStatus,
      searchDocumentDate,
      searchBrandId,
    ],
    queryFn: async () =>
      apiRoutes.admin.document.getDocuments(
        page,
        pageSize,
        searchDocumentName,
        searchStatus,
        searchDocumentDate,
        searchBrandId
      ),
  });
};

// Change document status
export const useChangeDocumentStatus = (
  documentId: number,
  status: boolean
) => {
  return useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/documents/${documentId}/status`, {
      //   method: "PATCH",
      //   body: JSON.stringify({ is_active: status }),
      // });
      // return response.json();

      // Mock response for now
      return {
        data: {
          message: "ステータスを変更しました",
        },
      };
    },
  });
};

// Create document
export const useCreateDocument = () => {
  return useMutation({
    mutationKey: ["documents"],
    mutationFn: async (document: DocumentCreateRequest) =>
      apiRoutes.admin.document.createDocument(document),
  });
};

//update document
export const useUpdateDocument = () => {
  return useMutation({
    mutationKey: ["documents"],
    mutationFn: async (document: DocumentUpdateRequest) =>
      apiRoutes.admin.document.updateDocument(document),
  });
};
