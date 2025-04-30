import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes config
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                         req.nextUrl.pathname.startsWith('/profile');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                    req.nextUrl.pathname.startsWith('/register');

  // If accessing a protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    // Add original URL as redirect parameter
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth routes with active session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Auth routes
    '/login',
    '/register',
    // Protected routes
    '/dashboard/:path*',
    '/profile/:path*',
  ],
}; 