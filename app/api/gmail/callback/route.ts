import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/gmail';
import { saveIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const cookieStore = await cookies();
  const expectedState = cookieStore.get('gmail_oauth_state')?.value;

  if (!code) {
    return NextResponse.json({ error: 'Missing code in callback.' }, { status: 400 });
  }

  if (!returnedState || returnedState !== expectedState) {
    return NextResponse.json({ error: 'Invalid OAuth state.' }, { status: 400 });
  }

  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/?error=not_authenticated', request.url));
  }

  try {
    const tokenData = await exchangeCodeForTokens(code);
    const expiresAt = Date.now() + tokenData.expires_in * 1000;

    await saveIntegration(session.user.id, 'gmail', {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
      expires_at: expiresAt,
    });

    cookieStore.delete('gmail_oauth_state');

    return NextResponse.redirect(new URL('/?gmail=connected', request.url));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to finish Gmail connect.' },
      { status: 500 },
    );
  }
}
