import { apiRoutes } from "@/lib/api/api.route";
import { useMutation } from "@tanstack/react-query";


export const useUploadProfile = (userId: string | number, user_type: string) => {
  return useMutation({
    mutationFn: async ({
      files,
    }: {
      files: File[];
    }) => {
      return apiRoutes.admin.fileUpload.userUploadProfile(files,userId,user_type);
    },
  });
};