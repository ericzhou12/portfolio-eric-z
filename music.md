# music.md — Last.fm "now playing" plan

**Status: code is implemented.** Route handler, normalizer, widget and footer mount are all in.
What is left is credentials — see §1, steps 1/2/4. Album art (§5) is returned by the API but not
yet rendered.

Goal: show what Eric is listening to right now — or what he last listened to — somewhere on the
site, sourced from Last.fm (which scrobbles from Spotify/Apple Music once connected).

This would be the site's **first** env var, **first** route handler, and **first** `fetch`. There is
no existing convention to follow, so the choices below establish one.

---

## 1. Credentials

1. Create an API account at <https://www.last.fm/api/account/create>. Only the **API key** is needed —
   `user.getrecenttracks` reads public scrobbles, so no OAuth, no shared secret, no signed calls.
2. Connect a scrobbler first, or the endpoint only returns stale history:
   Last.fm → Settings → Applications → connect Spotify.
3. Env vars, both **server-only** (no `NEXT_PUBLIC_` prefix, so the key never ships to the browser):

   ```bash
   # .env.local — already covered by .gitignore's `.env*`
   LASTFM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   LASTFM_USER=your-lastfm-username
   ```

4. Add both to the Vercel project (Settings → Environment Variables) for Production, Preview, and
   Development, then redeploy — Vercel does not pick up new env vars without one.

---

## 2. The upstream API

```
GET https://ws.audioscrobbler.com/2.0/
      ?method=user.getrecenttracks
      &user=<LASTFM_USER>
      &api_key=<LASTFM_API_KEY>
      &format=json
      &limit=1
```

Response shape (trimmed):

```jsonc
{
  "recenttracks": {
    "track": [
      {
        "name": "Track title",
        "artist": { "#text": "Artist name" },
        "album":  { "#text": "Album name" },
        "url": "https://www.last.fm/music/Artist/_/Track",
        "image": [ { "size": "small", "#text": "https://lastfm.freetls.fastly.net/…" }, … ],
        "@attr": { "nowplaying": "true" },   // present ONLY while live
        "date":  { "uts": "1753900000" }     // present ONLY when not live
      }
    ]
  }
}
```

Notes that matter:
- `track` is an array. With `limit=1` it is one element — but if a track is currently playing,
  Last.fm sometimes returns the live track **plus** the previous one, so read `track[0]` and do not
  assume length 1.
- Live detection is `track[0]["@attr"]?.nowplaying === "true"` — a **string**, not a boolean.
- `date.uts` is unix **seconds** (multiply by 1000 for JS).
- Pick `image.find(i => i.size === "medium")` and treat an empty `#text` as "no art".
- Errors come back as HTTP 200 with `{ "error": 6, "message": "User not found" }`. Check for
  `error` before reading `recenttracks`.

---

## 3. Route handler — `src/app/api/now-playing/route.ts`

Normalize server-side so the client never sees Last.fm's shape, and the key stays off the wire.

```ts
export const revalidate = 30;

type NowPlaying =
  | { empty: true }
  | {
      empty?: false;
      playing: boolean;
      title: string;
      artist: string;
      album?: string;
      url: string;
      art?: string;
      playedAt?: number;   // ms epoch, absent while playing
    };
```

- Fetch with `{ next: { revalidate: 30 } }` so Next's data cache dedupes across concurrent requests.
- Respond with `Cache-Control: public, s-maxage=30, stale-while-revalidate=120`.
- **Every failure path returns `200` with `{ empty: true }`** and a server-side `console.error` —
  missing env var, non-OK status, Last.fm `error` field, empty track list. The widget then renders
  nothing instead of an error state, which is the right behaviour for a decorative element.
- Wrap the fetch in `AbortSignal.timeout(4000)` so a hung upstream can't hold a Lambda open.

---

## 4. Client widget — `src/components/now-playing.tsx`

`"use client"`.

- Fetch `/api/now-playing` on mount, then poll every **30s**.
- Pause the interval while `document.hidden`, resume on `visibilitychange` — an idle background tab
  should not poll.
- `AbortController` on unmount; ignore aborts in the catch.
- Use the mount-guard already established in `src/components/theme-toggle.tsx`: render a fixed-size
  placeholder until data arrives so nothing shifts.
- Render nothing at all when `empty`.

Visual:
- Live → three CSS-animated equalizer bars in `bg-accent` + `Artist — Title`.
- Not live → a static `♪` + `Artist — Title` + `last played 3h ago`.
- Whole thing is an `<a href={url} target="_blank" rel="noopener noreferrer">`.
- Title truncated (`truncate max-w-[16rem]`), everything in `font-mono text-xs text-faint` to match
  the surrounding metadata styling.
- Equalizer bars must be wrapped so `prefers-reduced-motion` freezes them — the global block in
  `globals.css` already clamps `animation-duration`, which is sufficient.

---

## 5. Album art

Optional. If used:

- `next.config.ts` is currently empty; it needs

  ```ts
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lastfm.freetls.fastly.net" }],
  }
  ```

- Then `next/image` at ~20–24px with `width`/`height` set.
- Skipping `next/image` and using a plain `<img>` avoids the config change but trips the
  `@next/next/no-img-element` ESLint rule. That rule is a **warning**, not an error, so CI
  (`npm run lint`) still passes — but `remotePatterns` + `next/image` is the cleaner call.

---

## 6. Placement — decided: hero status line

Two slots, driven by one shared poller (`src/lib/use-now-playing.ts`) so both mount without doubling
the request rate:

- **Hero status line** — `src/components/status-line.tsx`. Default is the pulsing dot +
  `profile.status`. While a track is **actively playing** it swaps to a purple blob-gradient glow +
  equalizer + `now playing: <cover> Artist — Title`.
- **Footer** — `src/components/now-playing-line.tsx`. Always present once there is a track:
  equalizer + `currently playing: Artist — Title` while live, `♪ last played: Artist — Title 3h ago`
  otherwise (relative time off `date.uts`). Deliberately duplicates the hero while live.

Both link to `profile.lastfm`, not the per-track page.

The glow is `position: absolute` and unclipped, so it adds no height — the one-viewport lock from
commit `cc84ce0` holds. `body { overflow-x: clip }` in `globals.css` is what stops the blur bleed
from widening the page; `clip` rather than `hidden` so the sticky header keeps working.

Original options considered:

| Option | Notes |
|---|---|
| **Footer** *(recommended)* | `src/components/site-footer.tsx:21` literally ends in a dangling `· ` that looks like a slot left open. Present on every page, no layout risk. Watch the `pr-28` that keeps copy clear of the fixed social rail. |
| Social rail | `src/components/social-rail.tsx` already does icon → `max-w-0` → `group-hover:max-w-28` label unfurl; album art collapsing to a track name on hover fits that pattern exactly. Very subtle. |
| Hero status line | Most prominent — sits with the pulsing dot + `profile.status` at `src/components/hero.tsx:16-22`. Risky: commit `cc84ce0` deliberately locked the landing page to one viewport, so anything added there must not add height. |

Optionally also append a `Command` to the `useMemo` array in `src/components/command-palette.tsx`
(~line 60) that opens the current track on Last.fm.

---

## 7. Rate limits & failure modes

- Last.fm allows roughly 5 requests/second per key. With `s-maxage=30` plus the Next data cache the
  site issues at most ~2 upstream calls per minute no matter how much traffic it gets.
- If the scrobbler is disconnected the endpoint keeps returning the last historical scrobble — the
  widget will show a stale "last played" rather than breaking. Acceptable.
- Private-scrobbling accounts return an empty `track` array; the `{ empty: true }` path covers it.

---

## 8. Rough order of work

1. Create the API key, add `.env.local`, add both vars to Vercel.
2. `src/app/api/now-playing/route.ts` + the `NowPlaying` type. Verify with
   `curl localhost:3000/api/now-playing` while something is playing and while nothing is.
3. `src/components/now-playing.tsx`.
4. Mount it in the chosen slot.
5. `next.config.ts` `remotePatterns` if album art is in.
6. `npm run lint && npm run typecheck && npm run build`.
