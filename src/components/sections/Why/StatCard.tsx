"use client";

import { useInView } from "@/hooks/useInView";
import { Brackets } from "@/components/ui/Brackets/Brackets";
import styles from "./Why.module.css";

/** The big number with a light band sweeping across it, framed by corners that blink in. */
export function StatCard({ value, label }: { value: string; label: string[] }) {
  const [ref, fullyVisible] = useInView<HTMLDivElement>({ threshold: 0.95 });
  return (
    <div ref={ref} className={styles.card}>
      <Brackets outset={4} motion="flicker" active={fullyVisible} />
      <p className={styles.value}>
        {value}
        <span className={styles.shimmer} aria-hidden="true">
          {value}
        </span>
      </p>
      <p className={styles.label}>
        {label.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
    </div>
  );
}
