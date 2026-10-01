"use client";

import { useInView } from "@/hooks/useInView";
import styles from "./Intro.module.css";

// Placeholder partner marks: a symbol plus grey bars standing in for a name.
const MARKS = [
  { width: 180, height: 38, rest: 0.7, shapes: <><circle cx="17" cy="19" r="15" /><rect x="42" y="9" width="122" height="10" rx="2" /><rect x="42" y="24" width="76" height="6" rx="2" /></> },
  { width: 180, height: 57, rest: 0.7, shapes: <><rect x="2" y="8" width="40" height="40" rx="6" /><rect x="54" y="12" width="96" height="9" rx="2" /><rect x="54" y="26" width="118" height="9" rx="2" /><rect x="54" y="40" width="60" height="6" rx="2" /></> },
  { width: 240, height: 38, rest: 0.5, shapes: <><rect x="0" y="8" width="22" height="22" rx="11" /><rect x="30" y="8" width="44" height="22" rx="3" /><rect x="82" y="8" width="58" height="22" rx="3" /><rect x="148" y="8" width="38" height="22" rx="3" /><rect x="194" y="8" width="46" height="22" rx="3" /></> },
  { width: 153, height: 56, rest: 0.6, shapes: <><path d="M4 48 24 8l20 40Z" /><rect x="56" y="18" width="92" height="12" rx="2" /><rect x="56" y="34" width="58" height="6" rx="2" /></> },
];

/** The "supported by" row. All marks fade in together as the row nears the viewport. */
export function PartnerRow({ labels }: { labels: string[] }) {
  const [ref, visible] = useInView<HTMLUListElement>({ rootMargin: "0px 0px 125px 0px" });
  return (
    <ul ref={ref} className={styles.partners} data-visible={visible}>
      {MARKS.map((mark, i) => (
        <li key={i} className={styles.partner} style={{ "--rest": mark.rest } as React.CSSProperties}>
          <svg width={mark.width} height={mark.height} viewBox={`0 0 ${mark.width} ${mark.height}`} role="img" aria-label={labels[i]}>
            <g fill="currentColor">{mark.shapes}</g>
          </svg>
        </li>
      ))}
    </ul>
  );
}
