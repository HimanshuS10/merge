import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchLatestMessages, refreshAccessToken } from "@/lib/gmail";

function shouldRefresh(expiresAtRaw: string | undefined): boolean {
  if (!expiresAtRaw) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return Date.now() >= expiresAt - 30_000;
}

export async function GET() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("gmail_access_token")?.value;
  const refreshToken = cookieStore.get("gmail_refresh_token")?.value;
  const expiresAt = cookieStore.get("gmail_access_expires_at")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Gmail is not connected yet. Start at /api/gmail/connect" },
      { status: 401 },
    );
  }

  if (refreshToken && shouldRefresh(expiresAt)) {
    try {
      const refreshed = await refreshAccessToken(refreshToken);
      accessToken = refreshed.access_token;
      const nextExpiresAt = Date.now() + refreshed.expires_in * 1000;

      cookieStore.set("gmail_access_token", refreshed.access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: refreshed.expires_in,
      });

      cookieStore.set("gmail_access_expires_at", String(nextExpiresAt), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
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
