import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

// Routes that require authentication
const protectedRoutes = ['/account', '/checkout', '/wishlist'];

// Routes that require admin role
const adminRoutes = ['/admin'];

// Routes that should redirect to account if authenticated
const authRoutes = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create Supabase client
  const { supabase, response } = createMiddlewareClient(request);

  // Authenticate user (getUser is secure, unlike getSession)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check route type
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check admin access
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Fetch user profile to check role using service-role client to bypass RLS
    // (The profiles table RLS policy has recursion issues with the anon key)
    const { createClient } = await import('@supabase/supabase-js');
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('role, is_blocked')
      .eq('id', user.id)
      .single();

    // Check if user is blocked
    if (profile?.is_blocked) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login?error=Account suspended', request.url));
    }

    // Check if user is admin
    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect to account if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/account';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|images|icons|api/webhooks).*)',
  ],
};
