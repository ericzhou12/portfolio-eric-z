"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BAND_BOUNDARY,
  edgePath,
  entryById,
  lattice,
  layers,
  nodes,
  ongoing,
  spans,
  tailPath,
  type GraphNode,
} from "@/features/experience/graph";
import { cn } from "@/lib/utils";

/**
 * A miniature of the experience graph — the same layers, nodes and spans, laid
 * out to fit a card. Purely visual: no hover, no detail, no traversal. The whole
 * card links through to the full graph.
 */

const BOX = { width: 400, height: 240 };

/** Every layer is visible here, so x comes from the index, not the slid net. */
const columnX = (layer: number) =>
  layers.length > 1 ? 13 + layer * (74 / (layers.length - 1)) : 50;

const spread = (node: GraphNode): GraphNode => ({ ...node, x: columnX(node.layer) });

const tint = (entryId: string) => {
  const color = entryById.get(entryId)?.color;
  return { "--c": color?.light, "--c-dk": color?.dark } as React.CSSProperties;
};

export function ExperiencePreview({ href }: { href: string }) {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <Link
      href={href}
      aria-label="Open the experience graph"
      className="group block w-full"
    >
      <figure className="overflow-hidden rounded-xl border border-line bg-surface p-4 transition-colors group-hover:border-accent/40 sm:p-5">
        <figcaption className="mb-3 flex items-baseline justify-between gap-3">
          <span className="label-caps">Experience · net</span>
          <span className="font-mono text-[0.6875rem] tabular-nums text-faint">
            {nodes.length} nodes · {layers.length} layers
          </span>
        </figcaption>

        <svg
          viewBox={`0 0 ${BOX.width} ${BOX.height}`}
          className="block max-h-[42dvh] w-full lg:max-h-[46dvh]"
          role="img"
          aria-label="Miniature of the experience network: nodes by year, joined by weighted edges."
        >
          <defs>
            {ongoing.map((tail) => (
              <linearGradient
                key={tail.entryId}
                id={`pv-tail-${tail.entryId}`}
                gradientUnits="userSpaceOnUse"
                x1={(columnX(tail.from.layer) / 100) * BOX.width}
                x2={BOX.width}
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

          <line
            x1={0}
            x2={BOX.width}
            y1={(BAND_BOUNDARY / 100) * BOX.height}
            y2={(BAND_BOUNDARY / 100) * BOX.height}
            stroke="var(--color-line)"
            strokeWidth={1}
          />

          {lattice.map((edge) => (
            <path
              key={edge.key}
              d={edgePath(spread(edge.from), spread(edge.to), BOX)}
              fill="none"
              stroke="var(--color-faint)"
              strokeWidth={0.6}
              opacity={0.25}
            />
          ))}

          {spans.map((span) => (
            <g key={span.key} className="node-tint" style={tint(span.entryId)}>
              <path
                id={`pv-span-${span.key}`}
                d={edgePath(spread(span.from), spread(span.to), BOX)}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.85}
              />
              {reduced ? null : (
                <circle r={2.6} fill="currentColor">
                  <animateMotion dur="2.8s" repeatCount="indefinite">
                    <mpath href={`#pv-span-${span.key}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          ))}

          {ongoing.map((tail) => (
            <path
              key={tail.entryId}
              d={tailPath(spread(tail.from), BOX)}
              fill="none"
              stroke={`url(#pv-tail-${tail.entryId})`}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="1.5 6"
              className={cn(!reduced && "tail-march")}
            />
          ))}

          {layers.flatMap((layer) => layer.nodes).map((node) => {
            const entry = entryById.get(node.entryId);
            if (!entry) return null;
            const cx = (columnX(node.layer) / 100) * BOX.width;
            const cy = (node.y / 100) * BOX.height;
            const isStart = node.role === "start";

            return (
              <circle
                key={node.key}
                cx={cx}
                cy={cy}
                r={isStart ? 5 : 4}
                className="node-tint"
                style={tint(node.entryId)}
                fill={isStart ? "currentColor" : "var(--color-surface)"}
                stroke="currentColor"
                strokeWidth={isStart ? 0 : 1.6}
              />
            );
          })}

          {layers.map((layer, index) => (
            <text
              key={layer.key}
              x={(columnX(index) / 100) * BOX.width}
              y={12}
              textAnchor="middle"
              fill="var(--color-faint)"
              className="font-mono"
              fontSize={8}
              letterSpacing={1}
            >
              {layer.label}
            </text>
          ))}
        </svg>

        <p className="mt-3 text-xs leading-relaxed text-faint">
          Columns are years, nodes are roles and projects, and a signal travels
          each role from where it started to where it ended.{" "}
          <span className="text-muted transition-colors group-hover:text-accent">
            Click to open it.
          </span>
        </p>
      </figure>
    </Link>
  );
}
