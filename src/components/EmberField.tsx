"use client";
import { useEffect, useRef } from "react";

/**
 * EmberField — stigande glödpartiklar över hero.
 * - Respekterar prefers-reduced-motion (renderar ingenting).
 * - Pausar när fliken är dold eller hero är utanför vyn (IntersectionObserver).
 * - Capped devicePixelRatio + få partiklar → billig på mobil.
 */
export default function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const COUNT = isMobile ? 22 : 42;

    type P = { x:number; y:number; r:number; vy:number; vx:number; life:number; max:number; hue:number };
    const parts: P[] = [];
    const spawn = (init = false): P => ({
      x: Math.random() * w,
      y: init ? Math.random() * h : h + 10,
      r: 0.8 + Math.random() * 2.2,
      vy: 0.25 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.3,
      life: 0,
      max: 240 + Math.random() * 240,
      hue: 8 + Math.random() * 26, // röd → orange
    });
    for (let i = 0; i < COUNT; i++) parts.push(spawn(true));

    // Pre-rendered glow sprites (one per hue band): drawing an image is far cheaper than
    // building a new radial gradient for every particle on every frame.
    const SPR = 64;
    const sprites = [8, 14, 20, 26, 32].map((hue) => {
      const c = document.createElement("canvas");
      c.width = c.height = SPR;
      const g2 = c.getContext("2d")!;
      const g = g2.createRadialGradient(SPR / 2, SPR / 2, 0, SPR / 2, SPR / 2, SPR / 2);
      g.addColorStop(0, `hsla(${hue}, 95%, 62%, 1)`);
      g.addColorStop(0.5, `hsla(${hue}, 90%, 48%, .35)`);
      g.addColorStop(1, "hsla(10, 90%, 40%, 0)");
      g2.fillStyle = g;
      g2.fillRect(0, 0, SPR, SPR);
      return c;
    });

    let raf = 0;
    let running = true;
    let t = 0;
    let last = performance.now();

    const tick = (now: number = performance.now()) => {
      if (!running) return;
      // time-based, so embers rise at the same speed on 60 and 120 Hz screens
      const f = Math.min(3, (now - last) / (1000 / 60));
      last = now;
      t += f;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life += f;
        p.y -= p.vy * f;
        p.x += (p.vx + Math.sin((t + i * 37) * 0.01) * 0.18) * f;
        if (p.life >= p.max || p.y < -10) { parts[i] = spawn(); continue; }
        const fade = Math.sin(Math.min(p.life / p.max, 1) * Math.PI); // in → ut
        const r = p.r * 3.2;
        ctx.globalAlpha = fade * 0.75;
        ctx.drawImage(sprites[Math.min(4, Math.floor((p.hue - 8) / 6))], p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
