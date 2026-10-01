import { why } from "@/data/content";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import text from "@/components/ui/Text/Text.module.css";
import { StatCard } from "./StatCard";
import styles from "./Why.module.css";

export function Why() {
  return (
    <section id="why" className={styles.why} data-section="why">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <Eyebrow label={why.eyebrow} />
          <h2 className={`${text.h2Long} ${styles.heading}`}>{why.heading}</h2>
          <p className={`${text.body} ${styles.body}`}>{why.body}</p>
        </div>
        <StatCard value={why.stat.value} label={why.stat.label} />
      </div>
    </section>
  );
}
