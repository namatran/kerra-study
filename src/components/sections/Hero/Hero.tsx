import styles from "./Hero.module.css";

// Temporary: a soft grey gradient holds the hero's space until the hero is built last.
export function Hero() {
  return (
    <section id="top" className={styles.hero} data-section="hero" aria-label="Introduction">
      <div className={styles.placeholder} aria-hidden="true" />
    </section>
  );
}
