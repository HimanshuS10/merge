import { NextRequest, NextResponse } from 'next/server';
import { saveIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/?error=not_authenticated', req.url));
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code: code!,
    }),
  });

  const data = await res.json() as { access_token?: string; error?: string };

  if (!data.access_token) {
    return NextResponse.redirect(new URL('/?error=github_auth_failed', req.url));
  }

  await saveIntegration(session.user.id, 'github', {
    access_token: data.access_token,
  });

  return NextResponse.redirect(new URL('/', req.url));
}
