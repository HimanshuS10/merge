import { NextResponse } from "next/server";

export async function GET() {
    const params = new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        user_scope: "channels:read,channels:history,groups:read,groups:history,im:read,im:history,mpim:read,mpim:history",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/slack/callback`,
    });

    return NextResponse.redirect(
        `https://slack.com/oauth/v2/authorize?${params}`
    );
}
