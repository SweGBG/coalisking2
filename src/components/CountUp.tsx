"use client";
import { useEffect, useRef, useState } from "react";

/**
 * CountUp — räknar upp den inledande siffran i en sträng ("800°C" → 0→800°C)
 * när elementet scrollas in. Körs en gång. Reduced-motion → visa direkt.
 */
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const m = value.match(/^(\d+)(.*)$/);
    if (!m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(value);
      return;
    }
    const target = parseInt(m[1], 10);
    const suffix = m[2];
    setText(`0${suffix}`);

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setText(`${Math.round(target * eased)}${suffix}`);
        if (p < 1) requestAnimationFrame(tick);
        else setText(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{text}</span>;
}
