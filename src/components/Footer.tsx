"use client";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Footer.module.css";
import SweGBGCredit from "./SweGBGCredit";

export default function Footer() {
  const { lang } = useLang();
  const tr = t[lang].footer;

  return (
    <footer className={styles.footer}>
      <div className={styles.sparks} aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ left: `${8 + i * 10.5}%`, animationDelay: `${(i * 1.3) % 6}s`, animationDuration: `${5 + (i % 4)}s` }} />)}
      </div>
      <div className={styles.inner}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Coal is King" className={styles.logo} />
        <p className={styles.tagline}>{tr.tagline}</p>
        <div className={styles.divider} />
        <div className={styles.links}>
          <a href="#meny">{lang === "sv" ? "Meny" : "Menu"}</a>
          <a href="#om-oss">{lang === "sv" ? "Om oss" : "About"}</a>
          <a href="#galleri">{lang === "sv" ? "Galleri" : "Gallery"}</a>
          <a href="#kontakt">{lang === "sv" ? "Kontakt" : "Contact"}</a>
        </div>
        <div className={styles.bottom}>
          <span>{tr.copy}</span>
          <span>{tr.orgnr}</span>
        </div>
      </div>
      <SweGBGCredit lang={lang} endGap="5.5rem" accent="#d4a94f" text="rgba(237,228,214,.5)" line="rgba(212,169,79,.22)" />
    </footer>
  );
}
