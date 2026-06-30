"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { t, Lang, Translations } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  toggle: () => {},
  tr: t.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("vh_lang") as Lang | null;
    if (saved === "hi" || saved === "en") setLang(saved);
  }, []);

  const toggle = () => {
    setLang(prev => {
      const next = prev === "en" ? "hi" : "en";
      localStorage.setItem("vh_lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
