"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./Philosophy.module.css";

/** Manifest: the stage is pinned and each word catches fire as you scroll through it. */
export default function Philosophy() {
  const { lang } = useLang();
  const tr = t[lang].fire;
  const root = useRef<HTMLElement>(null);
  const words = tr.words.split(" ");

  useEffect(() => {
    const el = root.current!;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      const lit = p * (spans.length + 3);
      spans.forEach((s, i) => s.style.setProperty("--h", String(Math.min(1, Math.max(0, lit - i)))));
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [lang]);

  return (
    <section className={styles.section} ref={root} aria-label={tr.eyebrow.replace("— ", "")}>
      <div className={styles.stage}>
        <div className={styles.glow} aria-hidden />
        <p className={styles.eyebrow}>{tr.eyebrow}</p>
        <p className={styles.words}>
          {words.map((w, i) => (
            <span key={i} data-w className={styles.w}>{w}{" "}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
