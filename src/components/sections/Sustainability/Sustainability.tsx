import { sustainability } from "@/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import text from "@/components/ui/Text/Text.module.css";
import { PixelReveal } from "./PixelReveal";
import styles from "./Sustainability.module.css";

export function Sustainability() {
  return (
    <section id="sustainability" className={styles.sustainability} data-section="sustainability">
      <div className={`container ${styles.inner}`}>
        <div className={styles.media} role="img" aria-label={sustainability.visualLabel}>
          <div className={styles.art}>
            <span className={styles.pearl} />
          </div>
          <PixelReveal />
        </div>
        <div className={styles.content}>
          <div>
            <Eyebrow label={sustainability.eyebrow} />
            <h2 className={`${text.h2Long} ${styles.heading}`}>{sustainability.heading}</h2>
          </div>
          <div className={styles.paragraphs}>
            {sustainability.paragraphs.map((paragraph) => (
              <p key={paragraph} className={text.body}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
