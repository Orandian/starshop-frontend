// hooks/fc/useFileUpload.ts
import { apiRoutes } from "@/lib/api/api.route";
import { useMutation } from "@tanstack/react-query";

export const useFCUploadFiles = () => {
  return useMutation({
    mutationFn: async ({
      signPath,
    }: {
      signPath: string;
    }) => {
      return apiRoutes.fc.fileUpload.fcUploadSignature(signPath);
    },
  });
};

export const useFCUploadProfile = () => {
  return useMutation({
    mutationFn: async ({
      files,
    }: {
      files: File[];
    }) => {
      return apiRoutes.fc.fileUpload.fcUploadProfile(files);
    },
  });
};