export type NowPlaying =
  | { empty: true }
  | {
      empty?: false;
      playing: boolean;
      title: string;
      artist: string;
      album?: string;
      url: string;
      art?: string;
      playedAt?: number; // ms epoch, absent while playing
    };

type LastfmImage = { size?: string; "#text"?: string };

type LastfmTrack = {
  name?: string;
  artist?: { "#text"?: string };
  album?: { "#text"?: string };
  url?: string;
  image?: LastfmImage[];
  "@attr"?: { nowplaying?: string };
  date?: { uts?: string };
};

export type LastfmResponse = {
  error?: number;
  message?: string;
  recenttracks?: { track?: LastfmTrack | LastfmTrack[] };
};

export const EMPTY: NowPlaying = { empty: true };

const PLACEHOLDER_ART = "2a96cbd8b46e442fc41c2b86b821562f";

export function normalize(data: LastfmResponse): NowPlaying {
  // Last.fm reports failures as HTTP 200 with an `error` code in the body.
  if (data.error) return EMPTY;

  const raw = data.recenttracks?.track;
  // `limit=1` still returns an array, and Last.fm sometimes tacks the previous
  // track on behind a live one — take the head either way.
  const track = Array.isArray(raw) ? raw[0] : raw;
  if (!track?.name) return EMPTY;

  const artist = track.artist?.["#text"];
  if (!artist) return EMPTY;

  // Last.fm serves a grey star placeholder (always this asset id) instead of
  // omitting art, so treat it the same as no art at all.
  const raw_art = track.image?.find((i) => i.size === "medium")?.["#text"];
  const art = raw_art?.includes(PLACEHOLDER_ART) ? undefined : raw_art;
  const uts = track.date?.uts;

  return {
    playing: track["@attr"]?.nowplaying === "true",
    title: track.name,
    artist,
    album: track.album?.["#text"] || undefined,
    url: track.url || `https://www.last.fm/music/${encodeURIComponent(artist)}`,
    art: art || undefined,
    playedAt: uts ? Number(uts) * 1000 : undefined,
  };
}
