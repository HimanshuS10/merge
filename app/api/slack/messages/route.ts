import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get('channel');

  if (!channelId) {
    return NextResponse.json({ error: 'channel param required' }, { status: 400 });
  }

  const token =
    req.cookies.get('slack_access_token')?.value ?? process.env.SLACK_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Slack not connected' }, { status: 401 });
  }

  const res = await fetch(
    `https://slack.com/api/conversations.history?channel=${encodeURIComponent(channelId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = (await res.json()) as { ok: boolean; messages?: unknown[]; error?: string };

  if (!data.ok) {
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  return NextResponse.json(data.messages);
}
