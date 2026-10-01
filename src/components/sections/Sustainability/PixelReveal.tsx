"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Sustainability.module.css";

const TILE = 37; // px, as measured
const START_DELAY_MS = 450; // the original waits about half a second after it comes into view
const SPREAD_MS = 450; // rows clear top to bottom across this window
const JITTER_MS = 160;
const FADE_MS = 220;

type Tile = { x: number; y: number; w: number; h: number; at: number; tint: string };

/**
 * Covers its parent with white tiles, then clears them roughly top to bottom in a loose,
 * random order once the parent scrolls into view. Each tile passes through a pale grey
 * on its way out, like a mosaic resolving.
 */
export function PixelReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || reducedMotion) return;

    let tiles: Tile[] = [];
    let width = 0;
    let height = 0;
    let revealAt = Infinity;
    let raf = 0;
    let finished = false;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.max(1, Math.round(width / TILE));
      const rows = Math.max(1, Math.round(height / TILE));
      const w = width / cols;
      const h = height / rows;
      tiles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const grey = 233 + Math.floor(Math.random() * 16);
          tiles.push({
            x: c * w,
            y: r * h,
            w: w + 0.5,
            h: h + 0.5,
            at: (r / Math.max(1, rows - 1)) * SPREAD_MS + Math.random() * JITTER_MS,
            tint: `rgb(${grey} ${grey} ${grey})`,
          });
        }
      }
    };

    const draw = (now: number) => {
      const elapsed = now - revealAt;
      ctx.clearRect(0, 0, width, height);
      let pending = false;
      for (const tile of tiles) {
        const t = elapsed - tile.at;
        if (t < 0) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#ffffff";
        } else if (t < FADE_MS) {
          ctx.globalAlpha = 1 - t / FADE_MS;
          ctx.fillStyle = tile.tint;
        } else {
          continue;
        }
        pending = true;
        ctx.fillRect(tile.x, tile.y, tile.w, tile.h);
      }
      ctx.globalAlpha = 1;
      return pending;
    };

    const loop = (now: number) => {
      if (draw(now)) raf = requestAnimationFrame(loop);
      else finished = true;
    };

    layout();
    draw(performance.now());

    const resizeObserver = new ResizeObserver(() => {
      if (finished) return;
      layout();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        viewObserver.disconnect();
        revealAt = performance.now() + START_DELAY_MS;
        raf = requestAnimationFrame(loop);
      },
      { threshold: 0.2 },
    );
    viewObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={styles.reveal} aria-hidden="true" />;
}
