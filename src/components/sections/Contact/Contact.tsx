import { contact } from "@/data/content";
import { Streaks } from "@/components/ui/Streaks/Streaks";
import text from "@/components/ui/Text/Text.module.css";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.contact} data-section="contact">
      <div className={styles.background}>
        <Streaks tone="deep" clearCenter={49.5} />
      </div>
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <div>
            <h2 className={text.h2}>{contact.heading}</h2>
            <p className={`${text.body} ${styles.tagline}`}>
              {contact.tagline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
          <div className={styles.email}>
            <p className={text.body}>{contact.emailPrompt}</p>
            <a className={styles.emailLink} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
