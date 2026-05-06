import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 0. Halaman Publik — /curriculum bisa diakses TANPA login
  if (request.nextUrl.pathname.startsWith('/curriculum')) {
    return response // langsung lanjut, tidak ada proteksi
  }

  const isAdminAuthRoute =
    request.nextUrl.pathname.startsWith('/admin/login') ||
    request.nextUrl.pathname.startsWith('/admin/forgot-password') ||
    request.nextUrl.pathname.startsWith('/admin/reset-password')

  // 1. Proteksi Halaman Admin
  if (request.nextUrl.pathname.startsWith('/admin') && !isAdminAuthRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Cek role admin
    const role = user.app_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 2. Proteksi Halaman Belajar (Peserta)
  if (request.nextUrl.pathname.startsWith('/learn')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // 3. Mencegah user yang sudah login mengakses halaman Auth
  if (request.nextUrl.pathname.startsWith('/auth')) {
    // Kecualikan /auth/callback dan /auth/verified agar selalu bisa diakses
    const isExcluded = 
      request.nextUrl.pathname.startsWith('/auth/callback') ||
      request.nextUrl.pathname.startsWith('/auth/verified')
    
    if (!isExcluded && user) {
      const role = user.app_metadata?.role
      const from = request.nextUrl.searchParams.get('from')
      const destination = from || (role === 'admin' ? '/admin' : '/learn')
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return response
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
