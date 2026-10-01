"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Grow or shrink the viewport box, e.g. "0px 0px 100px 0px" fires 100px early. */
  rootMargin?: string;
  /** How much of the element must be visible, from 0 to 1. */
  threshold?: number;
};

/** Becomes true the first time the element scrolls into view, and stays true. */
export function useInView<T extends Element>({ rootMargin = "0px", threshold = 0 }: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView] as const;
}
