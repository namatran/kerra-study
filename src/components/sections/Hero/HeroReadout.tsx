"use client";

import { usePreloaderDone } from "@/hooks/usePreloaderDone";
import { ScrambleText } from "@/components/ui/ScrambleText/ScrambleText";
import styles from "./Hero.module.css";

// Per-line decode speed, as measured: the first line resolves slowest.
const CHAR_MS = [80, 55, 45];

/** The small spec readout. Each line decodes from the right once the preloader lifts. */
export function HeroReadout({ lines }: { lines: string[] }) {
  const ready = usePreloaderDone();
  return (
    <div className={styles.readout}>
      {lines.map((line, i) => (
        <ScrambleText
          key={line}
          text={line}
          mode="resolve-right"
          playId={ready ? 1 : 0}
          charMs={CHAR_MS[i] ?? 60}
          align="right"
        />
      ))}
    </div>
  );
}
