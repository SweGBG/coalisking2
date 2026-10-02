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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isMobile = window.innerWidth < 768;
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

    let raf = 0;
    let running = true;
    let t = 0;

    const tick = () => {
      if (!running) return;
      t++;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life++;
        p.y -= p.vy;
        p.x += p.vx + Math.sin((t + i * 37) * 0.01) * 0.18;
        const fade = Math.sin(Math.min(p.life / p.max, 1) * Math.PI); // in → ut
        if (p.life >= p.max || p.y < -10) { parts[i] = spawn(); continue; }
        const a = fade * 0.75;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
        g.addColorStop(0, `hsla(${p.hue}, 95%, 62%, ${a})`);
        g.addColorStop(0.5, `hsla(${p.hue}, 90%, 48%, ${a * 0.35})`);
        g.addColorStop(1, "hsla(10, 90%, 40%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
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
