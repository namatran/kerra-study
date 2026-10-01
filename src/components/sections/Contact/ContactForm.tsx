"use client";

import { useState } from "react";
import { contact } from "@/data/content";
import styles from "./Contact.module.css";

/** The contact form. It's a design study, so submitting only shows a note. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      {contact.fields.map((field) => (
        <label key={field.name} className={styles.field}>
          <span className="visually-hidden">{field.label}</span>
          <input className={styles.input} name={field.name} type={field.type} placeholder={field.label} autoComplete="off" />
        </label>
      ))}
      <label className={`${styles.field} ${styles.messageField}`}>
        <span className="visually-hidden">{contact.message.label}</span>
        <textarea className={styles.textarea} name={contact.message.name} placeholder={contact.message.label} />
      </label>
      <button type="submit" className={styles.submit}>
        {contact.submit}
      </button>
      <p className={styles.notice} role="status">
        {sent ? contact.notice : ""}
      </p>
    </form>
  );
}
