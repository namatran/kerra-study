"use client";

import { useState } from "react";
import { ScrambleText } from "../ScrambleText/ScrambleText";
import styles from "./PillButton.module.css";

type Props = {
  href: string;
  label: string;
  className?: string;
};

/** Dark pill link. On hover the background deepens and the label re-decodes. */
export function PillButton({ href, label, className }: Props) {
  const [playId, setPlayId] = useState(0);
  return (
    <a
      href={href}
      className={`${styles.pill} ${className ?? ""}`}
      onMouseEnter={() => setPlayId((id) => id + 1)}
    >
      <ScrambleText
        text={label}
        mode="resolve-left"
        playId={playId}
        charMs={Math.max(18, 420 / label.length)}
        align="center"
      />
    </a>
  );
}
