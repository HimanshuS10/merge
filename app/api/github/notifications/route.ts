import { NextResponse } from 'next/server';
import { getIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const integration = await getIntegration(session.user.id, 'github');
  if (!integration) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 401 });
  }

  const res = await fetch('https://api.github.com/notifications?all=false&per_page=50', {
    headers: {
      Authorization: `Bearer ${integration.access_token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message ?? 'Failed to load notifications' }, { status: res.status });
  }

  return NextResponse.json(data);
}
