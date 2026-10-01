import { intro, site } from "@/data/content";
import { Streaks } from "@/components/ui/Streaks/Streaks";
import { PartnerRow } from "./PartnerRow";
import styles from "./Intro.module.css";

export function Intro() {
  return (
    <section id="intro" className={styles.intro} data-section="intro">
      <Streaks tone="soft" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h2 className={styles.statement}>
            <strong>{site.brand}</strong> {intro.statement}
          </h2>
          <p className={styles.lead}>{intro.lead}</p>
        </div>
        <div className={styles.partnersBlock}>
          <p className={styles.label}>{intro.partnersLabel}</p>
          <PartnerRow labels={intro.partners} />
        </div>
      </div>
    </section>
  );
}
