import { NextResponse } from 'next/server';
import { createSupabaseAuthServer } from '@/lib/supabase/auth-server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin/pedidos';

  if (code) {
    const supabase = await createSupabaseAuthServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
