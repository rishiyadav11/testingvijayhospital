"use client";

import React, { useEffect, useState } from "react";
import { HOSPITAL_PHONE } from "@/lib/constants";

export function EmergencyBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-2xl h-[68px] flex items-center">
      <a
        href={`tel:${HOSPITAL_PHONE}`}
        className="flex items-center justify-center gap-3 px-4 w-full hover:bg-red-700 transition-colors duration-200 h-full"
      >
        <svg
          className="w-6 h-6 animate-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
        <div className="text-left">
          <p className="text-sm font-semibold">24/7 Emergency</p>
          <p className="text-lg font-bold">{HOSPITAL_PHONE}</p>
        </div>
      </a>
    </div>
  );
}
