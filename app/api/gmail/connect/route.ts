import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildGoogleAuthUrl } from '@/lib/gmail';

export async function GET() {
  const state = randomUUID();
  const cookieStore = await cookies();

  cookieStore.set('gmail_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(buildGoogleAuthUrl(state));
}
