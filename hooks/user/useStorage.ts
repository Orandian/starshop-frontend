import { useMutation } from "@tanstack/react-query";
import { putObjects, Photo } from "@/lib/api/aws/putObjects";
import { api } from "@/lib/api/api.gateway";

/**
 * Use upload profile image
 * @param args - Upload profile image args
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUploadProfileImage(file);
 * @author ヤン
 */
// export const useUploadProfileImage = () => {
//   return useMutation({
//     mutationFn: async (file: File) => {
//       return await uploadProfileImage(file);
//     },
//   });
// };


export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: async ({
      file,
    }: {
      file: File;
    }) => {
      return ProductImageData.uploadProductImages({file});
    },
  });
};

const ProductImageData = {
  uploadProductImages: async ({
    file,
  }: {
    file: File;
  }) => {
    // Upload files to S3
    const photos: Photo[] = [
        {
          id: Date.now(),
          file: file,
          imgUrl: "",
        },
    ];

    const uploadedPhotos = await putObjects(`user`, photos);
    // Save image records to backend
    const photoUrl = uploadedPhotos[0].imgUrl;
    return api.patch(`/user/profile`, {
      userPhoto: photoUrl,
    });
  }
}