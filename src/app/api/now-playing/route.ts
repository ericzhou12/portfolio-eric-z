import { NextResponse } from "next/server";
import { EMPTY, normalize, type LastfmResponse } from "@/features/music/now-playing";

export const revalidate = 30;

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";

// Decorative widget: every failure is a 200 + `{ empty: true }` so the client
// renders nothing rather than an error state.
function empty(reason: string) {
  console.error(`[now-playing] ${reason}`);
  return NextResponse.json(EMPTY, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
  });
}

export async function GET() {
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;
  if (!key || !user) return empty("LASTFM_API_KEY or LASTFM_USER is unset");

  const url = new URL(ENDPOINT);
  url.search = new URLSearchParams({
    method: "user.getrecenttracks",
    user,
    api_key: key,
    format: "json",
    limit: "1",
  }).toString();

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return empty(`upstream returned ${res.status}`);

    const data = (await res.json()) as LastfmResponse;
    if (data.error) return empty(`last.fm error ${data.error}: ${data.message}`);

    return NextResponse.json(normalize(data), {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    return empty(`fetch failed: ${err instanceof Error ? err.message : err}`);
  }
}
