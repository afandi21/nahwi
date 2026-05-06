import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect ke halaman verifikasi sukses
      return NextResponse.redirect(`${origin}/auth/verified`)
    }
  }

  // Jika gagal, redirect ke halaman error atau login
  return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`)
}
