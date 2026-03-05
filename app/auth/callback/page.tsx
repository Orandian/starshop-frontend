"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";
// import { toast } from "sonner";
// import { MESSAGES } from "@/types/messages";

export default function AuthCallback() {
  // const router = useRouter();
  // const supabase = createClient();

  // useEffect(() => {
  //   const handleAuthCallback = async () => {
  //     const { data, error } = await supabase.auth.getSession();

  //     if (error) {
  //       toast.error(MESSAGES.COMMON.AUTHENTICATE_FAILED);
  //       router.push("/signup");
  //       return;
  //     }

  //     if (data.session) {
  //       const { data: existingUser } = await supabase
  //         .from("users")
  //         .select("*")
  //         .eq("user_id", data.session.user.id)
  //         .maybeSingle();

  //       if (!existingUser) {
  //         const { error: userError } = await supabase.from("users").insert({
  //           user_id: data.session.user.id,
  //           username:
  //             data.session.user.user_metadata?.full_name ||
  //             data.session.user.email?.split("@")[0],
  //           email: data.session.user.email,
  //           last_login: new Date(),
  //         });

  //         if (userError) {
  //           toast.error(MESSAGES.COMMON.GOOGLE_LOGIN_FAILED);
  //           return;
  //         }

  //         toast.success("新規ユーザーを作成しました");
  //       } else if (existingUser.is_active === true) {
  //         const { error: userError } = await supabase
  //           .from("users")
  //           .update({
  //             last_login: new Date(),
  //           })
  //           .eq("user_id", data.session.user.id);

  //         if (userError) {
  //           toast.error(MESSAGES.COMMON.GOOGLE_LOGIN_FAILED);
  //         }

  //         toast.success(MESSAGES.COMMON.GOOGLE_LOGIN_SUCCESS);
  //       }

  //       router.push("/");
  //     } else {
  //       toast.error(MESSAGES.COMMON.GOOGLE_LOGIN_FAILED);
  //       router.push("/signup");
  //     }
  //   };

  //   handleAuthCallback();
  // }, [router, supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">Completing sign up...</p>
      </div>
    </div>
  );
}
