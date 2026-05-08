import { NextResponse } from "next/server";
import { fetchMessageDetail, refreshAccessToken } from "@/lib/gmail";
import { getIntegration, updateAccessToken } from "@/lib/integrations";
import { auth } from "@/lib/auth/server";

function shouldRefresh(expiresAt: number | null): boolean {
  if (!expiresAt) return false;
  return Date.now() >= expiresAt - 30_000;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const integration = await getIntegration(session.user.id, "gmail");
  if (!integration) {
    return NextResponse.json(
      { error: "Gmail is not connected yet." },
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
    const message = await fetchMessageDetail(accessToken, id);
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Gmail message detail.",
      },
      { status: 500 },
    );
  }
}
