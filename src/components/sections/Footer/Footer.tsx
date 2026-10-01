import { footer } from "@/data/content";
import { Wordmark } from "@/components/ui/Wordmark/Wordmark";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer} data-section="footer">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <a href="#top" className={styles.logo} aria-label="Back to top">
            <Wordmark />
          </a>
        </div>
        <div className={styles.meta}>
          <p className={styles.notice}>{footer.disclaimer}</p>
          <ul className={styles.links}>
            {footer.links.map((link, i) => (
              <li key={link.label} className={styles.linkItem}>
                {i > 0 && <span className={styles.dot} aria-hidden="true" />}
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.socialWrap}>
          {/* Generic placeholder icon, not a real network's logo */}
          <a href={footer.social.href} className={styles.social} aria-label={footer.social.label}>
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <rect width="40" height="40" rx="6" fill="currentColor" />
              <path d="M15 25 25 15M17 15h8v8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
