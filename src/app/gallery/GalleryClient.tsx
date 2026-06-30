"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Images, ChevronLeft, ChevronRight, Video, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  mediaUrl: string;
  altText?: string | null;
  category: string;
  order: number;
}

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightbox, setLightbox] = useState<{ item: GalleryItem; idx: number } | null>(null);

  const categories = ["All", ...Array.from(new Set(initialItems.map((i) => i.category)))];

  const filtered =
    selectedCategory === "All"
      ? initialItems
      : initialItems.filter((i) => i.category === selectedCategory);

  const openLightbox = (item: GalleryItem, idx: number) => setLightbox({ item, idx });
  const closeLightbox = () => setLightbox(null);

  const goNext = () => {
    if (!lightbox) return;
    const next = (lightbox.idx + 1) % filtered.length;
    setLightbox({ item: filtered[next], idx: next });
  };
  const goPrev = () => {
    if (!lightbox) return;
    const prev = (lightbox.idx - 1 + filtered.length) % filtered.length;
    setLightbox({ item: filtered[prev], idx: prev });
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-20 pb-12 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest">
            <Images className="w-3.5 h-3.5" /> Hospital Gallery
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
            A Glimpse Inside{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Vijay Hospital
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Explore our modern facilities, advanced equipment, and the spaces
            where we care for thousands of patients every year.
          </p>
          <div className="flex flex-wrap justify-center gap-10 pt-4">
            {[
              { value: `${initialItems.length}`, label: "Photos" },
              { value: `${categories.length - 1}`, label: "Categories" },
              { value: "24/7", label: "Open" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({initialItems.filter((i) => i.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── MASONRY GRID ── */}
      <section className="bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-32 space-y-4">
              <Images className="w-16 h-16 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-lg font-medium">No photos yet</p>
              <p className="text-slate-400 text-sm">
                Check back soon or explore another category
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: idx * 0.02 }}
                    className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-slate-100"
                    onClick={() => openLightbox(item, idx)}
                  >
                    {item.type === "VIDEO" ? (
                      <div className="aspect-video bg-slate-100 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center">
                          <Video className="w-6 h-6 text-slate-500" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.altText || item.title}
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}

                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300" />
                    </div>

                    {/* bottom strip */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {item.category}
                      </span>
                      <p className="text-white font-semibold text-sm truncate mt-1.5">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-white/60 text-xs truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
            onClick={closeLightbox}
          >
            {/* top bar */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {lightbox.item.category}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {lightbox.idx + 1} / {filtered.length}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {lightbox.item.title}
                </h3>
                {lightbox.item.description && (
                  <p className="text-slate-400 text-sm mt-0.5">
                    {lightbox.item.description}
                  </p>
                )}
              </div>
              <button
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors ml-4 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* image area */}
            <div
              className="flex-1 flex items-center justify-center px-16 min-h-0 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered.length > 1 && (
                <button
                  onClick={goPrev}
                  className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={lightbox.item.id}
                  src={lightbox.item.mediaUrl}
                  alt={lightbox.item.altText || lightbox.item.title}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  style={{ maxHeight: "calc(100vh - 160px)" }}
                />
              </AnimatePresence>

              {filtered.length > 1 && (
                <button
                  onClick={goNext}
                  className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* thumbnail strip */}
            {filtered.length > 1 && (
              <div
                className="flex gap-2 px-6 py-4 overflow-x-auto scrollbar-none flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {filtered.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setLightbox({ item, idx })}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all ${
                      lightbox.idx === idx
                        ? "ring-2 ring-emerald-400 opacity-100"
                        : "opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
