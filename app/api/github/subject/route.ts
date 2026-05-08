import { NextRequest, NextResponse } from 'next/server';
import { getIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url || !url.startsWith('https://api.github.com/')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const integration = await getIntegration(session.user.id, 'github');
  if (!integration) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 401 });
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${integration.access_token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: (data as { message?: string }).message ?? 'Failed to load details' },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
