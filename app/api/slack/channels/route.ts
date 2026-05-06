import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get('slack_access_token')?.value ?? process.env.SLACK_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'Slack not connected' }, { status: 401 });
  }

  const res = await fetch(
    'https://slack.com/api/conversations.list?types=public_channel,private_channel&exclude_archived=true&limit=200',
    { headers: { Authorization: `Bearer ${token}` } }
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
