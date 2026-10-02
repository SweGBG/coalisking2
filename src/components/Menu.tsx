"use client";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Menu.module.css";

export default function Menu() {
  const { lang } = useLang();
  const tr = t[lang].menu;
  const [active, setActive] = useState(0);

  const filtered = active === 0 ? tr.items : tr.items.filter(i => i.cat === tr.cats[active]);
  const count = (i: number) => (i === 0 ? tr.items.length : tr.items.filter(it => it.cat === tr.cats[i]).length);

  return (
    <section className={styles.section} id="meny">
      <div className={styles.header}>
        <div className={styles.eyebrow} data-reveal>{tr.eyebrow}</div>
        <h2 className={`${styles.title} ember-sheen`} data-reveal style={{ ["--reveal-delay" as string]: "0.08s" }}>{tr.title}</h2>
        <p className={styles.sub} data-reveal style={{ ["--reveal-delay" as string]: "0.16s" }}>{tr.sub}</p>
      </div>

      <div className={styles.filters} data-reveal style={{ ["--reveal-delay" as string]: "0.2s" }}>
        {tr.cats.map((cat, i) => (
          <button key={cat} className={`${styles.filter} ${active === i ? styles.filterActive : ""}`} onClick={() => setActive(i)}>
            {cat}
            <span className={styles.filterCount}>{count(i)}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item, i) => (
          <div key={`${active}-${i}`} className={styles.card} data-reveal="scale" style={{ ["--reveal-delay" as string]: `${Math.min(i, 6) * 0.06}s` }}>
            <div className={styles.cardTop}>
              <div className={styles.cardName}>{item.name}</div>
              {item.tag && <span className={`${styles.tag} ${item.tag === "Kung" || item.tag === "King" ? styles.tagKing : item.tag === "Signatur" || item.tag === "Signature" ? styles.tagSig : styles.tagPop}`}>{item.tag}</span>}
            </div>
            <div className={styles.cardDesc}>{item.desc}</div>
            <div className={styles.cardFooter}>
              <div className={styles.cardCat}>{item.cat}</div>
              <div className={styles.cardPrice}>{item.price}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
