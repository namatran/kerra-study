import { markets, site } from "@/data/content";
import { PillButton } from "@/components/ui/PillButton/PillButton";
import text from "@/components/ui/Text/Text.module.css";
import { MarketsWheel } from "./MarketsWheel";
import styles from "./Markets.module.css";

export function Markets() {
  return (
    <section id="markets" className={styles.markets} data-section="markets">
      <MarketsWheel labels={markets.wheel} monogram={site.brand.charAt(0)} />
      <div className={styles.content}>
        <h2 className={text.h2}>{markets.heading}</h2>
        <div className={styles.paragraphs}>
          {markets.paragraphs.map((paragraph) => (
            <p key={paragraph} className={text.body}>
              {paragraph}
            </p>
          ))}
        </div>
        <PillButton href={markets.cta.href} label={markets.cta.label} className={styles.cta} />
      </div>
    </section>
  );
}
