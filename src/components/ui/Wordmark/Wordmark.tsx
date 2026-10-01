import { site } from "@/data/content";
import styles from "./Wordmark.module.css";

/** The placeholder brand name, set in a serif in place of the original's custom logo. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={`${styles.wordmark} ${className ?? ""}`}>{site.brand}</span>;
}
