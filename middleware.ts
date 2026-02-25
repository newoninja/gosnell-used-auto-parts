import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ADMIN_PATHS = ['/admin/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow public admin pages (login)
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
    return NextResponse.next()
  }

  // Check for session cookie
  const session = request.cookies.get('__session')?.value
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
