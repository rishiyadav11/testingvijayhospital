"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

interface Review {
  id: string;
  patientName: string;
  photoUrl?: string | null;
  recoveryType: string;
  rating: number;
  text: string;
  visitDate?: Date | string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string | null }) {
  if (photoUrl) {
    return (
      <div className="w-11 h-11 rounded-full overflow-hidden relative ring-2 ring-primary/20 flex-shrink-0">
        <Image alt={name} fill sizes="44px" className="object-cover" src={photoUrl} />
      </div>
    );
  }
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["bg-emerald-100 text-emerald-700", "bg-blue-100 text-blue-700", "bg-violet-100 text-violet-700", "bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-primary/10 flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

export default function Testimonials({ reviews = [] }: { reviews?: Review[] }) {
  if (reviews.length === 0) {
    return (
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          No testimonials published yet.
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20 sm:py-32 bg-slate-50 border-t border-slate-100" id="testimonials">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
            Patient Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            What Our Patients <span className="text-primary">Say About Us</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Real stories of healing, recovery, and compassionate care from the people who trust Vijay Hospital.
          </p>
        </div>

        {/* Masonry Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-0">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="break-inside-avoid mb-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col gap-4 group"
            >
              {/* Top: badge + stars */}
              <div className="flex items-center justify-between">
                <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-primary/15">
                  {rev.recoveryType}
                </span>
                <StarRating rating={rev.rating} />
              </div>

              {/* Quote icon + text */}
              <div className="relative pl-5">
                <Quote className="w-6 h-6 text-slate-100 absolute top-0 left-0 -z-0 transform -scale-x-100" />
                <p className="relative z-10 text-xs sm:text-sm text-slate-600 leading-relaxed font-body italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Patient info footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <Avatar name={rev.patientName} photoUrl={rev.photoUrl} />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors truncate">{rev.patientName}</p>
                  {rev.visitDate && (
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(rev.visitDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Write Review CTA */}
        <div className="text-center mt-12">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJje1eI9-1EjkRsajxHA-z-UY"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-black hover:bg-primary/95 px-8 py-3.5 rounded-full font-bold transition-all duration-200 inline-flex items-center gap-2.5 shadow-lg shadow-primary/20 hover:scale-[1.03] text-sm cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.237-2.798-6.237-6.237s2.797-6.237 6.237-6.237c1.554 0 2.946.574 4.02 1.517l3.111-3.111C18.966 2.213 15.858 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c6.319 0 10.9-4.446 10.9-11.24 0-.768-.069-1.354-.154-1.954H12.24z" />
            </svg>
            Write a Google Review
          </a>
        </div>
      </div>
    </section>
  );
}
