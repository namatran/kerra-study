"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Markets.module.css";

const LAST_STEP = 19; // 20 positions: 0 is "between items", 1-19 select labels 9-27
const STEP_GAP_MS = 160; // at most one step per 160ms of scrolling
const FIRST_SELECTED = 9;

// Position 0 rests 5 degrees short of the first label; every step after that turns 10 degrees.
const rotationFor = (step: number) => (step === 0 ? -85 : -90 - (step - 1) * 10);

type Props = {
  labels: string[];
  monogram: string;
};

/**
 * A wheel of labels that turns one notch per scroll event while the section is on screen,
 * forwards when scrolling down and back when scrolling up, like the original.
 */
export function MarketsWheel({ labels, monogram }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [liveStep, setLiveStep] = useState(0);
  // With reduced motion the wheel stays still on the first label.
  const step = reducedMotion ? 1 : liveStep;
  const selected = step === 0 ? -1 : FIRST_SELECTED + step - 1;

  useEffect(() => {
    const section = stageRef.current?.closest("section");
    if (!section || reducedMotion) return;
    let lastY = window.scrollY;
    let lastStepAt = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (Math.abs(delta) < 4) return;
      const rect = section.getBoundingClientRect();
      const active = rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2;
      const now = performance.now();
      if (!active || now - lastStepAt < STEP_GAP_MS) return;
      lastStepAt = now;
      setLiveStep((current) => Math.min(LAST_STEP, Math.max(0, current + Math.sign(delta))));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <div ref={stageRef} className={styles.stage}>
      <span className={styles.monogram} aria-hidden="true">
        {monogram}
      </span>
      <ul className={styles.wheel} style={{ "--rotation": `${rotationFor(step)}deg` } as React.CSSProperties}>
        {labels.map((label, i) => (
          <li
            key={label}
            className={styles.label}
            data-selected={i === selected}
            style={{ "--angle": `${i * 10}deg` } as React.CSSProperties}
          >
            {label}
          </li>
        ))}
      </ul>
      <span className={styles.pointer} aria-hidden="true" />
      <div className={styles.fadeLeft} aria-hidden="true" />
      <div className={styles.fadeTop} aria-hidden="true" />
      <div className={styles.fadeBottom} aria-hidden="true" />
    </div>
  );
}
