import { NextRequest, NextResponse } from 'next/server';
import { getIntegration } from '@/lib/integrations';
import { auth } from '@/lib/auth/server';

type RawMessage = { ts: string; text: string; user?: string; bot_id?: string; username?: string };
type UserProfile = { display_name: string; real_name: string; image_48: string };

async function fetchUserProfile(userId: string, token: string): Promise<UserProfile | null> {
  const res = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json() as { ok: boolean; user?: { profile?: UserProfile } };
  if (!data.ok || !data.user?.profile) return null;
  return data.user.profile;
}

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get('channel');

  if (!channelId) {
    return NextResponse.json({ error: 'channel param required' }, { status: 400 });
  }

  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const integration = await getIntegration(session.user.id, 'slack');
  if (!integration) {
    return NextResponse.json({ error: 'Slack not connected' }, { status: 401 });
  }

  const token = integration.access_token;

  const res = await fetch(
    `https://slack.com/api/conversations.history?channel=${encodeURIComponent(channelId)}&limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const data = (await res.json()) as { ok: boolean; messages?: RawMessage[]; error?: string };

  if (!data.ok) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  const messages = data.messages ?? [];

  const userIds = [...new Set(messages.map((m) => m.user).filter((id): id is string => !!id))];
  const profileEntries = await Promise.all(
    userIds.map(async (id) => [id, await fetchUserProfile(id, token)] as const)
  );
  const profileMap = Object.fromEntries(profileEntries.filter(([, p]) => p !== null));

  const enriched = messages.map((m) => {
    const profile = m.user ? profileMap[m.user] : null;
    return {
      ts: m.ts,
      text: m.text,
      user: m.user ?? null,
      user_name: profile?.display_name || profile?.real_name || m.username || m.user || 'Unknown',
      user_avatar: profile?.image_48 ?? null,
    };
  });

  return NextResponse.json(enriched);
}
