"use client";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const { lang } = useLang();
  const tr = t[lang].testi;

  return (
    <section className={styles.section} id="recensioner">
      <div className={styles.header}>
        <div className={styles.eyebrow} data-reveal>{tr.eyebrow}</div>
        <h2 className={`${styles.title} ember-sheen`} data-reveal style={{ ["--reveal-delay" as string]: "0.08s" }}>{tr.title}</h2>
      </div>

      <div className={styles.grid}>
        {tr.items.map((item, i) => (
          <figure
            key={item.name}
            className={styles.card}
            data-reveal="scale"
            style={{ ["--reveal-delay" as string]: `${i * 0.08}s` }}
          >
            <div className={styles.stars} aria-label="5 av 5 stjärnor">
              {[...Array(5)].map((_, s) => (
                <svg key={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <blockquote className={styles.quote}>&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className={styles.meta}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.role}>{item.role}</span>
            </figcaption>
            <div className={styles.mark} aria-hidden="true">&rdquo;</div>
          </figure>
        ))}
      </div>
    </section>
  );
}
