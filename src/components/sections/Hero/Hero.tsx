import { hero } from "@/data/content";
import { Brackets } from "@/components/ui/Brackets/Brackets";
import { HeroReadout } from "./HeroReadout";
import { HeroScene } from "./HeroScene";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="top" className={styles.hero} data-section="hero" aria-label="Introduction">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.placeholder} />
        <HeroScene className={styles.scene} />
        <div className={styles.fadeEdges} />
        <div className={styles.fadeTop} />
        <div className={styles.fadeBottom} />
      </div>
      <div className={styles.content}>
        <div className={styles.headlineBox}>
          <Brackets motion="appear" />
          <h1 className={styles.headline}>
            {hero.headline.map((line, i) => (
              <span key={line} className={styles.line} style={{ "--i": i } as React.CSSProperties}>
                <span className={styles.lineText}>{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <HeroReadout lines={hero.readout} />
      </div>
    </section>
  );
}
