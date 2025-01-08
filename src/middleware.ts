import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// const rootRoute = ['/']
const authRedirectRoutes = ['/login']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  const { pathname } = request.nextUrl

  // const isRootRoute = rootRoute.includes(request.nextUrl.pathname)
  // if (!token || isRootRoute) {
  if (!token) {
    return pathname === '/login' 
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/sing-in/auth-token`;
    const response = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `authToken=${token}`
      }
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (authRedirectRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
    redirectResponse.cookies.delete('authToken')
    return redirectResponse
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}