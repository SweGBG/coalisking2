"use client";
import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

/**
 * Värmemätare: temperaturen stiger från 20 till 800 °C medan man scrollar.
 * Desktop: vertikal termometer till vänster. Mobil: tunn stapel högst upp.
 * Skriver direkt på ett par element (ingen React-state per scroll-frame).
 */
export default function ScrollProgress() {
  const fill = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const temp = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let shown = -1;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(Math.max(max > 0 ? window.scrollY / max : 0, 0), 1);
      if (fill.current) fill.current.style.clipPath = `inset(${(1 - p) * 100}% 0 0 0)`;
      if (tip.current) tip.current.style.bottom = `${p * 100}%`;
      if (bar.current) bar.current.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      const c = Math.round(20 + p * 780);
      if (c !== shown && temp.current) {
        shown = c;
        temp.current.textContent = String(c);
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className={styles.topbar} aria-hidden="true"><div ref={bar} className={styles.topfill} /></div>
      <div className={styles.gauge} aria-hidden="true">
        <div className={styles.track}>
          <div ref={fill} className={styles.fill} />
          <div ref={tip} className={styles.tip}>
            <span className={styles.dot} />
            <span className={styles.read}><span ref={temp}>20</span>°C</span>
          </div>
        </div>
      </div>
    </>
  );
}
