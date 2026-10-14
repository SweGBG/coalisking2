"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth, weighted scrolling (Lenis) on desktop. Off on touch devices (native momentum is
 * better there) and for reduced motion. Anchor links glide too, and the page stops
 * scrolling while a menu or lightbox locks the body.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const lenis = new Lenis({ duration: 1.25, easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)), anchors: { offset: -64 } });
    let raf = requestAnimationFrame(function loop(time) { lenis.raf(time); raf = requestAnimationFrame(loop); });
    const lock = new MutationObserver(() => (document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start()));
    lock.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    document.documentElement.classList.add("lenis-on");
    return () => { cancelAnimationFrame(raf); lock.disconnect(); lenis.destroy(); document.documentElement.classList.remove("lenis-on"); };
  }, []);
  return null;
}
