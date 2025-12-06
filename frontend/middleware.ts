import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    // Define protected routes
    const protectedRoutes = [
      '/claim',
      '/auction',
      '/start-claim/create-restor',
      '/home',
    ]
    
    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )
    
    // Define public routes that should redirect to dashboard if user is logged in
    const authRoutes = ['/login', '/signup', '/contractor-signup']
    const isAuthRoute = authRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )
    
        // If user is not logged in and trying to access protected route
    if (!user && isProtectedRoute) {
        // Only redirect if there's no session at all
        // This prevents redirecting during login process when session is being established
        const hasSessionCookie = request.cookies.get('sb-access-token') || 
                                request.cookies.get('sb-refresh-token') ||
                                request.cookies.getAll().some(cookie => cookie.name.includes('supabase'));
        
        if (!hasSessionCookie) {
            // Redirect to login page
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }
    
    // If user is logged in and trying to access auth routes
    if (user && isAuthRoute) {
        // Everyone goes to /home when logged in, regardless of user type
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
} 