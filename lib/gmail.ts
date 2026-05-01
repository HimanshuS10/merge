const GOOGLE_OAUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

type GmailTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

export function getGoogleOAuthConfig() {
  return {
    clientId: requireEnv('GOOGLE_CLIENT_ID'),
    clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    redirectUri: requireEnv('GOOGLE_REDIRECT_URI'),
  };
}

export function buildGoogleAuthUrl(state: string): string {
  const { clientId, redirectUri } = getGoogleOAuthConfig();
  const url = new URL(GOOGLE_OAUTH_BASE);

  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.readonly');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('state', state);

  return url.toString();
}

export async function exchangeCodeForTokens(code: string): Promise<GmailTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  return (await response.json()) as GmailTokenResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<GmailTokenResponse> {
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed: ${text}`);
  }

  return (await response.json()) as GmailTokenResponse;
}

export type GmailMessageSummary = {
  id: string;
  snippet: string;
  from: string;
  subject: string;
  date: string;
  webLink: string;
};

export type GmailMessageDetail = {
  id: string;
  subject: string;
  from: string;
  date: string;
  webLink: string;
  bodyText: string;
  bodyHtml: string;
};

type GmailMessagePart = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailMessagePart[];
  headers?: Array<{ name?: string; value?: string }>;
};

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, 'base64').toString('utf-8');
}

function collectBodyParts(part: GmailMessagePart | undefined): { text: string; html: string } {
  if (!part) {
    return { text: '', html: '' };
  }

  const currentData = part.body?.data ? decodeBase64Url(part.body.data) : '';
  const text = part.mimeType === 'text/plain' ? currentData : '';
  const html = part.mimeType === 'text/html' ? currentData : '';

  const nested = (part.parts ?? []).map((child) => collectBodyParts(child));
  return {
    text: [text, ...nested.map((n) => n.text)].find((value) => value.trim().length > 0) ?? '',
    html: [html, ...nested.map((n) => n.html)].find((value) => value.trim().length > 0) ?? '',
  };
}

export async function fetchMessageDetail(accessToken: string, id: string): Promise<GmailMessageDetail> {
  const messageUrl = new URL(`${GMAIL_API_BASE}/messages/${id}`);
  messageUrl.searchParams.set('format', 'full');

  const response = await fetch(messageUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Fetching Gmail message detail failed: ${text}`);
  }

  const payload = (await response.json()) as {
    id: string;
    payload?: GmailMessagePart;
  };

  const headers = payload.payload?.headers ?? [];
  const getHeader = (name: string) =>
    headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? '';
  const bodies = collectBodyParts(payload.payload);

  return {
    id: payload.id,
    subject: getHeader('Subject') || '(No subject)',
    from: getHeader('From') || 'Unknown sender',
    date: getHeader('Date'),
    webLink: `https://mail.google.com/mail/u/0/#inbox/${payload.id}`,
    bodyText: bodies.text.trim() || bodies.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    bodyHtml: bodies.html.trim(),
  };
}

type FetchMessageOptions = {
  maxResults?: number;
  query?: string;
  labelIds?: string[];
  includeAllPages?: boolean;
};

export async function fetchLatestMessages(
  accessToken: string,
  options: FetchMessageOptions = {},
): Promise<GmailMessageSummary[]> {
  const {
    maxResults = 100,
    query,
    labelIds = [],
    includeAllPages = false,
  } = options;
  const safeMaxResults = Math.min(Math.max(maxResults, 1), 500);
  const pageSize = Math.min(safeMaxResults, 100);
  const messageIds: Array<{ id: string }> = [];
  let pageToken: string | undefined;

  do {
    const listUrl = new URL(`${GMAIL_API_BASE}/messages`);
    listUrl.searchParams.set('maxResults', String(pageSize));
    if (query) {
      listUrl.searchParams.set('q', query);
    }
    for (const label of labelIds) {
      listUrl.searchParams.append('labelIds', label);
    }
    if (pageToken) {
      listUrl.searchParams.set('pageToken', pageToken);
    }

    const listResponse = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    });

    if (!listResponse.ok) {
      const text = await listResponse.text();
      throw new Error(`Listing Gmail messages failed: ${text}`);
    }

    const listData = (await listResponse.json()) as {
      messages?: Array<{ id: string }>;
      nextPageToken?: string;
    };

    const remainingSlots = safeMaxResults - messageIds.length;
    const nextMessages = (listData.messages ?? []).slice(0, Math.max(remainingSlots, 0));
    messageIds.push(...nextMessages);

    const hasCapacity = messageIds.length < safeMaxResults;
    pageToken = includeAllPages && hasCapacity ? listData.nextPageToken : undefined;
  } while (pageToken && messageIds.length < safeMaxResults);

  const details: GmailMessageSummary[] = [];
  const batchSize = 20;
  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const batchDetails = await Promise.all(
      batch.map(async ({ id }) => {
        const messageUrl = new URL(`${GMAIL_API_BASE}/messages/${id}`);
        messageUrl.searchParams.set('format', 'metadata');
        messageUrl.searchParams.append('metadataHeaders', 'From');
        messageUrl.searchParams.append('metadataHeaders', 'Subject');
        messageUrl.searchParams.append('metadataHeaders', 'Date');

        const messageResponse = await fetch(messageUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
          signal: AbortSignal.timeout(20_000),
        });

        if (!messageResponse.ok) {
          const text = await messageResponse.text();
          throw new Error(`Fetching Gmail message failed: ${text}`);
        }

        const payload = (await messageResponse.json()) as {
          id: string;
          snippet?: string;
          payload?: {
            headers?: Array<{ name?: string; value?: string }>;
          };
        };

        const headers = payload.payload?.headers ?? [];
        const getHeader = (name: string) =>
          headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? '';

        return {
          id: payload.id,
          snippet: payload.snippet ?? '',
          from: getHeader('From'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          webLink: `https://mail.google.com/mail/u/0/#inbox/${payload.id}`,
        };
      }),
    );
    details.push(...batchDetails);
  }

  return details;
}
