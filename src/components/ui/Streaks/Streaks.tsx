import styles from "./Streaks.module.css";

type Props = {
  /** How dark the streaks get: "soft" for the intro, "deep" for the contact section. */
  tone?: "soft" | "deep";
  /** Fade to white starting this far from the centre (as a % of the radius). */
  clearCenter?: number;
};

/**
 * Stand-in for the original's WebGL backgrounds: blurred grey vertical bands, like light
 * through fluted glass, drifting slowly under a radial white fade.
 */
export function Streaks({ tone = "soft", clearCenter = 0 }: Props) {
  return (
    <div className={`${styles.root} ${styles[tone]}`} aria-hidden="true">
      <div className={styles.bands} />
      <div className={styles.fade} style={{ "--clear": `${clearCenter}%` } as React.CSSProperties} />
    </div>
  );
}
