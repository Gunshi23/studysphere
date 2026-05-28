import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('studysphere_session')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    '/dashboard',
    '/rooms',
    '/session',
    '/activity',
    '/leaderboard',
    '/profile',
    '/settings',
    '/notifications',
  ];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Redirect to login if accessing a protected route without a session
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing login/register with an active session
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/rooms/:path*',
    '/session/:path*',
    '/activity/:path*',
    '/leaderboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/notifications/:path*',
    '/login',
    '/register',
  ],
};
