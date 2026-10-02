"use client";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./About.module.css";
import CountUp from "./CountUp";

export default function About() {
  const { lang } = useLang();
  const tr = t[lang].about;

  return (
    <section className={styles.section} id="om-oss">
      <div className={styles.inner}>
        <div className={styles.imgWrap} data-reveal="left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=85&fit=crop&crop=center" alt="Coal is King kök" />
          <div className={styles.imgOverlay} />
          <div className={styles.tempBadge}>
            <div className={styles.tempNum}>{tr.stat1}</div>
            <div className={styles.tempLabel}>{tr.stat1l}</div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.eyebrow} data-reveal>{tr.eyebrow}</div>
          <h2 className={`${styles.title} ember-sheen`} data-reveal style={{ ["--reveal-delay" as string]: "0.08s" }}>{tr.title}</h2>
          <p className={styles.body} data-reveal style={{ ["--reveal-delay" as string]: "0.16s" }}>{tr.body1}</p>
          <p className={styles.body} data-reveal style={{ ["--reveal-delay" as string]: "0.22s" }}>{tr.body2}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}><CountUp value={tr.stat1} /></span>
              <span className={styles.statLabel}>{tr.stat1l}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}><CountUp value={tr.stat2} /></span>
              <span className={styles.statLabel}>{tr.stat2l}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}><CountUp value={tr.stat3} duration={1800} /></span>
              <span className={styles.statLabel}>{tr.stat3l}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
