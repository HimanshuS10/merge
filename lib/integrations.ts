import { sql } from './db';

type Integration = {
  access_token: string;
  refresh_token: string | null;
  expires_at: number | null;
};

export async function saveIntegration(
  userId: string,
  platform: string,
  data: { access_token: string; refresh_token?: string | null; expires_at?: number | null },
) {
  await sql`
    INSERT INTO user_integrations (user_id, platform, access_token, refresh_token, expires_at, updated_at)
    VALUES (${userId}, ${platform}, ${data.access_token}, ${data.refresh_token ?? null}, ${data.expires_at ?? null}, now())
    ON CONFLICT (user_id, platform) DO UPDATE SET
      access_token  = EXCLUDED.access_token,
      refresh_token = COALESCE(EXCLUDED.refresh_token, user_integrations.refresh_token),
      expires_at    = EXCLUDED.expires_at,
      updated_at    = now()
  `;
}

export async function getIntegration(
  userId: string,
  platform: string,
): Promise<Integration | null> {
  const rows = await sql`
    SELECT access_token, refresh_token, expires_at
    FROM user_integrations
    WHERE user_id = ${userId} AND platform = ${platform}
  `;
  return (rows[0] as Integration) ?? null;
}

export async function updateAccessToken(
  userId: string,
  platform: string,
  data: { access_token: string; expires_at: number },
) {
  await sql`
    UPDATE user_integrations
    SET access_token = ${data.access_token},
        expires_at   = ${data.expires_at},
        updated_at   = now()
    WHERE user_id = ${userId} AND platform = ${platform}
  `;
}
