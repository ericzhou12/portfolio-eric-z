"use client";

import { useEffect, useRef } from "react";
import { clamp, fbm, hexToRgb, type Rgb } from "@/lib/flow-noise";

/**
 * Full-page backdrop: particles steered by a scrolling fractal-noise vector
 * field, painted as fading trails. The cursor drags a vortex through the flow
 * from anywhere on the page. Kept low-contrast so it stays behind the content.
 */

const TAU = Math.PI * 2;

const FIELD_SCALE = 0.0024; // noise units per css pixel
const TIME_SCALE = 0.0011; // how fast the field itself drifts
// Equilibrium speed is FORCE/(1-DAMPING) scaled by a particle's agility, so
// this stays under MAX_SPEED: the cap only clips click-bursts, letting the
// field's own variation drive how fast each particle actually travels.
const FORCE = 0.1;
const DAMPING = 0.93;
const MAX_SPEED = 2.7;
const MIN_AGILITY = 0.55;
const AGILITY_RANGE = 0.8;
const TRAIL_FADE = 0.25;
const POINTER_RADIUS = 130;
const SWIRL = 1.15;
const PULL = 0.6;
const BURST = 9;
const DENSITY = 0.0035; // particles per css px²
const MIN_PARTICLES = 300;
const MAX_PARTICLES = 800;
const STILL_FRAMES = 700; // long-exposure frames for reduced-motion

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  agility: number;
};

export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const accentRef = useRef<Rgb>([180, 154, 239]);
  const repaintRef = useRef(0);

  // Watching the class attribute rather than next-themes' resolvedTheme: an
  // effect keyed on that can run before the class lands, and then getComputedStyle
  // hands back the outgoing palette.
  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      accentRef.current = hexToRgb(
        styles.getPropertyValue("--accent"),
        [180, 154, 239],
      );
      repaintRef.current += 1;
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let time = 0;
    let onScreen = true;
    let lastRepaint = repaintRef.current;

    const spawn = (): Particle => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        px: x,
        py: y,
        vx: 0,
        vy: 0,
        life: 60 + Math.random() * 260,
        agility: MIN_AGILITY + Math.random() * AGILITY_RANGE,
      };
    };

    const recycle = (p: Particle) => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.px = p.x;
      p.py = p.y;
      p.vx = 0;
      p.vy = 0;
      p.life = 60 + Math.random() * 260;
      p.agility = MIN_AGILITY + Math.random() * AGILITY_RANGE;
    };

    const wipe = () => ctx.clearRect(0, 0, width, height);

    const step = () => {
      time += 1;
      const pointer = pointerRef.current;
      for (const p of particlesRef.current) {
        p.px = p.x;
        p.py = p.y;

        const angle =
          fbm(p.x * FIELD_SCALE, p.y * FIELD_SCALE + time * TIME_SCALE) *
          TAU *
          2;
        p.vx += Math.cos(angle) * FORCE * p.agility;
        p.vy += Math.sin(angle) * FORCE * p.agility;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < POINTER_RADIUS * POINTER_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const falloff = 1 - d / POINTER_RADIUS;
            // Perpendicular component swirls, radial component draws inward.
            p.vx += ((-dy / d) * SWIRL + (dx / d) * PULL) * falloff;
            p.vy += ((dx / d) * SWIRL + (dy / d) * PULL) * falloff;
          }
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (
          p.life <= 0 ||
          p.x < -12 ||
          p.x > width + 12 ||
          p.y < -12 ||
          p.y > height + 12
        ) {
          recycle(p);
        }
      }
    };

    // Segments are bucketed by speed so the whole frame is three stroke calls
    // rather than one per particle.
    const paint = () => {
      const [r, g, b] = accentRef.current;
      const slow: number[] = [];
      const mid: number[] = [];
      const fast: number[] = [];

      for (const p of particlesRef.current) {
        const speed = Math.hypot(p.x - p.px, p.y - p.py);
        const bucket = speed > 1.35 ? fast : speed > 0.75 ? mid : slow;
        bucket.push(p.px, p.py, p.x, p.y);
      }

      const layers: [number[], number, number][] = [
        [slow, 0.1, 0.6],
        [mid, 0.24, 0.9],
        [fast, 0.5, 1.2],
      ];

      for (const [points, alpha, lineWidth] of layers) {
        if (!points.length) continue;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        for (let i = 0; i < points.length; i += 4) {
          ctx.moveTo(points[i], points[i + 1]);
          ctx.lineTo(points[i + 2], points[i + 3]);
        }
        ctx.stroke();
      }
    };

    // Erase toward transparent instead of painting the page colour on, so the
    // canvas never owns the background and the theme is pure CSS.
    const fade = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    };

    const seed = () => {
      const target = Math.round(
        clamp(width * height * DENSITY, MIN_PARTICLES, MAX_PARTICLES),
      );
      particlesRef.current = Array.from({ length: target }, spawn);
    };

    // A single accumulated exposure stands in for the animation when the user
    // has asked for reduced motion.
    const renderStill = () => {
      wipe();
      for (let i = 0; i < STILL_FRAMES; i += 1) {
        step();
        paint();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) renderStill();
      else wipe();
    };

    const frame = () => {
      if (repaintRef.current !== lastRepaint) {
        lastRepaint = repaintRef.current;
        wipe();
      }
      if (onScreen) {
        fade();
        step();
        paint();
      }
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      onScreen = !document.hidden;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // The canvas sits behind the page, so the vortex tracks the window rather
    // than the element — otherwise content would swallow every pointer move.
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
      };
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      for (const p of particlesRef.current) {
        const dx = p.x - event.clientX;
        const dy = p.y - event.clientY;
        const d = Math.hypot(dx, dy) || 1;
        if (d < POINTER_RADIUS * 1.6) {
          const push = (1 - d / (POINTER_RADIUS * 1.6)) * BURST;
          p.vx += (dx / d) * push;
          p.vy += (dy / d) * push;
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    if (!reduced) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 size-full no-print"
    />
  );
}
