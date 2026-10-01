import styles from "./Brackets.module.css";

const CORNERS = ["topLeft", "topRight", "bottomRight", "bottomLeft"] as const;

type Props = {
  /** How far outside the parent's box the corners sit, in px. */
  outset: number;
  /** "flicker" blinks once when `active` turns true; "appear" slides each corner in. */
  motion?: "flicker" | "appear";
  active?: boolean;
};

/**
 * Four L-shaped corner marks framing the parent (which needs position: relative).
 * One shape, rotated a quarter turn per corner.
 */
export function Brackets({ outset, motion, active = false }: Props) {
  return (
    <span
      className={styles.frame}
      data-motion={motion}
      data-active={active}
      style={{ "--outset": `${outset}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      {CORNERS.map((corner) => (
        <svg key={corner} className={`${styles.corner} ${styles[corner]}`} width="14" height="16" viewBox="0 0 14 16">
          <path d="M1 16V5a4 4 0 0 1 4-4h9" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ))}
    </span>
  );
}
