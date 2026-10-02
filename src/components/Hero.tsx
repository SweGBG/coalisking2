"use client";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Hero.module.css";
import EmberField from "./EmberField";

// x %, y %, bredd px, delay s, duration s — fasta värden så SSR och klient matchar
const COALS: [number, number, number, number, number][] = [
  [2, 0, 190, 0, 4.2], [11, 3, 140, 1.1, 3.4], [19, 0, 210, 2.2, 5.1], [29, 4, 150, .6, 3.8],
  [37, 0, 230, 1.7, 4.6], [47, 3, 170, 2.9, 3.6], [55, 0, 220, .3, 5.4], [64, 4, 150, 2.1, 3.9],
  [72, 0, 200, 1.3, 4.4], [81, 3, 160, 2.6, 3.5], [89, 0, 220, .9, 5], [96, 4, 140, 1.9, 4],
];

export default function Hero() {
  const { lang } = useLang();
  const tr = t[lang].hero;

  return (
    <section className={styles.hero}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1558030006-450675393462?w=1800&q=85&fit=crop&crop=center"
        alt="Coal is King grill"
        className={styles.bg}
      />
      <div className={styles.overlay} />
      <div className={styles.coalbed} aria-hidden="true">
        <div className={styles.heat} />
        {COALS.map((c, i) => (
          <i key={i} className={styles.coal} style={{ left: `${c[0]}%`, bottom: `${c[1]}%`, width: `${c[2]}px`, height: `${c[2] * 0.42}px`, animationDelay: `${c[3]}s`, animationDuration: `${c[4]}s` }} />
        ))}
      </div>
      <EmberField />

      <div className={styles.content}>
        {/* Logo ersätter titeltexten */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Coal is King" className={styles.heroLogo} />

        <p className={styles.sub}>{tr.sub}</p>
        <div className={styles.btns}>
          <a href="#meny" className={styles.btnPrimary}>{tr.btn1}</a>
          <a href="#kontakt" className={styles.btnSecondary}>{tr.btn2}</a>
        </div>
      </div>

      {/* Floating badges */}
      <div className={styles.badge1}>
        <div className={styles.badgeDot} />
        <div>
          <div className={styles.badgeVal}>{tr.badge1}</div>
          <div className={styles.badgeSub}>{tr.badge1sub}</div>
        </div>
      </div>
      <div className={styles.badge2}>
        <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
        <div>
          <div className={styles.badgeVal}>{tr.badge2}</div>
          <div className={styles.badgeSub}>{tr.badge2sub}</div>
        </div>
      </div>

      <div className={styles.scroll}><div className={styles.scrollLine} /></div>
    </section>
  );
}
