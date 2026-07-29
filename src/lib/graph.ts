import {
  experience,
  projects,
  type Job,
  type NodeColor,
  type Project,
  type TimePoint,
} from "@/lib/content";

/**
 * Derives the neural-net view of the work timeline from content.ts.
 *
 * Layers are years, with everything at or before BUCKET_FLOOR collapsed into a
 * single leading column. Every entry emits a node in its start-year layer and a
 * second node in its end-year layer, joined by a "span" edge — that pair is what
 * makes a 17-month role read differently from a 4-month one. Entries that begin
 * and end inside one column collapse to a single node; entries still running get
 * a dashed tail instead of an end node. Each column is split into a work band
 * above and a project band below.
 *
 * Coordinates are percentages of a content box wider than the visible plot, so
 * the whole net can slide horizontally to centre whichever layer is in focus.
 */

const BUCKET_FLOOR = 2024;

/** Distance between layers, as a percentage of the *visible* plot width. */
export const LAYER_GAP = 24;

export const BANDS = {
  work: { min: 13, max: 41, gap: 14 },
  project: { min: 59, max: 89, gap: 13 },
} as const;

/** Where the two bands meet — one constant so the rule and its label agree. */
export const BAND_BOUNDARY = (BANDS.work.max + BANDS.project.min) / 2;

export type Band = keyof typeof BANDS;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type GraphEntry = {
  id: string;
  band: Band;
  label: string;
  initials: string;
  logo?: string;
  title: string;
  subtitle: string;
  period: string;
  summary: string;
  chips: string[];
  start: TimePoint;
  end: TimePoint | "present";
  color: NodeColor;
  job?: Job;
  project?: Project;
};

export type GraphNode = {
  key: string;
  entryId: string;
  band: Band;
  role: "start" | "end";
  layer: number;
  row: number;
  /** Null for projects, whose source data carries no month precision. */
  month: string | null;
  /** Percentages of the container box. */
  x: number;
  y: number;
};

export type Layer = {
  key: string;
  label: string;
  x: number;
  nodes: GraphNode[];
  /** Midpoint between the lowest work node and highest project node, if both exist. */
  divider: number | null;
};

export type SpanEdge = { key: string; entryId: string; from: GraphNode; to: GraphNode };
export type LatticeEdge = { key: string; from: GraphNode; to: GraphNode };
export type OngoingTail = { entryId: string; from: GraphNode };

const rank = (t: TimePoint) => t.year * 12 + t.month;
const bucket = (year: number) => Math.max(year, BUCKET_FLOOR);

/** Display-only truncation so labels fit under a 40px node. */
const shortOrg = (org: string) => org.replace(/ (University|Technologies)$/, "");
const shortTitle = (title: string) =>
  title.replace(/^(The|Modified) /, "").replace(/ (Project|Model)$/, "");

/** Logo stand-in: leading capitals of the source name, capped at two. */
const initialsOf = (source: string) =>
  (source.match(/[A-Z]/g) ?? [source.slice(0, 1).toUpperCase()]).slice(0, 2).join("");

export const entries: GraphEntry[] = [
  ...experience.map<GraphEntry>((job) => ({
    id: job.id,
    band: "work",
    label: shortOrg(job.org),
    initials: initialsOf(job.org),
    logo: job.logo,
    title: job.role,
    subtitle: job.org,
    period: job.period,
    summary: job.summary,
    chips: job.stack,
    start: job.start,
    end: job.end,
    color: job.color,
    job,
  })),
  ...projects.map<GraphEntry>((project) => ({
    id: project.id,
    band: "project",
    label: shortTitle(project.title),
    initials: initialsOf(shortTitle(project.title)),
    logo: project.logo,
    title: project.title,
    subtitle: project.tagline,
    period: project.year,
    summary: project.description,
    chips: project.tags,
    start: project.start,
    end: project.end,
    color: project.color,
    project,
  })),
];

export const entryById = new Map(entries.map((entry) => [entry.id, entry]));

const columns = [
  ...new Set(
    entries.flatMap((entry) =>
      entry.end === "present"
        ? [bucket(entry.start.year)]
        : [bucket(entry.start.year), bucket(entry.end.year)],
    ),
  ),
].sort((a, b) => a - b);

type Draft = {
  node: Omit<GraphNode, "row" | "x" | "y">;
  sort: number;
  order: number;
};

const drafts: Draft[] = [];
const spanDrafts: { entryId: string; from: string; to: string }[] = [];
const ongoingIds: string[] = [];

entries.forEach((entry, order) => {
  const startLayer = columns.indexOf(bucket(entry.start.year));
  const endLayer =
    entry.end === "present" ? startLayer : columns.indexOf(bucket(entry.end.year));

  const monthOf = (point: TimePoint) =>
    entry.band === "work" ? MONTHS[point.month - 1] : null;

  // Start and end in one column: the single node carries the whole span, so it
  // labels as a month range and sorts on the date it finished.
  const collapsed = entry.end !== "present" && endLayer === startLayer;
  const closedAt = entry.end === "present" ? null : entry.end;

  const from = monthOf(entry.start);
  const to = closedAt ? monthOf(closedAt) : null;

  drafts.push({
    node: {
      key: `${entry.id}:start`,
      entryId: entry.id,
      band: entry.band,
      role: "start",
      layer: startLayer,
      month: collapsed && from && to && from !== to ? `${from}–${to}` : from,
    },
    sort: collapsed && closedAt ? rank(closedAt) : rank(entry.start),
    order,
  });

  if (entry.end === "present") {
    ongoingIds.push(entry.id);
  } else if (endLayer !== startLayer) {
    drafts.push({
      node: {
        key: `${entry.id}:end`,
        entryId: entry.id,
        band: entry.band,
        role: "end",
        layer: endLayer,
        month: monthOf(entry.end),
      },
      sort: rank(entry.end),
      order,
    });
    spanDrafts.push({
      entryId: entry.id,
      from: `${entry.id}:start`,
      to: `${entry.id}:end`,
    });
  }
});

/**
 * Content box width as a percentage of the visible plot: a half-plot of padding
 * on each side of the outer layers, so any layer can sit dead centre.
 */
export const CONTENT_WIDTH = 100 + (columns.length - 1) * LAYER_GAP;

/** Layer 0 sits half a plot in; positions are percentages of the content box. */
const columnX = (layer: number) =>
  ((50 + layer * LAYER_GAP) / CONTENT_WIDTH) * 100;

/** Most recent layer at or before the current year — the default centre. */
export const DEFAULT_FOCUS = columns.reduce(
  (acc, year, i) => (year <= new Date().getFullYear() ? i : acc),
  0,
);

const place = (band: Band, count: number, row: number) => {
  const { min, max, gap: desired } = BANDS[band];
  const center = (min + max) / 2;
  const gap = count > 1 ? Math.min(desired, (max - min) / (count - 1)) : 0;
  return center + (row - (count - 1) / 2) * gap;
};

export const layers: Layer[] = columns.map((year, layer) => {
  const x = columnX(layer);

  const banded = (band: Band) =>
    drafts
      .filter((draft) => draft.node.layer === layer && draft.node.band === band)
      // Most recent on top, earliest at the bottom; ties keep content.ts order.
      .sort((a, b) => b.sort - a.sort || a.order - b.order);

  const nodes = (["work", "project"] as const).flatMap((band) => {
    const inBand = banded(band);
    return inBand.map((draft, row) => ({
      ...draft.node,
      row,
      x,
      y: place(band, inBand.length, row),
    }));
  });

  const lowestWork = nodes.filter((n) => n.band === "work").map((n) => n.y);
  const highestProject = nodes.filter((n) => n.band === "project").map((n) => n.y);

  return {
    key: String(year),
    label: year === BUCKET_FLOOR ? `≤ ${year}` : String(year),
    x,
    nodes,
    divider:
      lowestWork.length && highestProject.length
        ? (Math.max(...lowestWork) + Math.min(...highestProject)) / 2
        : null,
  };
});

export const nodes: GraphNode[] = layers.flatMap((layer) => layer.nodes);
export const nodeByKey = new Map(nodes.map((node) => [node.key, node]));

export const spans: SpanEdge[] = spanDrafts.flatMap((span) => {
  const from = nodeByKey.get(span.from);
  const to = nodeByKey.get(span.to);
  return from && to ? [{ key: span.entryId, entryId: span.entryId, from, to }] : [];
});

export const ongoing: OngoingTail[] = ongoingIds.flatMap((entryId) => {
  const from = nodeByKey.get(`${entryId}:start`);
  return from ? [{ entryId, from }] : [];
});

/** Fully connected between adjacent layers — the classic MLP backdrop. */
export const lattice: LatticeEdge[] = layers.flatMap((layer, i) =>
  i === layers.length - 1
    ? []
    : layer.nodes.flatMap((from) =>
        layers[i + 1].nodes.map((to) => ({
          key: `${from.key}->${to.key}`,
          from,
          to,
        })),
      ),
);

type Box = { width: number; height: number };

const at = (node: GraphNode, box: Box) => ({
  x: (node.x / 100) * box.width,
  y: (node.y / 100) * box.height,
});

/** Horizontal-tangent cubic so edges leave and enter nodes flat, like a net diagram. */
export function edgePath(from: GraphNode, to: GraphNode, box: Box) {
  const a = at(from, box);
  const b = at(to, box);
  const dx = (b.x - a.x) * 0.45;
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

/** Straight dashed run off the right edge for anything still in progress. */
export function tailPath(from: GraphNode, box: Box) {
  const a = at(from, box);
  return `M ${a.x} ${a.y} L ${box.width} ${a.y}`;
}
