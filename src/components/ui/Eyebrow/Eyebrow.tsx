"use client";

import { useInView } from "@/hooks/useInView";
import { ScrambleText } from "../ScrambleText/ScrambleText";
import styles from "./Eyebrow.module.css";

/**
 * Small section label: a dot that springs in once it's on screen, and text that types in
 * from random glyphs, starting just before it scrolls into view.
 */
export function Eyebrow({ label }: { label: string }) {
  const [textRef, textNear] = useInView<HTMLParagraphElement>({ rootMargin: "0px 0px 100px 0px" });
  const [dotRef, dotVisible] = useInView<HTMLSpanElement>();
  return (
    <p ref={textRef} className={styles.eyebrow}>
      <span ref={dotRef} className={styles.dot} data-visible={dotVisible} aria-hidden="true" />
      <ScrambleText text={label} mode="type" playId={textNear ? 1 : 0} />
    </p>
  );
}
