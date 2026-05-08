import { NextResponse } from "next/server";
import { fetchLatestMessages, refreshAccessToken } from "@/lib/gmail";
import { getIntegration, updateAccessToken } from "@/lib/integrations";
import { auth } from "@/lib/auth/server";

function shouldRefresh(expiresAt: number | null): boolean {
  if (!expiresAt) return false;
  return Date.now() >= expiresAt - 30_000;
}

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const integration = await getIntegration(session.user.id, "gmail");
  if (!integration) {
    return NextResponse.json(
      { error: "Gmail is not connected yet. " },
      { status: 401 },
    );
  }

  let { access_token: accessToken } = integration;

  if (integration.refresh_token && shouldRefresh(integration.expires_at)) {
    try {
      const refreshed = await refreshAccessToken(integration.refresh_token);
      accessToken = refreshed.access_token;
      await updateAccessToken(session.user.id, "gmail", {
        access_token: refreshed.access_token,
        expires_at: Date.now() + refreshed.expires_in * 1000,
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to refresh Gmail access token.",
        },
        { status: 401 },
      );
    }
  }

  try {
    const messages = await fetchLatestMessages(accessToken, {
      query: "category:primary",
      labelIds: ["INBOX"],
      includeAllPages: true,
      maxResults: 200,
    });
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Gmail messages.",
      },
      { status: 500 },
    );
  }
}
