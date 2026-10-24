"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/LangContext";
import { t } from "@/lib/translations";
import EmberField from "./EmberField";
import { crintro, nearestFrame, onCrintro, wantFrame, PHONE_QUERY } from "@/lib/crintro";
import styles from "./FilmHero.module.css";

/*
 * The film IS the hero: a sticky stage where the scroll scrubs a self-made AI film
 * (MiniMax H3) – cold coals ignite, the steak hits the grate, the flame flares, the king is served.
 * The CRiNTRO Loader (src/lib/crintro.ts) loads the film while the intro plays: desktop gets the
 * mp4 as a local blob, phones get a streamed image sequence. If neither loads, a real photo per
 * chapter crossfades with a slow push-in.
 *
 * Brand reveal: the film starts clean (only a scroll hint), chapters 01–03 tell the story while it
 * plays, then the film stops on its last frame, the scene darkens, the Coal is King emblem gathers out
 * of sparks and lands, and the name, tagline and buttons rise in beside it. The first time, the page
 * holds still for a moment so the logo can settle.
 */
const POSTER = "/video/coal-poster.webp";
const PHOTOS = ["/img/ch-glod.webp", "/img/ch-kott.webp", "/img/ch-eld.webp", "/img/ch-kung.webp"];

/** Scroll progress (0–1 through the hero) */
const START_END = 0.05; // clean film, only the hint
const FILM_END = 0.78; // the film is done: the last frame stays
const REVEAL_AT = 0.76; // the brand pops
const HOLD_AT = 0.8; // the page stands still here (first time)
const HOLD_MS = 2600;

/** Scroll ranges (0–1) for the hint and the three film chapters: [in, full, hold, out] */
type R = [number, number, number, number];
const HINT: R = [-1, 0, 0.02, 0.06];
const CH: R[] = [
  [0.07, 0.11, 0.22, 0.27],
  [0.29, 0.33, 0.44, 0.49],
  [0.51, 0.55, 0.66, 0.71],
];
/** Chapter navigator: three film chapters, the fourth ("the king") is the brand reveal */
const SPAN: [number, number][] = [[START_END, 0.28], [0.28, 0.5], [0.5, REVEAL_AT], [REVEAL_AT, HOLD_AT]];

/** Sparks that gather into the emblem: [x, y, delay] */
const SPARKS: [string, string, string][] = [
  ["-180px", "-120px", "0s"], ["170px", "-140px", ".05s"], ["-220px", "40px", ".1s"], ["230px", "70px", ".02s"],
  ["-90px", "170px", ".12s"], ["110px", "180px", ".08s"], ["-40px", "-200px", ".15s"], ["60px", "-190px", ".04s"],
  ["-260px", "-30px", ".09s"], ["270px", "-20px", ".13s"], ["-150px", "150px", ".06s"], ["160px", "120px", ".11s"],
];

type Mode = "video" | "frames" | "photos";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const vis = (p: number, [a, b, c, d]: R) => (p < a || p > d ? 0 : p < b ? (p - a) / (b - a) : p > c ? 1 - (p - c) / (d - c) : 1);
const ease = (x: number) => 1 - Math.pow(1 - x, 2.2);

export default function FilmHero() {
  const { lang } = useLang();
  const tr = t[lang].film;
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photos = useRef<(HTMLImageElement | null)[]>([]);
  const hint = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLButtonElement | null)[]>([]);
  const temp = useRef<HTMLSpanElement>(null);
  const gauge = useRef<HTMLDivElement>(null);
  const heat = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [active, setActive] = useState(-1);

  // Media mode comes from the CRiNTRO Loader: phone → image sequence, desktop → video, otherwise photos.
  useEffect(() => {
    const store = crintro();
    const sync = () => {
      setMode(store.mode === "frames" ? "frames" : store.mode === "video" ? "video" : store.mode === "failed" ? "photos" : null);
      setVideoSrc(store.videoUrl);
    };
    sync();
    return onCrintro(sync);
  }, []);

  useEffect(() => {
    if (!mode) return;
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones skip the per-frame blur on the text layers: blur is the most expensive thing to animate there.
    const lite = window.matchMedia(PHONE_QUERY).matches;
    let target = 0, cur = 0, raf = 0, lastSeek = 0, lastActive = -2, lastTemp = -1, last = performance.now();
    let lastImg: CanvasImageSource | null = null;
    let brandOn = el.hasAttribute("data-brand");
    // Only touch the DOM when a value really changed (saves style recalculation every frame).
    const put = (el: HTMLElement, prop: string, val: string) => {
      const box = el as HTMLElement & { _c?: Record<string, string> };
      box._c ??= {};
      if (box._c[prop] !== val) {
        box._c[prop] = val;
        el.style.setProperty(prop, val);
      }
    };
    const cv = canvas.current;
    const ctx = cv?.getContext("2d") ?? null;

    const fit = () => {
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      lastImg = null;
    };
    fit();
    window.addEventListener("resize", fit);

    const drawFrame = (p: number, count: number) => {
      if (!ctx || !cv || !count) return;
      const want = Math.round(p * (count - 1));
      wantFrame(want);
      const img = nearestFrame(want);
      if (!img || img === lastImg) return;
      lastImg = img;
      const s = Math.max(cv.width / img.width, cv.height / img.height);
      const w = img.width * s, h = img.height * s;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // glide toward the scroll position at the same speed on 60 and 120 Hz screens
      cur += (target - cur) * (reduce ? 1 : 1 - Math.pow(0.9, dt * 60));
      if (Math.abs(target - cur) < 0.00005) cur = target;
      const p = clamp(cur);
      // the film plays until FILM_END, then its last frame stays for the brand reveal
      const fp = Math.min(1, p / FILM_END);

      // the film slowly settles: starts slightly zoomed, ends at rest
      if (media.current) put(media.current, "transform", `scale(${(1.1 - 0.1 * fp).toFixed(4)})`);

      // the grill heats up with the film: 20 °C → 800 °C
      const deg = Math.round(20 + 780 * ease(clamp(fp / 0.95)));
      if (deg !== lastTemp) {
        lastTemp = deg;
        if (temp.current) temp.current.textContent = String(deg);
        if (gauge.current) gauge.current.style.setProperty("--g", String((deg - 20) / 780));
        if (heat.current) heat.current.style.opacity = String(0.15 + 0.85 * ((deg - 20) / 780));
      }

      if (hint.current) {
        const o = +vis(p, HINT).toFixed(3);
        put(hint.current, "opacity", String(o));
        put(hint.current, "visibility", o > 0.01 ? "visible" : "hidden");
      }
      // the brand: on while the film stands still at the end
      const on = p >= REVEAL_AT;
      if (on !== brandOn) {
        brandOn = on;
        if (on) {
          el.setAttribute("data-brand", "");
          el.setAttribute("data-played", "");
        } else el.removeAttribute("data-brand");
      }
      layers.current.forEach((l, i) => {
        if (!l) return;
        const o = +vis(p, CH[i]).toFixed(3);
        put(l, "opacity", String(o));
        put(l, "transform", `translate3d(0, ${((1 - o) * 30).toFixed(1)}px, 0)`);
        if (!lite) put(l, "filter", o < 1 ? `blur(${((1 - o) * 6).toFixed(1)}px)` : "none");
        put(l, "visibility", o > 0.01 ? "visible" : "hidden");
      });
      segs.current.forEach((s, i) => {
        if (!s) return;
        const [a, b] = SPAN[i];
        put(s, "--f", clamp((p - a) / (b - a)).toFixed(3));
      });
      const act = p < START_END ? -1 : p >= REVEAL_AT ? 3 : SPAN.findIndex(([a, b]) => p >= a && p < b);
      if (act !== lastActive) { lastActive = act; setActive(act); }

      if (mode === "video" && video.current) {
        const v = video.current;
        if (v.duration) {
          const want = fp * (v.duration - 0.05);
          if (Math.abs(v.currentTime - want) > 1 / 30 && now - lastSeek > 16) {
            v.currentTime = want;
            lastSeek = now;
          }
        }
      } else if (mode === "frames") {
        drawFrame(fp, crintro().count);
      } else {
        // photo fallback: crossfade between chapter photos with a slow push-in
        photos.current.forEach((img, i) => {
          if (!img) return;
          const a = i / PHOTOS.length, b = (i + 1) / PHOTOS.length;
          const fadeIn = i === 0 ? 1 : clamp((fp - (a - 0.04)) / 0.08);
          const local = clamp((fp - a) / (b - a));
          img.style.opacity = String(fadeIn);
          img.style.transform = `scale(${1.02 + local * 0.12})`;
        });
      }
      raf = requestAnimationFrame(tick);
    };

    // ---- The hold: the first time the brand is reached, the page stands still while the logo lands ----
    type LenisLike = { scrollTo: (y: number, o?: { immediate?: boolean; force?: boolean }) => void };
    const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;
    let held = el.hasAttribute("data-played"), release: (() => void) | null = null, timer = 0;
    const heroY = (q: number) => el.offsetTop + q * (el.offsetHeight - window.innerHeight);
    const hold = () => {
      held = true;
      const y = Math.round(heroY(HOLD_AT));
      const l = lenis();
      if (l) l.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" });
      el.setAttribute("data-holding", "");
      // capture phase: Lenis (listening on window) never sees the wheel while we hold
      const block = (e: Event) => { e.preventDefault(); e.stopImmediatePropagation(); };
      const keys = (e: KeyboardEvent) => { if ([" ", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) block(e); };
      const pin = () => { if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y); };
      const opts = { passive: false, capture: true } as const;
      window.addEventListener("wheel", block, opts);
      window.addEventListener("touchmove", block, opts);
      window.addEventListener("keydown", keys, true);
      window.addEventListener("scroll", pin, true);
      release = () => {
        window.removeEventListener("wheel", block, opts);
        window.removeEventListener("touchmove", block, opts);
        window.removeEventListener("keydown", keys, true);
        window.removeEventListener("scroll", pin, true);
        lenis()?.scrollTo(window.scrollY, { immediate: true, force: true });
        el.removeAttribute("data-holding");
        release = null;
      };
      timer = window.setTimeout(() => release?.(), HOLD_MS);
    };
    // A menu jump (anchor link or chapter button) glides straight through the hero: no hold then.
    const glide = () => { skipUntil = performance.now() + 2500; };
    let skipUntil = 0;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("a[href^='#'], [data-jump]")) glide();
    };
    document.addEventListener("click", onClick, true);
    el.addEventListener("hero-jump", glide);

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      target = clamp(-r.top / (r.height - window.innerHeight));
      if (!held && !reduce && target >= REVEAL_AT && target < 0.95 && performance.now() > skipUntil) hold();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    // Pointer: the emblem tilts toward the mouse and a hot spot follows it (mouse only)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;
    let mx = 0, my = 0, tx = 0, ty = 0, praf = 0;
    const glow = () => {
      mx += (tx - mx) * 0.12; my += (ty - my) * 0.12;
      put(el, "--mx", mx.toFixed(3)); put(el, "--my", my.toFixed(3));
      praf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.002 ? requestAnimationFrame(glow) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!el.hasAttribute("data-brand")) return;
      tx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
      ty = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
      if (!praf) praf = requestAnimationFrame(glow);
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(praf);
      window.clearTimeout(timer);
      release?.();
      document.removeEventListener("click", onClick, true);
      el.removeEventListener("hero-jump", glide);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", fit);
    };
  }, [mode, videoSrc]);

  const jump = (i: number) => {
    const el = root.current;
    if (!el) return;
    el.dispatchEvent(new Event("hero-jump"));
    const p = i < CH.length ? CH[i][1] + 0.02 : HOLD_AT;
    window.scrollTo({ top: el.offsetTop + p * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section className={styles.film} id="top" ref={root} aria-label="Coal is King">
      <div className={styles.stage}>
        <div className={styles.media} ref={media}>
          {mode === "video" && (
            <video ref={video} className={styles.fill} src={videoSrc ?? undefined} poster={POSTER} muted playsInline preload="auto" />
          )}
          <canvas ref={canvas} className={`${styles.fill} ${styles.canvas}`} hidden={mode !== "frames"} />
          {(mode === "photos" || mode === null) && (
            <div className={styles.fill}>
              {/* only the first photo until we know the film can't load: phones shouldn't download all four */}
              {PHOTOS.slice(0, mode === "photos" ? PHOTOS.length : 1).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} ref={(n) => { photos.current[i] = n; }} className={styles.photo} src={src} alt="" style={{ opacity: i === 0 ? 1 : 0 }} fetchPriority={i === 0 ? "high" : "low"} />
              ))}
            </div>
          )}
        </div>
        <div className={styles.heat} ref={heat} aria-hidden />
        <div className={styles.shade} aria-hidden />
        <EmberField />

        {/* Start: only the film and a hint */}
        <div className={styles.hint} ref={hint} data-crintro-hold aria-hidden>
          <i />
          <span>{tr.scroll}</span>
        </div>

        {tr.chapters.slice(0, CH.length).map((c, i) => (
          <div key={c.n} className={styles.chapter} ref={(n) => { layers.current[i] = n; }}>
            <span className={styles.num} aria-hidden>{c.n}</span>
            <p className={styles.kicker}>{c.n} — {c.name}</p>
            <h2 className={styles.h2}>{c.h}</h2>
            <p className={styles.text}>{c.p}</p>
          </div>
        ))}

        {/* Final: the film stands still, the emblem lands, the brand rises beside it */}
        <div className={styles.brandShade} aria-hidden />
        <div className={styles.brand}>
          <div className={styles.emblemWrap}>
            <div className={styles.emblem}>
              <span className={styles.sparks} aria-hidden>
                {SPARKS.map((d, n) => (
                  <i key={n} style={{ ["--x" as string]: d[0], ["--y" as string]: d[1], ["--dl" as string]: d[2] }} />
                ))}
              </span>
              <div className={styles.emblemTilt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.webp" alt="Coal is King" className={styles.emblemImg} width={813} height={794} decoding="async" />
                <span className={styles.spot} aria-hidden />
                <span className={styles.gloss} aria-hidden />
              </div>
            </div>
          </div>
          <div className={styles.brandText}>
            <p className={styles.bEye}><i />{tr.brand.eyebrow}<i /></p>
            <h1 className={styles.bName}>
              <span>Coal is</span>
              <span className={styles.bKing}>King</span>
            </h1>
            <p className={styles.bSub}>{tr.brand.sub}</p>
            <p className={styles.bLead}>{tr.lead}</p>
            <div className={`${styles.ctas} ${styles.bCtas}`}>
              <a href="#kontakt" className={styles.btnFlame}>{tr.cta2}</a>
              <a href="#meny" className={styles.btnLine}>{tr.cta1}</a>
            </div>
            <p className={styles.bStatus}><i />{tr.brand.status}</p>
          </div>
        </div>

        <div className={styles.thermo} aria-label={tr.temp}>
          <span className={styles.thermoLbl}>{tr.temp}</span>
          <span className={styles.thermoVal}><span ref={temp}>20</span>°C</span>
          <div className={styles.gauge} ref={gauge}><i /></div>
        </div>

        <nav className={styles.nav} aria-label={lang === "sv" ? "Kapitel" : "Chapters"}>
          {tr.chapters.map((c, i) => (
            <button key={c.n} className={active === i ? styles.on : ""} onClick={() => jump(i)} data-jump ref={(n) => { segs.current[i] = n; }}>
              <span className={styles.seg}><i /></span>
              <span className={styles.lbl}><b>{c.n}</b> {c.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
