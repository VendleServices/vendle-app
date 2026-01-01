import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup') ||
                     request.nextUrl.pathname.startsWith('/contractor-signup')

  const isRootPage = request.nextUrl.pathname === '/'

  // If on root page, redirect based on auth status
  if (isRootPage) {
    if (session) {
      return NextResponse.redirect(new URL('/home', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If logged in and trying to access auth pages, redirect to home
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // If not logged in and trying to access protected pages, redirect to login
  if (!session && !isAuthPage && !isRootPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
