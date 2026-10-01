"use client";

import { useEffect } from "react";
import { markPreloaderDone } from "@/hooks/usePreloaderDone";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Wordmark } from "@/components/ui/Wordmark/Wordmark";
import styles from "./Preloader.module.css";

/**
 * White overlay with the wordmark filling in from left to right. The timing lives in CSS,
 * so the overlay still clears itself if JavaScript never runs.
 */
export function Preloader() {
  const reducedMotion = usePrefersReducedMotion();

  // With reduced motion the overlay is hidden by CSS, so tell the page straight away.
  useEffect(() => {
    if (reducedMotion) markPreloaderDone();
  }, [reducedMotion]);

  return (
    <div
      className={styles.preloader}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) markPreloaderDone();
      }}
    >
      <div className={styles.mark}>
        <Wordmark className={styles.ghost} />
        <Wordmark className={styles.fill} />
      </div>
    </div>
  );
}
