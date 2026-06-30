"use client";

import React from "react";
import { getHeroSection } from "@/lib/page-contexts";

interface PageHeroProps {
  pageName: string;
  customHeading?: string;
  customSubheading?: string;
}

export default function PageHero({
  pageName,
  customHeading,
  customSubheading,
}: PageHeroProps) {
  const heroSection = getHeroSection(pageName);

  if (!heroSection) return null;

  const heading = customHeading || heroSection.heading;
  const subheading = customSubheading || heroSection.subheading;

  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20 md:py-32 space-y-8">
        <div className="text-6xl md:text-7xl mb-6 animate-bounce">{heroSection.image}</div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          {heading}
        </h1>

        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
          {subheading}
        </p>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-12 h-1 bg-gradient-to-l from-emerald-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
