"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Node = { x: number; y: number; hollow: boolean; weight: number };
type Tracker = { node: number; value: string; jumpAt: number };

const INK = "#0d0d0d";
const LIGHT = "#fafafa";

/**
 * Placeholder visual: a hexagonal lattice of dark grains that pulse in a slow wave,
 * with two small tracking boxes hopping between grains. Drawn on a 2D canvas.
 */
export function DotLattice({ className, label }: { className?: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const font = getComputedStyle(canvas).fontFamily;
    let width = 0;
    let height = 0;
    let spacing = 48;
    let nodes: Node[] = [];
    let central: number[] = [];
    let raf = 0;
    let onScreen = false;
    const trackers: Tracker[] = [
      { node: 0, value: "", jumpAt: 0 },
      { node: 0, value: "", jumpAt: 300 },
    ];

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      spacing = Math.max(30, Math.min(56, height / 10));
      const rowStep = spacing * 0.866;
      const cols = Math.ceil(width / spacing) + 3;
      const rows = Math.ceil(height / rowStep) + 3;
      const x0 = width / 2 - Math.floor(cols / 2) * spacing;
      const y0 = height / 2 - Math.floor(rows / 2) * rowStep;
      nodes = [];
      central = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = x0 + c * spacing + (r % 2 ? spacing / 2 : 0);
          const y = y0 + r * rowStep;
          // elliptical distance from the centre: grains are darkest in the middle. The
          // cluster's width follows the height, so wide, short boxes don't stretch it.
          const rx = Math.min(width / 2, height * 0.72);
          const d = Math.hypot((x - width / 2) / rx, (y - height / 2) / (height / 2));
          const weight = Math.max(0, Math.min(1, 1 - (d - 0.22) / 0.5));
          if (weight <= 0) continue;
          nodes.push({ x, y, hollow: (c * 7 + r * 13) % 11 === 0, weight });
          if (d < 0.3) central.push(nodes.length - 1);
        }
      }
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, width, height);
      for (const node of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 + node.x * 0.012 + node.y * 0.018);
        // grains nearly touch, leaving small star-shaped gaps between them
        const radius = spacing * (0.4 + 0.08 * pulse);
        ctx.globalAlpha = node.weight;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        if (node.hollow) {
          ctx.strokeStyle = INK;
          ctx.lineWidth = spacing * 0.14;
          ctx.stroke();
        } else {
          ctx.fillStyle = INK;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(node.x, node.y, spacing * (0.05 + 0.06 * pulse), 0, Math.PI * 2);
        ctx.fillStyle = LIGHT;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!central.length) return;
      for (const tracker of trackers) {
        if (now >= tracker.jumpAt) {
          tracker.node = central[Math.floor(Math.random() * central.length)];
          tracker.value = (0.2 + Math.random() * 0.15).toFixed(4);
          tracker.jumpAt = now + 550 + Math.random() * 400;
        }
        const node = nodes[tracker.node];
        const half = spacing * 0.5;
        const arm = spacing * 0.16;
        ctx.strokeStyle = LIGHT;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          const cx = node.x + sx * half;
          const cy = node.y + sy * half;
          ctx.moveTo(cx - sx * arm, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy - sy * arm);
        }
        ctx.stroke();
        ctx.fillStyle = LIGHT;
        ctx.font = `600 9px ${font}`;
        ctx.fillText(tracker.value, node.x - half + 3, node.y + half - 4);
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!reducedMotion && onScreen && !raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    viewObserver.observe(canvas);

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={label} />;
}
