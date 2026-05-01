import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/gmail';

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

  try {
    const tokenData = await exchangeCodeForTokens(code);
    const expiresAt = Date.now() + tokenData.expires_in * 1000;

    cookieStore.set('gmail_access_token', tokenData.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: tokenData.expires_in,
    });

    if (tokenData.refresh_token) {
      cookieStore.set('gmail_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    cookieStore.set('gmail_access_expires_at', String(expiresAt), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
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
