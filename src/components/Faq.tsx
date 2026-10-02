"use client";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Faq.module.css";

export default function Faq() {
  const { lang } = useLang();
  const tr = t[lang].faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.header}>
        <div className={styles.eyebrow} data-reveal>{tr.eyebrow}</div>
        <h2 className={`${styles.title} ember-sheen`} data-reveal style={{ ["--reveal-delay" as string]: "0.08s" }}>{tr.title}</h2>
      </div>

      <div className={styles.list}>
        {tr.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 0.06}s` }}
            >
            <div className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
              <button
                className={styles.q}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                id={`faq-q-${i}`}
              >
                <span>{item.q}</span>
                <span className={styles.plus} aria-hidden="true">
                  <span /><span />
                </span>
              </button>
              <div
                className={styles.aWrap}
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
              >
                <p className={styles.a}>{item.a}</p>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
