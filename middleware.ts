import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   // return await updateSession(request)
// }

const publicPaths = [
  "/aboutus",
  "/login",
  "/signup",
  "/change-password",
  "/commercial",
  "/company-profile",
  "/contactus",
  "/dpl",
  "/error",
  "/exomere",
  "/newarrival",
  "/news",
  "/philosophy",
  "/policy",
  "/products",
  "/ranking",
  "/reset-password",
  "/rule",
  "/stemcells",
  "/verify-email",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const user = JSON.parse(req.cookies.get("user")?.value || "{}");
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If user is logged in and tries to access login page, redirect to dashboard (Admin)
  if (token && isPublicPath && user.userType === 1) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // If user is logged in and tries to access login page, redirect to dashboard (FC)
  if (token && isPublicPath && user.userType === 2) {
    return NextResponse.redirect(new URL("/fc", req.url));
  }

  const isRegistrationPath =
    pathname.startsWith("/fc/register") ||
    pathname.startsWith("/fc/jp/partner/");
  if (
    !isRegistrationPath &&
    (pathname.startsWith("/admin") || pathname.startsWith("/fc")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is logged in and tries to access root, redirect to dashboard
  if (pathname === "/" && token) {
    if (user.userType === 1) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (user.userType === 2) {
      return NextResponse.redirect(new URL("/fc", req.url));
    }
  }
  // For all other cases, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except:
    // - Static files
    // - Images
    // - Public assets like favicon or image files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/admin/:path*",
    "/fc/:path*",
    "/login",
    "/signup",
    "/change-password",
    "/commercial",
    "/company-profile",
    "/contactus",
    "/dpl",
    "/error",
    "/exomere",
    "/newarrival",
    "/news",
    "/philosophy",
    "/policy",
    "/products",
    "/ranking",
    "/reset-password",
    "/rule",
    "/stemcells",
    "/verify-email",
  ],
};
