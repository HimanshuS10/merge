import { NextResponse } from 'next/server';
import { getIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const integration = await getIntegration(session.user.id, 'slack');
  if (!integration) {
    return NextResponse.json({ error: 'Slack not connected' }, { status: 401 });
  }

  const res = await fetch(
    'https://slack.com/api/conversations.list?types=public_channel,private_channel&exclude_archived=true&limit=200',
    { headers: { Authorization: `Bearer ${integration.access_token}` } }
  );

  const data = (await res.json()) as {
    ok: boolean;
    channels?: { id: string; name: string; is_member: boolean }[];
    error?: string;
  };

  if (!data.ok) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  return NextResponse.json((data.channels ?? []).filter((ch) => ch.is_member));
}
