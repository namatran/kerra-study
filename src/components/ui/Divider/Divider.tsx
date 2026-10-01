import styles from "./Divider.module.css";

/** The hairline and breathing room that sits between content sections. */
export function Divider() {
  return (
    <div className={styles.divider} data-section="divider" aria-hidden="true">
      <div className={styles.line} />
    </div>
  );
}
