"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Signature.module.css";

/** Signature dishes: the section is pinned and the cards glide sideways with the scroll (swipe on phones). */
export default function Signature() {
  const { lang } = useLang();
  const tr = t[lang].sig;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!, tk = track.current!;
    const phone = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    let raf = 0, dist = 0;
    const measure = () => {
      if (phone.matches) { el.style.height = ""; tk.style.transform = ""; dist = 0; return; }
      dist = Math.max(0, tk.scrollWidth - window.innerWidth);
      el.style.height = `${window.innerHeight + dist}px`;
    };
    const update = () => {
      raf = 0;
      if (!dist) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      tk.style.transform = `translate3d(${-p * dist}px,0,0)`;
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); update(); };
    measure(); update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    phone.addEventListener("change", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); phone.removeEventListener("change", onResize); cancelAnimationFrame(raf); };
  }, [lang]);

  return (
    <section className={styles.section} ref={root} aria-labelledby="sig-title">
      <div className={styles.stage}>
        <div className={styles.track} ref={track}>
          <header className={styles.head}>
            <p className={styles.eyebrow}>{tr.eyebrow}</p>
            <h2 id="sig-title" className={styles.title}>{tr.title}</h2>
            <span className={styles.hint} aria-hidden>{tr.hint} <i>→</i></span>
          </header>
          {tr.items.map((d, i) => (
            <article key={d.name} className={styles.card} style={{ ["--i" as string]: i }}>
              <div className={styles.imgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt={d.name} loading="lazy" width={1200} height={900} />
                <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.body}>
                <h3>{d.name}</h3>
                <p>{d.desc}</p>
                <b>{d.price}</b>
              </div>
            </article>
          ))}
          <a href="#meny" className={styles.end}>
            <span>{tr.cta}</span>
            <i aria-hidden>→</i>
          </a>
        </div>
        <div className={styles.bar} aria-hidden><i /></div>
      </div>
    </section>
  );
}
