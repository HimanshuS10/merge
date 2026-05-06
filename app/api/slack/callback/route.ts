import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const code = req.nextUrl.searchParams.get('code');

    const res = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.SLACK_CLIENT_ID!,
            client_secret: process.env.SLACK_CLIENT_SECRET!,
            code: code!,
        }),
    });

    const data = await res.json() as { authed_user?: { access_token?: string }; error?: string };

    const userToken = data.authed_user?.access_token;
    if (!userToken) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=slack_auth_failed`);
    }

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
    response.cookies.set('slack_access_token', userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
}