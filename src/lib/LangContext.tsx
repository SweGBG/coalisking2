"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Lang } from "./translations";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<LangCtx>({ lang: "sv", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sv");

  // Läs sparat språkval efter mount (undviker hydration-mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cik-lang");
      if (saved === "sv" || saved === "en") setLangState(saved);
    } catch { /* private mode etc. */ }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("cik-lang", l); } catch { /* noop */ }
  };

  // Håll <html lang> i synk för a11y/SEO
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() { return useContext(LangContext); }
