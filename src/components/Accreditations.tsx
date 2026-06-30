"use client";

import React from "react";

export default function Accreditations() {
  const items = [
    {
      title: "NABH Accredited",
      subtitle: "Patient Safety & Care Quality",
      img: "/logo_nabh.png",
    },
    {
      title: "PM-JAY Empanelled",
      subtitle: "Ayushman Bharat Scheme",
      img: "/logo_pmjay.png",
    },
    {
      title: "ISO 14001 Certified",
      subtitle: "Environmental Management",
      img: "/logo_iso.png",
    },
    {
      title: "NABL Compliance",
      subtitle: "Standardized Diagnostics",
      img: "/logo_nabl.png",
    },
  ];

  // Duplicate the array to allow for seamless infinite scrolling
  const scrollItems = [...items, ...items, ...items, ...items];

  return (
    <section className="py-10 bg-surface-container-low/20 border-y border-outline-variant/20 overflow-hidden relative" id="accreditations">
      {/* Soft gradient masks for the scrolling edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6">
        {/* Label on the left for context */}
        <div className="flex-shrink-0 text-center md:text-left space-y-1">
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest">
            Accredited Standards
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-primary leading-tight">
            Our Certifications
          </h2>
        </div>

        {/* Marquee Track */}
        <div className="w-full overflow-hidden py-2">
          <div className="animate-marquee flex items-center gap-6">
            {scrollItems.map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-outline-variant/30 shadow-sm flex-shrink-0 hover:border-primary/20 transition-all select-none hover:shadow-md"
              >
                <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
                  <img
                    alt={item.title}
                    src={item.img}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-primary font-display text-sm leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[9px] font-bold text-on-surface-variant/70 uppercase tracking-widest leading-none mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
