import Image from "next/image";

/**
 * Inline album thumbnail. `unoptimized` on purpose — the source is already a
 * 64px asset rendered at 14px, so running it through the image optimizer would
 * bill a transform per unique cover for no visual gain. remotePatterns in
 * next.config.ts still gates the hostname.
 */
export function TrackCover({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={30}
      height={30}
      unoptimized
      className="size-3.5 shrink-0 rounded-[2px] object-cover"
    />
  );
}
