import { nav } from "@/data/content";
import { PillButton } from "@/components/ui/PillButton/PillButton";
import { Wordmark } from "@/components/ui/Wordmark/Wordmark";
import styles from "./Nav.module.css";

function Bracket({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`${styles.bracket} ${styles[side]}`} width="5" height="12" viewBox="0 0 5 12" aria-hidden="true">
      <path d={side === "left" ? "M4.5 .75H.75v10.5H4.5" : "M.5 .75h3.75v10.5H.5"} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className={styles.nav} data-section="nav">
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="Back to top">
          <Wordmark />
        </a>
        <nav className={styles.menu} aria-label="Main">
          <ul className={styles.links}>
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  <Bracket side="left" />
                  {link.label}
                  <Bracket side="right" />
                </a>
              </li>
            ))}
          </ul>
          <PillButton href={nav.cta.href} label={nav.cta.label} />
        </nav>
      </div>
    </header>
  );
}
