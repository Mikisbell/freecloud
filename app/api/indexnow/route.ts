import { NextResponse } from 'next/server';

const API_KEY = 'cc2c66c4e123af418ac9739ed299f288';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecloud.pe';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/**
 * POST /api/indexnow
 * 
 * Accepts a JSON body with { urls: string[] } and submits them
 * to the IndexNow protocol for instant search engine notification.
 * 
 * Protected by a simple bearer token check using SUPABASE_SERVICE_ROLE_KEY
 * so it can't be abused publicly.
 */
export async function POST(request: Request) {
  // Simple auth: require service role key as bearer token
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as { urls?: string[] };
    const urls = body.urls;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty "urls" array in request body' },
        { status: 400 }
      );
    }

    const payload = {
      host: new URL(SITE_URL).hostname,
      key: API_KEY,
      keyLocation: `${SITE_URL}/${API_KEY}.txt`,
      urlList: urls,
    };

    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      return NextResponse.json({
        success: true,
        submitted: urls.length,
        indexNowStatus: res.status,
      });
    }

    const errorBody = await res.text().catch(() => '');
    return NextResponse.json(
      {
        success: false,
        indexNowStatus: res.status,
        error: errorBody,
      },
      { status: 502 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
