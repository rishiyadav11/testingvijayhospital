"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// A global language switcher for pages that don't render the Navbar.
// It hides itself when a navbar-level toggle is already on the page,
// so main pages don't show two controls.
export default function FloatingLangToggle() {
  const { lang, toggle } = useLanguage();
  const pathname = usePathname();
  const [hasNavbarToggle, setHasNavbarToggle] = useState(true);

  useEffect(() => {
    const check = () =>
      setHasNavbarToggle(
        !!document.querySelector('[data-lang-toggle="navbar"]')
      );
    check();
    const t = setTimeout(check, 300);
    return () => clearTimeout(t);
  }, [pathname]);

  if (hasNavbarToggle) return null;

  return (
    <div
      data-no-translate
      className="fixed bottom-5 left-5 z-50 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 px-2 py-1.5"
    >
      <Languages size={16} className="text-primary ml-1" />
      <div className="flex items-center rounded-full overflow-hidden text-xs font-semibold">
        <button
          type="button"
          onClick={() => lang !== "en" && toggle()}
          aria-pressed={lang === "en"}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            lang === "en" ? "bg-primary text-black" : "text-slate-500 hover:text-primary"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => lang !== "hi" && toggle()}
          aria-pressed={lang === "hi"}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            lang === "hi" ? "bg-primary text-black" : "text-slate-500 hover:text-primary"
          }`}
        >
          हिं
        </button>
      </div>
    </div>
  );
}
