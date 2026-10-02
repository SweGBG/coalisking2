"use client";
import { useLang } from "@/lib/LangContext";
import styles from "./Marquee.module.css";

/** Rullande band med restaurangens kärnord — sektionsavdelare med attityd. */
export default function Marquee() {
  const { lang } = useLang();
  const words =
    lang === "sv"
      ? ["KOL", "ELD", "RÖK", "800°C", "DRY-AGED", "MAILLARD", "EK & HICKORY"]
      : ["COAL", "FIRE", "SMOKE", "800°C", "DRY-AGED", "MAILLARD", "OAK & HICKORY"];

  const row = words.map((w, i) => (
    <span key={i} className={styles.item}>
      {w}
      <svg className={styles.flame} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2c1.5 3.5-1 5-1 7.5 0 1.7 1.3 3 3 3 2.2 0 3.5-2 3-4.5 2 1.5 3 4 3 6.5A8 8 0 1 1 6 9c0-1.5.5-3 1.5-4C7.5 7.5 9 9 10.5 9 11 6 10 4 12 2z"/>
      </svg>
    </span>
  ));

  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.track}>
        <div className={styles.group}>{row}</div>
        <div className={styles.group}>{row}</div>
      </div>
    </div>
  );
}
