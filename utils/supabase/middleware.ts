import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { errorResponse } from '@/lib/api/response';
import { MESSAGES } from '@/types/messages';

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const publicPaths = [
    '/',
    '/products',
    '/exomere',
    '/dpl',
    '/news',
    '/policy',
    '/commercial',
    '/aboutus',
    '/contactus',
    '/rule',
    '/login',
    '/auth',
    '/verify-email',
    '/verify-forgot-email',
    '/error',
    '/signup',
    '/reset-password',
    '/change-password',
    '/usepoints',
    '/philosophy',
    '/stemcells',
    '/ranking',
    '/newarrival',
    '/company-profile'
  ];

  const currentPath = request.nextUrl.pathname;

  const isPublic = publicPaths.some(p =>
    p === '/' ? currentPath === '/' : currentPath.startsWith(p)
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            supabaseResponse.cookies.set(name, value)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /api/admin
  if (currentPath.startsWith('/api/admin')) {
    if (!user) {
      return errorResponse(MESSAGES.COMMON.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { data, error } = await supabase
      .from('users')
      .select('user_type, is_active')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data || data.user_type !== 'admin' || !data.is_active) {
      if (!data?.is_active) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/', request.url));
      }
      return errorResponse(MESSAGES.COMMON.UNAUTHORIZED, 'Unauthorized', 403);
    }

    return supabaseResponse;
  }

  // Protect /api/user
  if (currentPath.startsWith('/api/user')) {
    if (!user) {
      return errorResponse(MESSAGES.COMMON.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { data, error } = await supabase
      .from('users')
      .select('user_type, is_active')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data || data.user_type !== 'customer' || !data.is_active) {
      if (!data?.is_active) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/', request.url));
      }
      return errorResponse(MESSAGES.COMMON.UNAUTHORIZED, 'Unauthorized', 403);
    }

    return supabaseResponse;
  }

  // Allow other API routes
  if (currentPath.startsWith('/api')) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users from private routes to login
  if (!user) {
    if (isPublic) return supabaseResponse;

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Get user data
  const { data, error } = await supabase
    .from('users')
    .select('user_type, is_active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return supabaseResponse;
  }

  // Force logout for inactive users
  if (data.is_active === false && !currentPath.startsWith('/login')) {
    await supabase.auth.signOut();

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('reason', 'inactive');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Block admin from visiting public routes
  if (data.user_type === 'admin' && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Redirect admin to dashboard if not in /admin
  if (data.user_type === 'admin' && !currentPath.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Redirect customer if trying to access admin area
  if (data.user_type !== 'admin' && currentPath.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

