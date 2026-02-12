// app/(auth)/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/update-password'

  // If there is an error in the query string, catch it!
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    console.error("Auth error:", error_description)
    return NextResponse.redirect(`${origin}/login?error=${error_description}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error("Exchange error:", exchangeError.message)
    return NextResponse.redirect(`${origin}/login?error=${exchangeError.message}`)
  }

  return NextResponse.redirect(`${origin}/login?error=No code provided`)
}