import { NextRequest, NextResponse } from 'next/server';
import { saveIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/?error=not_authenticated', req.url));
  }

  const res = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code: code!,
    }),
  });

  const data = await res.json() as { authed_user?: { access_token?: string }; error?: string };
  const userToken = data.authed_user?.access_token;

  if (!userToken) {
    return NextResponse.redirect(new URL('/?error=slack_auth_failed', req.url));
  }

  await saveIntegration(session.user.id, 'slack', {
    access_token: userToken,
  });

  return NextResponse.redirect(new URL('/', req.url));
}
