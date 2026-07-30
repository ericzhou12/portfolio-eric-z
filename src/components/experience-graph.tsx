"use client";

import Image from "next/image";
import { GripVertical, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExperienceDetailPanel } from "@/components/experience-detail-panel";
import {
  BAND_BOUNDARY,
  CONTENT_WIDTH,
  DEFAULT_FOCUS,
  LAYER_GAP,
  edgePath,
  entryById,
  lattice,
  layers,
  nodeByKey,
  nodes,
  ongoing,
  spans,
  tailPath,
} from "@/lib/graph";
import { cn } from "@/lib/utils";

const tint = (entryId: string) => {
  const color = entryById.get(entryId)?.color;
  return { "--c": color?.light, "--c-dk": color?.dark } as React.CSSProperties;
};

const KEYS = [
  { keys: ["←", "→"], label: "change year" },
  { keys: ["↑", "↓"], label: "change node" },
  { keys: ["space"], label: "open node" },
];

function GraphIntro({ onDismiss }: { onDismiss: () => void }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  return (
    <div
      onPointerDown={(event) => {
        // The close button keeps its own click; everything else grabs.
        if ((event.target as HTMLElement).closest("button")) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          x: event.clientX,
          y: event.clientY,
          ox: offset.x,
          oy: offset.y,
        };
      }}
      onPointerMove={(event) => {
        const from = drag.current;
        if (!from) return;
        setOffset({
          x: from.ox + event.clientX - from.x,
          y: from.oy + event.clientY - from.y,
        });
      }}
      onPointerUp={(event) => {
        drag.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className="w-max touch-none select-none rounded-xl border border-line bg-surface p-6 shadow-xl cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-8">
        <p className="flex max-w-[16rem] items-start gap-2 text-sm leading-relaxed text-muted">
          <GripVertical className="mt-0.5 size-3.5 shrink-0 text-faint" aria-hidden />
          Columns are years. Nodes are roles and projects.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss instructions"
          className="shrink-0 rounded-md border border-line p-1.5 text-faint transition-colors hover:border-accent/40 hover:text-fg"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>

      <dl className="mt-6 space-y-3">
        {KEYS.map((row) => (
          <div key={row.label} className="flex items-center gap-5">
            <dt className="flex shrink-0 gap-2">
              {row.keys.map((key) => (
                <kbd
                  key={key}
                  className="inline-flex h-14 min-w-14 items-center justify-center rounded-lg border border-line px-4 font-mono text-2xl text-fg"
                >
                  {key}
                </kbd>
              ))}
            </dt>
            <dd className="text-xl text-muted">{row.label}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-faint">or click any node</p>
    </div>
  );
}

export function ExperienceGraph() {
  const contentRef = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const [box, setBox] = useState({ width: 1000, height: 520 });
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [focus, setFocus] = useState(DEFAULT_FOCUS);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  // Once the intro is gone it never returns; closing a detail leaves bare net.
  const [introDone, setIntroDone] = useState(false);

  const toggleSelected = useCallback((entryId: string) => {
    setIntroDone(true);
    setSelected((current) => (current === entryId ? null : entryId));
  }, []);

  const active = (hoveredKey ? nodeByKey.get(hoveredKey)?.entryId : null) ?? selected;
  const selectedEntry = selected ? entryById.get(selected) : undefined;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // SVG coordinates track the measured content box exactly, so edges stay
    // pinned to the percentage-positioned HTML nodes at any container size.
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ width, height });
    });
    resize.observe(el);

    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          reveal.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    reveal.observe(el);

    return () => {
      resize.disconnect();
      reveal.disconnect();
    };
  }, []);

  /** Nodes of a layer ordered visually, top to bottom. */
  const column = useCallback(
    (layer: number) => [...layers[layer].nodes].sort((a, b) => a.y - b.y),
    [],
  );

  /**
   * All keyboard traversal lives here rather than on the node buttons, so
   * arrows and space work from a cold page with nothing selected.
   */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const el = document.activeElement as HTMLElement | null;
      if (el?.closest("input, textarea, [contenteditable='true']")) return;

      const onNode = [...buttons.current.entries()].find(
        ([, button]) => button === document.activeElement,
      )?.[0];
      const current = onNode ? nodeByKey.get(onNode) : undefined;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const next = Math.min(
          Math.max(focus + (event.key === "ArrowLeft" ? -1 : 1), 0),
          layers.length - 1,
        );
        if (next === focus) return;
        event.preventDefault();
        setFocus(next);

        if (current) {
          const landing = layers[next].nodes.reduce((best, node) =>
            Math.abs(node.y - current.y) < Math.abs(best.y - current.y) ? node : best,
          );
          buttons.current.get(landing.key)?.focus();
        }
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const ordered = column(focus);
        if (!ordered.length) return;
        event.preventDefault();

        // Nothing in this layer has focus yet — enter it at the top item.
        if (!current || current.layer !== focus) {
          buttons.current.get(ordered[0].key)?.focus();
          return;
        }

        const at = ordered.findIndex((node) => node.key === current.key);
        const next = ordered[at + (event.key === "ArrowUp" ? -1 : 1)];
        if (next) buttons.current.get(next.key)?.focus();
        return;
      }

      if (event.key === " ") {
        // A focused button handles its own space press natively.
        if (el && el !== document.body && el.closest("button, a")) return;
        const top = column(focus)[0];
        if (!top) return;
        event.preventDefault();
        buttons.current.get(top.key)?.focus();
        toggleSelected(top.entryId);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [column, focus, toggleSelected]);

  const drawDelay = (layer: number) => 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative min-h-[24rem] flex-1">
          {/* Layers off the focused column fade out rather than hard-clipping. */}
          <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_4%,black_96%,transparent_100%)]">
            <div
              ref={contentRef}
              className="absolute inset-y-0 transition-[left] duration-500 ease-out"
              style={{ left: `${-focus * LAYER_GAP}%`, width: `${CONTENT_WIDTH}%` }}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <svg
                viewBox={`0 0 ${box.width} ${box.height}`}
                className="absolute inset-0 size-full"
                aria-hidden
              >
                <defs>
                  {ongoing.map((tail) => (
                    <linearGradient
                      key={tail.entryId}
                      id={`tail-${tail.entryId}`}
                      gradientUnits="userSpaceOnUse"
                      x1={(tail.from.x / 100) * box.width}
                      x2={box.width}
                      y1={0}
                      y2={0}
                      className="node-tint"
                      style={tint(tail.entryId)}
                    >
                      <stop offset="0%" stopColor="currentColor" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>

                {layers.map((layer) => (
                  <line
                    key={layer.key}
                    x1={(layer.x / 100) * box.width}
                    x2={(layer.x / 100) * box.width}
                    y1={box.height * 0.04}
                    y2={box.height * 0.97}
                    stroke="var(--color-line)"
                    strokeWidth={1}
                  />
                ))}

                <line
                  x1={0}
                  x2={box.width}
                  y1={(BAND_BOUNDARY / 100) * box.height}
                  y2={(BAND_BOUNDARY / 100) * box.height}
                  stroke="var(--color-line)"
                  strokeWidth={1}
                />

                <rect
                  x={0}
                  y={(BAND_BOUNDARY / 100) * box.height}
                  width={box.width}
                  height={box.height - (BAND_BOUNDARY / 100) * box.height}
                  fill="var(--color-accent)"
                  opacity={0.025}
                />

                {lattice.map((edge) => {
                  const touches =
                    edge.from.entryId === active || edge.to.entryId === active;
                  return (
                    <path
                      key={edge.key}
                      d={edgePath(edge.from, edge.to, box)}
                      fill="none"
                      stroke="var(--color-faint)"
                      strokeWidth={1}
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={entered ? 0 : 1}
                      opacity={active ? (touches ? 0.7 : 0.06) : 0.22}
                      style={{
                        transition:
                          "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease-out",
                        transitionDelay: `${drawDelay(edge.from.layer)}ms, 0ms`,
                      }}
                    />
                  );
                })}

                {spans.map((span) => (
                  <g
                    key={span.key}
                    className="node-tint"
                    style={tint(span.entryId)}
                    opacity={active ? (span.entryId === active ? 1 : 0.1) : 0.85}
                  >
                    <path
                      id={`span-${span.key}`}
                      d={edgePath(span.from, span.to, box)}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={entered ? 0 : 1}
                      style={{
                        transition:
                          "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
                        transitionDelay: `${drawDelay(span.from.layer)}ms`,
                      }}
                    />
                    {entered && !reduced ? (
                      <circle r={4} fill="currentColor">
                        <animateMotion dur="2.8s" repeatCount="indefinite">
                          <mpath href={`#span-${span.key}`} />
                        </animateMotion>
                      </circle>
                    ) : null}
                  </g>
                ))}

                {ongoing.map((tail) => (
                  <path
                    key={tail.entryId}
                    d={tailPath(tail.from, box)}
                    fill="none"
                    stroke={`url(#tail-${tail.entryId})`}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="2 8"
                    className={cn(!reduced && "tail-march")}
                    opacity={active ? (tail.entryId === active ? 1 : 0.1) : 0.9}
                    style={{ transition: "opacity 0.3s ease-out" }}
                  />
                ))}
              </svg>

              {layers.map((layer, index) => (
                <button
                  key={layer.key}
                  type="button"
                  aria-pressed={index === focus}
                  onClick={() => setFocus(index)}
                  className={cn(
                    "absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
                    index === focus ? "text-fg" : "text-faint hover:text-muted",
                  )}
                  style={{ left: `${layer.x}%` }}
                >
                  {layer.label}
                </button>
              ))}

              {layers.map((layer) =>
                layer.divider === null ? null : (
                  // bg-bg knocks the rule out behind the label.
                  <span
                    key={`divider-${layer.key}`}
                    className="label-caps absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-bg px-2.5"
                    style={{ left: `${layer.x}%`, top: `${BAND_BOUNDARY}%` }}
                  >
                    projects
                  </span>
                ),
              )}

              {nodes.map((node) => {
                const entry = entryById.get(node.entryId);
                if (!entry) return null;
                const isActive = active === node.entryId;
                const isSelected = selected === node.entryId;
                const isStart = node.role === "start";
                const isLive = isStart && entry.end === "present";

                return (
                  <button
                    key={node.key}
                    ref={(el) => {
                      if (el) buttons.current.set(node.key, el);
                      else buttons.current.delete(node.key);
                    }}
                    type="button"
                    aria-pressed={isSelected}
                    onMouseEnter={() => setHoveredKey(node.key)}
                    onMouseLeave={(event) => {
                      // Keyboard focus keeps the card up; a mouse exit drops it.
                      if (document.activeElement !== event.currentTarget) {
                        setHoveredKey(null);
                      }
                    }}
                    onFocus={() => setHoveredKey(node.key)}
                    onBlur={() => setHoveredKey(null)}
                    onClick={() => {
                      setFocus(node.layer);
                      toggleSelected(node.entryId);
                    }}
                    className="node-tint absolute flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-opacity duration-300 ease-out"
                    style={{
                      ...tint(node.entryId),
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      opacity:
                        active && !isActive ? 0.18 : node.layer === focus ? 1 : 0.5,
                      transitionDelay: `${drawDelay(node.layer)}ms`,
                    }}
                  >
                    <span className="sr-only">
                      {entry.title} · {entry.subtitle} · {entry.period} ·{" "}
                      {isStart ? "start" : "end"}
                    </span>

                    {node.month ? (
                      <span
                        aria-hidden
                        className="absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 whitespace-nowrap font-mono text-[0.625rem] text-faint"
                      >
                        {node.month}
                      </span>
                    ) : null}

                    {isLive ? (
                      <span
                        aria-hidden
                        className="absolute inline-flex size-12 animate-ping rounded-full bg-current opacity-20"
                      />
                    ) : null}

                    <span
                      aria-hidden
                      className={cn(
                        "relative flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-current bg-surface transition-transform duration-300",
                        // Dashed ring marks the closing node of a span.
                        !isStart && "border-dashed",
                        isActive && "scale-110",
                        isSelected &&
                          "ring-2 ring-current/40 ring-offset-2 ring-offset-bg",
                      )}
                    >
                      {entry.logo ? (
                        <Image
                          src={entry.logo}
                          alt=""
                          width={48}
                          height={48}
                          className={cn(
                            // Solid-background marks bleed to the ring and get
                            // cropped by it; transparent ones sit inset.
                            entry.logoFill
                              ? "size-full scale-105 object-cover"
                              : "size-[30px] object-contain",
                            !isStart && "opacity-55",
                          )}
                        />
                      ) : (
                        <span
                          className={cn(
                            "font-mono text-xs font-semibold tracking-tight",
                            !isStart && "opacity-55",
                          )}
                        >
                          {entry.initials}
                        </span>
                      )}
                    </span>

                    {isStart ? (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-1/2 top-full mt-1 w-24 -translate-x-1/2 truncate text-center font-mono text-[0.625rem] transition-colors",
                          isActive ? "text-fg" : "text-muted",
                        )}
                      >
                        {entry.label}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column, starting just clear of the focused layer. Absent
              entirely once the intro is dismissed and nothing is selected. */}
          {selectedEntry ? (
            <div className="absolute inset-y-0 left-[calc(50%+3.5rem)] right-0 z-30 shadow-xl">
              <ExperienceDetailPanel
                entry={selectedEntry}
                onClose={() => setSelected(null)}
              />
            </div>
          ) : !introDone ? (
            // Sized to its content rather than filling the column.
            <div className="absolute left-[calc(50%+3.5rem)] top-1/2 z-30 -translate-y-1/2">
              <GraphIntro onDismiss={() => setIntroDone(true)} />
            </div>
          ) : null}
        </div>

        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-faint">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border-2 border-faint" /> start
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border border-dashed border-faint" />{" "}
            end
          </span>
          <span>dotted tail = still running</span>
        </p>
      </div>
    </div>
  );
}
