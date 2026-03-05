/**
 * Upload profile image
 * @param file - File
 * @returns
 * @author ヤン
 */
// export const uploadProfileImage = async (file: File) => {
//   const supabase = createClient();
//   const { data: userData } = await supabase.auth.getUser();
//   const userId = userData?.user?.id;

//   // Check if user is authenticated
//   if (!userId) throw new Error("User not authenticated");

//   // Get user profile
//   const { data: profile } = await supabase
//     .from("users")
//     .select("user_photo")
//     .eq("user_id", userId)
//     .single();

//   // Generate file path
//   const timestamp = new Date().toISOString();
//   const filePath = `profile/${userId}/${timestamp}-${file.name}`;

//   // Delete old profile image if exists
//   if (profile?.user_photo) {
//     await supabase.storage.from("profile-images").remove([profile.user_photo]);
//   }

//   // Upload new profile image
//   const { data, error } = await supabase.storage
//     .from("profile-images")
//     .upload(filePath, file, { upsert: true });

//   // Check if upload was successful
//   if (error) {
//     throw error;
//   }

//   // Update user profile
//   await supabase
//     .from("users")
//     .update({
//       user_photo: data.path,
//     })
//     .eq("user_id", userId);

//   // Get public URL
//   const { data: urlData } = supabase.storage
//     .from("profile-images")
//     .getPublicUrl(data.path);

//   return {
//     success: true,
//     message: "Image uploaded successfully",
//     data: urlData.publicUrl,
//   };
// };


