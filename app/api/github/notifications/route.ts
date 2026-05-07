import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token =
    req.cookies.get('github_access_token')?.value ?? process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 401 });
  }

  const res = await fetch('https://api.github.com/notifications?all=false&per_page=50', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message ?? 'Failed to load notifications' }, { status: res.status });
  }

  return NextResponse.json(data);
}