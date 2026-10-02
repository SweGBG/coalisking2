"use client";
import { useEffect, useState, useCallback } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Gallery.module.css";

const photos = [
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&fit=crop&crop=center", span: "wide" },
  { src: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&fit=crop&crop=center", span: "" },
  { src: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop&crop=center", span: "" },
  { src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&fit=crop&crop=center", span: "" },
  { src: "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=600&q=80&fit=crop&crop=center", span: "" },
  { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&fit=crop&crop=center", span: "wide" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop&crop=center", span: "" },
];

// Hi-res-variant för lightbox
const big = (src: string) => src.replace(/w=\d+/, "w=1600").replace(/q=\d+/, "q=88");

export default function Gallery() {
  const { lang } = useLang();
  const tr = t[lang].gallery;
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => {
    setOpen(o => (o === null ? o : (o + d + photos.length) % photos.length));
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  return (
    <section className={styles.section} id="galleri">
      <div className={styles.header}>
        <div className={styles.eyebrow} data-reveal>{tr.eyebrow}</div>
        <h2 className={`${styles.title} ember-sheen`} data-reveal style={{ ["--reveal-delay" as string]: "0.08s" }}>{tr.title}</h2>
      </div>
      <div className={styles.grid}>
        {photos.map((p, i) => (
          <button
            key={i}
            className={`${styles.cell} ${p.span === "wide" ? styles.wide : ""}`}
            data-reveal="scale"
            style={{ ["--reveal-delay" as string]: `${Math.min(i, 6) * 0.06}s` }}
            onClick={() => setOpen(i)}
            aria-label={`${lang === "sv" ? "Visa bild" : "View photo"} ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={`Coal is King foto ${i + 1}`} loading="lazy" />
            <div className={styles.cellOverlay} />
            <span className={styles.zoom} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
                <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div className={styles.lightbox} onClick={close} role="dialog" aria-modal="true" aria-label="Bildvisare">
          <button className={styles.lbClose} onClick={close} aria-label={lang === "sv" ? "Stäng" : "Close"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className={`${styles.lbNav} ${styles.lbPrev}`} onClick={e => { e.stopPropagation(); step(-1); }} aria-label={lang === "sv" ? "Föregående" : "Previous"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={big(photos[open].src)}
            alt={`Coal is King foto ${open + 1}`}
            className={styles.lbImg}
            onClick={e => e.stopPropagation()}
          />
          <button className={`${styles.lbNav} ${styles.lbNext}`} onClick={e => { e.stopPropagation(); step(1); }} aria-label={lang === "sv" ? "Nästa" : "Next"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <div className={styles.lbCount}>{open + 1} / {photos.length}</div>
        </div>
      )}
    </section>
  );
}
