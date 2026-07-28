"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * A miniature DAG-based Byzantine fault-tolerant consensus round, the system
 * family my Simons research tuned with reinforcement learning.
 *
 * n = 7 replicas, f = 2 tolerated faults, quorum = 2f + 1 = 5. Each round every
 * honest replica broadcasts a vertex; a replica advances once it has collected
 * a quorum of vertices. Mark three or more replicas faulty and the remaining
 * honest set can no longer reach 5 — liveness is lost, which is exactly the
 * bound the protocol promises.
 */

const N = 7;
const F = 2;
const QUORUM = 2 * F + 1;
const SETTLE_MS = 650;

type Message = {
  from: number;
  to: number;
  progress: number;
  speed: number;
  delay: number;
  elapsed: number;
};

type Sim = {
  faulty: boolean[];
  received: Set<number>[];
  committed: boolean[];
  messages: Message[];
  round: number;
  settledAt: number | null;
  roundStartedAt: number;
  lastLatency: number;
};

type Palette = {
  accent: string;
  line: string;
  faint: string;
  fg: string;
  surface: string;
};

function createSim(): Sim {
  return {
    faulty: Array.from({ length: N }, () => false),
    received: Array.from({ length: N }, () => new Set<number>()),
    committed: Array.from({ length: N }, () => false),
    messages: [],
    round: 1,
    settledAt: null,
    roundStartedAt: 0,
    lastLatency: 0,
  };
}

function beginRound(sim: Sim, now: number) {
  sim.messages = [];
  sim.settledAt = null;
  sim.roundStartedAt = now;

  for (let i = 0; i < N; i += 1) {
    // A replica always holds its own vertex; a faulty one proposes nothing.
    sim.received[i] = sim.faulty[i] ? new Set<number>() : new Set<number>([i]);
    sim.committed[i] = false;
  }

  for (let from = 0; from < N; from += 1) {
    if (sim.faulty[from]) continue;
    for (let to = 0; to < N; to += 1) {
      if (to === from) continue;
      sim.messages.push({
        from,
        to,
        progress: 0,
        speed: 0.55 + Math.random() * 0.45,
        delay: Math.random() * 260,
        elapsed: 0,
      });
    }
  }
}

function nodePositions(width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;
  return Array.from({ length: N }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
}

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;
  return {
    accent: read("--accent", "#4e2a84"),
    line: read("--line", "#e5e4e0"),
    faint: read("--faint", "#8a8f9e"),
    fg: read("--fg", "#14151a"),
    surface: read("--surface", "#ffffff"),
  };
}

export function ConsensusViz({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim>(createSim());
  const paletteRef = useRef<Palette | null>(null);
  const { resolvedTheme } = useTheme();

  const [hud, setHud] = useState({ round: 1, latency: 0, faulty: 0, stalled: false });
  const [faultyFlags, setFaultyFlags] = useState<boolean[]>(
    Array.from({ length: N }, () => false),
  );

  const toggleFaulty = useCallback((index: number) => {
    const sim = simRef.current;
    sim.faulty[index] = !sim.faulty[index];
    setFaultyFlags([...sim.faulty]);
    // Restarting the round makes the consequence of the fault immediate.
    beginRound(sim, performance.now());
  }, []);

  // Repaint with theme-correct colors whenever the resolved theme flips.
  useEffect(() => {
    paletteRef.current = readPalette();
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    paletteRef.current = readPalette();

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const sim = simRef.current;
    beginRound(sim, performance.now());

    let raf = 0;
    let last = performance.now();
    let hudThrottle = 0;

    const draw = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      const palette = paletteRef.current ?? readPalette();
      const points = nodePositions(width, height);
      const honest = sim.faulty.filter((f) => !f).length;
      const stalled = honest < QUORUM;

      if (!reduceMotion && !stalled) {
        // Advance in-flight vertices.
        for (let i = sim.messages.length - 1; i >= 0; i -= 1) {
          const msg = sim.messages[i];
          msg.elapsed += dt;
          if (msg.elapsed < msg.delay) continue;
          msg.progress += (msg.speed * dt) / 1000;
          if (msg.progress >= 1) {
            sim.received[msg.to].add(msg.from);
            sim.messages.splice(i, 1);
          }
        }

        for (let i = 0; i < N; i += 1) {
          if (sim.faulty[i] || sim.committed[i]) continue;
          if (sim.received[i].size >= QUORUM) sim.committed[i] = true;
        }

        const allCommitted = sim.committed.every((c, i) => sim.faulty[i] || c);
        if (allCommitted && sim.settledAt === null) {
          sim.settledAt = now;
          sim.lastLatency = now - sim.roundStartedAt;
        }
        if (sim.settledAt !== null && now - sim.settledAt > SETTLE_MS) {
          sim.round += 1;
          beginRound(sim, now);
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Quorum lattice — every replica-to-replica channel.
      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.line;
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < N; i += 1) {
        for (let j = i + 1; j < N; j += 1) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // In-flight vertices.
      if (!stalled) {
        ctx.fillStyle = palette.accent;
        for (const msg of sim.messages) {
          if (msg.elapsed < msg.delay) continue;
          const a = points[msg.from];
          const b = points[msg.to];
          const t = Math.min(msg.progress, 1);
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          ctx.globalAlpha = 0.35 + 0.65 * Math.sin(Math.PI * t);
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Replicas.
      for (let i = 0; i < N; i += 1) {
        const { x, y } = points[i];
        const isFaulty = sim.faulty[i];
        const isCommitted = sim.committed[i];

        if (isCommitted && !isFaulty) {
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fillStyle = palette.accent;
          ctx.globalAlpha = 0.16;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = isCommitted && !isFaulty ? palette.accent : palette.surface;
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = isFaulty ? palette.faint : palette.accent;
        if (isFaulty) ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (isFaulty) {
          ctx.strokeStyle = palette.faint;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(x - 4, y - 4);
          ctx.lineTo(x + 4, y + 4);
          ctx.moveTo(x + 4, y - 4);
          ctx.lineTo(x - 4, y + 4);
          ctx.stroke();
        }
      }

      // Throttle HUD writes so React isn't re-rendering every frame.
      hudThrottle += dt;
      if (hudThrottle > 180) {
        hudThrottle = 0;
        setHud((prev) => {
          const next = {
            round: sim.round,
            latency: Math.round(sim.lastLatency),
            faulty: N - honest,
            stalled,
          };
          return prev.round === next.round &&
            prev.latency === next.latency &&
            prev.faulty === next.faulty &&
            prev.stalled === next.stalled
            ? prev
            : next;
        });
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const points = nodePositions(rect.width, rect.height);
      for (let i = 0; i < N; i += 1) {
        const dx = x - points[i].x;
        const dy = y - points[i].y;
        if (dx * dx + dy * dy <= 18 * 18) {
          toggleFaulty(i);
          return;
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("click", handleClick);
    };
  }, [toggleFaulty]);

  return (
    <figure
      className={cn(
        "rounded-xl border border-line bg-surface p-4 sm:p-5",
        className,
      )}
    >
      <figcaption className="mb-3 flex items-baseline justify-between gap-3">
        <span className="label-caps">DAG-BFT consensus · live</span>
        <span className="font-mono text-[0.6875rem] text-faint">
          n=7 · f=2 · quorum=5
        </span>
      </figcaption>

      <canvas
        ref={canvasRef}
        className="block aspect-square w-full cursor-pointer"
        role="img"
        aria-label={`Simulation of a Byzantine fault-tolerant consensus round. Round ${hud.round}, ${hud.faulty} of 7 replicas faulty.`}
      />

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 font-mono text-xs">
        <div>
          <div className="label-caps">Round</div>
          <div className="mt-1 tabular-nums text-fg">{hud.round}</div>
        </div>
        <div>
          <div className="label-caps">Commit</div>
          <div className="mt-1 tabular-nums text-fg">
            {hud.stalled ? "—" : `${hud.latency}ms`}
          </div>
        </div>
        <div>
          <div className="label-caps">Faulty</div>
          <div className="mt-1 tabular-nums text-fg">
            {hud.faulty}/{N}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="label-caps mr-1">Fault</span>
        {faultyFlags.map((isFaulty, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleFaulty(i)}
            aria-pressed={isFaulty}
            aria-label={`Toggle replica ${i} ${isFaulty ? "honest" : "faulty"}`}
            className={cn(
              "size-7 rounded-md border font-mono text-[0.6875rem] transition-colors",
              isFaulty
                ? "border-line bg-transparent text-faint line-through"
                : "border-accent/40 text-accent hover:bg-accent/10",
            )}
          >
            {i}
          </button>
        ))}
      </div>

      <p
        className={cn(
          "mt-3 text-xs leading-relaxed",
          hud.stalled ? "text-accent" : "text-faint",
        )}
        role="status"
      >
        {hud.stalled
          ? `Liveness lost — only ${N - hud.faulty} honest replicas remain, below the quorum of ${QUORUM}. Consensus cannot proceed.`
          : "Click a replica to make it Byzantine. The protocol survives up to 2 faults; the third stalls it."}
      </p>
    </figure>
  );
}
