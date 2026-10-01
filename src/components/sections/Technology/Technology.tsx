import { technology } from "@/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import text from "@/components/ui/Text/Text.module.css";
import { DotLattice } from "./DotLattice";
import styles from "./Technology.module.css";

export function Technology() {
  return (
    <section id="technology" className={styles.technology} data-section="technology">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <Eyebrow label={technology.eyebrow} />
          <h2 className={`${text.h2} ${styles.heading}`}>{technology.heading}</h2>
          <div className={styles.paragraphs}>
            {technology.paragraphs.map((paragraph) => (
              <p key={paragraph} className={text.body}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.visual}>
          <DotLattice className={styles.canvas} label={technology.visualLabel} />
          <div className={styles.fade} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
