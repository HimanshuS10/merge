import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

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
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=github_auth_failed`);
  }

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  response.cookies.set('github_access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}