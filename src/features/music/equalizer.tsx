export function Equalizer() {
  return (
    <span className="flex h-2.5 items-end gap-[2px]" aria-hidden>
      {[0, 0.3, 0.15].map((delay, i) => (
        <span
          key={i}
          className="eq-bar h-full w-[2px] rounded-full bg-accent"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}
