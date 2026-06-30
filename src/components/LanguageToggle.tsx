"use client";

import React, { useState } from "react";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
          language === "en"
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
          language === "hi"
            ? "bg-primary text-white"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
        title="Hindi"
      >
        HI
      </button>
    </div>
  );
}
