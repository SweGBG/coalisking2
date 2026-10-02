"use client";
import { useEffect } from "react";

/**
 * Global reveal-observer — kör varje element EN gång, sen släpps det helt.
 *
 * Princip:
 *  - varje element animeras in en gång och markeras `reveal-done` (statiskt, ingen
 *    transition/will-change kvar). Inget element bevakas eller rör sig efter det.
 *  - will-change sätts BARA medan elementet animerar, annars ligger varje kort i
 *    ett eget GPU-lager permanent → mobil får slut på lager-budget och renderar
 *    kort som tomma. Det var huvudorsaken till att menyn försvann på mobil.
 *  - element som redan är i vyn (t.ex. nya kort efter filterbyte) visas synkront,
 *    annars fastnar de osynliga (observern fyrar bara på element som GÅR IN i vyn).
 */
export default function ScrollFadeIn() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SEL = ".fade-in, [data-reveal], .ember-sheen";

    const isDone = (el: HTMLElement) =>
      el.classList.contains("reveal-done");

    // markera färdigt: ta bort animations-state så elementet blir statiskt
    const finish = (el: HTMLElement) => {
      el.classList.remove("is-animating");
      el.classList.add("reveal-done");
    };

    const reveal = (el: HTMLElement) => {
      if (isDone(el) || el.classList.contains("is-visible")) {
        finish(el);
        return;
      }
      el.classList.add("is-animating");
      el.classList.add("visible", "is-visible");
      // släpp will-change/transition när in-animationen är klar (en gång)
      const cleanup = () => {
        finish(el);
        el.removeEventListener("transitionend", cleanup);
      };
      el.addEventListener("transitionend", cleanup);
      // backup ifall transitionend inte fyrar (delay + duration + marginal)
      window.setTimeout(cleanup, 1300);
    };

    if (reduce) {
      document.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
        el.classList.add("visible", "is-visible", "reveal-done");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          reveal(el);
          obs.unobserve(el); // EN gång — sen aldrig mer
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
    );

    // visa direkt det som redan är i/ovanför vyn, observera resten för scroll
    const scan = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
        if (isDone(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.96 && r.bottom > 0) {
          reveal(el);
          io.unobserve(el);
        } else {
          io.observe(el);
        }
      });
    };

    scan();

    // Nya noder (språkbyte, menyfilter): scanna en gång, inte en evig loop.
    // Begränsa till sektionerna där reveal-element faktiskt byts ut.
    let moScheduled = false;
    const mo = new MutationObserver(() => {
      if (moScheduled) return;
      moScheduled = true;
      // samla flera mutationer till en enda scan per frame
      requestAnimationFrame(() => {
        moScheduled = false;
        scan();
      });
    });
    const roots = document.querySelectorAll<HTMLElement>("#meny, main, body");
    const moTarget = roots[0] ?? document.body;
    mo.observe(moTarget, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
