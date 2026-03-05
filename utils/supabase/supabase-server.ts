import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
      },
    }
  );
}
