import { NextResponse } from "next/server";
import {
  EMPTY,
  normalize,
  type LastfmResponse,
  type NowPlaying,
} from "@/features/music/now-playing";

// Without this Next prerenders the route at build time and every first-time
// visitor is served whatever was playing when the deploy ran.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const NO_CACHE = { "Cache-Control": "no-store" };

// Shared across requests hitting the same warm instance, so a burst of visitors
// costs one upstream call instead of one each.
const MEMO_MS = 1_000;
let memo: { at: number; value: NowPlaying } | null = null;

// Decorative widget: every failure is a 200 + `{ empty: true }` so the client
// renders nothing rather than an error state.
function empty(reason: string) {
  console.error(`[now-playing] ${reason}`);
  return NextResponse.json(EMPTY, { headers: NO_CACHE });
}

export async function GET() {
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;
  if (!key || !user) return empty("LASTFM_API_KEY or LASTFM_USER is unset");

  if (memo && Date.now() - memo.at < MEMO_MS) {
    return NextResponse.json(memo.value, { headers: NO_CACHE });
  }

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
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return empty(`upstream returned ${res.status}`);

    const data = (await res.json()) as LastfmResponse;
    if (data.error) return empty(`last.fm error ${data.error}: ${data.message}`);

    const value = normalize(data);
    memo = { at: Date.now(), value };
    return NextResponse.json(value, { headers: NO_CACHE });
  } catch (err) {
    return empty(`fetch failed: ${err instanceof Error ? err.message : err}`);
  }
}
