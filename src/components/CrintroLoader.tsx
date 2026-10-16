"use client";
import { useEffect, useRef, useState } from "react";
import { crintro, nearestFrame } from "@/lib/crintro";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import styles from "./CrintroLoader.module.css";

/*
 * CRiNTRO Loader: "COAL IS KING" ignites letter by letter on the charcoal screen while the H3 film
 * loads behind it. The glowing rule is the real loading bar (it heats from dark ember to white-hot),
 * but it never runs ahead of its own animation, so with a warm cache it looks like a plain 1.9 s intro.
 * On a slow line it waits (at most MAX) for the opening of the film, then the charcoal screen lifts.
 * The hero's own entrance animations are held (html.crintro-wait) until the curtain goes.
 */
const RULE_START = 0.5; // s
const RULE_END = 1.5; // s, full with everything cached
const MIN = 1.9; // s, earliest curtain
const MAX = 3.6; // s, latest curtain; whatever is left keeps loading behind the page

const WORD = ["COAL", "IS", "KING"];
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

export default function CrintroLoader() {
  const { lang } = useLang();
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const fill = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const store = crintro();
    const html = document.documentElement;
    const release = () => html.classList.remove("crintro-wait");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      release();
      return setGone(true);
    }
    const t0 = performance.now();
    let shown = 0, raf = 0, last = t0, done = false;
    const ready = () => store.crit >= 1 && (store.mode !== "frames" || !!nearestFrame(0));
    const tick = (now: number) => {
      const s = (now - t0) / 1000;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const natural = ease((s - RULE_START) / (RULE_END - RULE_START));
      const forced = s >= MAX;
      const loaded = ready() ? 1 : Math.min(0.97, store.crit);
      // never ahead of the animation, never ahead of the real loading, never backwards
      const target = forced ? 1 : Math.min(natural, loaded);
      const k = 1 - Math.pow(forced ? 1e-9 : 1e-5, dt); // ~0.18 per frame at 60 Hz, same feel at 120 Hz
      shown = Math.max(shown, shown + (target - shown) * k);
      if (fill.current) fill.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (tip.current) {
        tip.current.style.transform = `translateX(${(shown * 100).toFixed(2)}cqw)`;
        tip.current.style.opacity = shown > 0.01 && shown < 0.995 ? "1" : "0";
      }
      root.current?.classList.toggle(styles.wait, s > MIN && !ready() && !forced);
      if (!done && s >= MIN && shown > 0.995) {
        done = true;
        release();
        setOut(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  let n = 0;
  return (
    <div
      ref={root}
      className={`${styles.loader} crintro-loader${out ? ` ${styles.out}` : ""}`}
      aria-hidden="true"
      onTransitionEnd={(e) => out && e.target === root.current && setGone(true)}
    >
      <div className={styles.inner}>
        <div className={styles.word}>
          {WORD.map((w, wi) => (
            <span key={w} className={wi === 2 ? styles.king : undefined}>
              {w.split("").map((c) => (
                <i key={n} style={{ animationDelay: `${0.08 + n++ * 0.07}s` }}>{c}</i>
              ))}
            </span>
          ))}
        </div>
        <div className={styles.track}>
          <div className={styles.fill} ref={fill} />
          <span className={styles.tip} ref={tip} />
        </div>
        <p className={styles.sub}>{t[lang].film.kicker}</p>
      </div>
    </div>
  );
}
