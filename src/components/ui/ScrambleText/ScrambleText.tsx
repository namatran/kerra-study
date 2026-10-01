"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./ScrambleText.module.css";

// Block shapes and punctuation, like the original's decoding labels.
const GLYPHS = "▧▨▤▥▦█▓▒░▮▯▰▱#$%&@*+=?^~:;,.<>()[]{}|_";
const TICK_MS = 50; // glyphs re-roll every 50ms, as measured
const TYPE_MS = 45; // "type" mode: one new glyph every 45ms
const TYPE_LAG_MS = 550; // "type" mode: characters start resolving after 550ms

const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const noise = (length: number) => Array.from({ length }, glyph).join("");
const noiseLike = (text: string) => [...text].map((c) => (c === " " ? " " : glyph())).join("");

type Mode =
  /** Glyphs type in from the left, then resolve left to right (eyebrow labels). */
  | "type"
  /** Every character scrambles, then resolves left to right (button hover). */
  | "resolve-left"
  /** A ragged run of glyphs resolves from the right end (hero spec readout). */
  | "resolve-right";

function frame(text: string, mode: Mode, elapsed: number, charMs: number) {
  const n = text.length;
  if (mode === "type") {
    const typed = Math.min(n, Math.floor(elapsed / TYPE_MS));
    const resolved = Math.max(0, Math.min(n, Math.floor((elapsed - TYPE_LAG_MS) / charMs)));
    return { value: text.slice(0, resolved) + noise(Math.max(0, typed - resolved)), done: resolved >= n };
  }
  const resolved = Math.min(n, Math.floor(elapsed / charMs));
  if (mode === "resolve-left") {
    return { value: text.slice(0, resolved) + noiseLike(text.slice(resolved)), done: resolved >= n };
  }
  const remaining = n - resolved;
  const ragged = remaining === 0 ? 0 : 1 + Math.floor(Math.random() * remaining);
  return { value: noise(ragged) + text.slice(n - resolved), done: resolved >= n };
}

type Props = {
  text: string;
  mode: Mode;
  /** 0 means "not yet". Every new value starts the effect again. */
  playId: number;
  /** Wait this long after playId changes before starting. */
  delay?: number;
  /** Time to resolve each character. */
  charMs?: number;
  /** Which edge stays put while the scrambled text changes width. */
  align?: "left" | "right" | "center";
  className?: string;
};

/**
 * Text that decodes from random glyphs. An invisible copy of the final text keeps the
 * layout steady (and is what screen readers read); the animated copy sits on top.
 */
export function ScrambleText({ text, mode, playId, delay = 0, charMs = 55, align = "left", className }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const hiddenUntilPlayed = mode === "type" && playId === 0 && !reducedMotion;

  // Server HTML shows the final text; "type" labels then hide until they play.
  useLayoutEffect(() => {
    if (hiddenUntilPlayed) setDisplay("");
  }, [hiddenUntilPlayed]);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    if (!playId) return;
    let raf = 0;
    let lastTick = -Infinity;
    const timer = window.setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        if (now - lastTick >= TICK_MS) {
          lastTick = now;
          const { value, done } = frame(text, mode, now - start, charMs);
          setDisplay(value);
          if (done) return;
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [playId, text, mode, delay, charMs, reducedMotion]);

  return (
    <span className={`${styles.root} ${className ?? ""}`}>
      <span className={styles.ghost}>{text}</span>
      <span className={`${styles.live} ${styles[align]}`} aria-hidden="true">
        {display}
      </span>
    </span>
  );
}
