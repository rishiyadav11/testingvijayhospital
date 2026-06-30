'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, User, ArrowRight, BookOpen } from 'lucide-react';

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  category: string;
  author: string;
  readTime: string;
  date: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  Cardiology:        '❤️',
  Orthopedics:       '🦴',
  Neurology:         '🧠',
  Pediatrics:        '👶',
  Maternity:         '🤱',
  Emergency:         '🚑',
  'General Wellness':'🌿',
  'Mental Wellness': '🧘',
  Pulmonology:       '💨',
  Geriatrics:        '👴',
  Endocrinology:     '🩺',
  Gastroenterology:  '🫁',
  Dermatology:       '🌸',
  Oncology:          '🎗️',
  Ophthalmology:     '👁️',
  ENT:               '👂',
  'Health Tips':     '💊',
  Nutrition:         '🥗',
};

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogsListClient({ blogs }: { blogs: Blog[] }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogs.map(b => b.category))).sort();
    return ['All', ...cats];
  }, [blogs]);

  const filtered = useMemo(() => blogs.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchCat = cat === 'All' || b.category === cat;
    return matchSearch && matchCat;
  }), [blogs, search, cat]);

  if (blogs.length === 0) {
    return (
      <div className="py-24 text-center text-slate-400">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No blog articles published yet.</p>
        <p className="text-sm mt-1">Check back soon for health tips and medical insights.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* Search + Filters */}
      <div className="mb-10 space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles, topics, doctors…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                cat === c
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
              }`}>
              {c !== 'All' && (CATEGORY_ICONS[c] ?? '📄')} {c}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 font-medium">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} {cat !== 'All' ? `in ${cat}` : ''}
        </p>
      </div>

      {/* Featured (first card large) */}
      {filtered.length > 0 && (
        <>
          {/* First card — featured */}
          <Link href={`/blogs/${filtered[0].slug}`} className="group block mb-8">
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl transition-all duration-300 grid md:grid-cols-2">
              <div className="relative h-56 md:h-auto bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center overflow-hidden">
                {filtered[0].featuredImageUrl ? (
                  <img src={filtered[0].featuredImageUrl} alt={filtered[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-8xl opacity-60">{CATEGORY_ICONS[filtered[0].category] ?? '📄'}</span>
                )}
                <span className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Featured
                </span>
              </div>
              <div className="p-8 flex flex-col justify-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  {CATEGORY_ICONS[filtered[0].category]} {filtered[0].category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-slate-500 leading-relaxed line-clamp-3">{filtered[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{filtered[0].author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{filtered[0].readTime}</span>
                  <span>{fmtDate(filtered[0].date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Rest — grid */}
          {filtered.length > 1 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(1).map(blog => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col h-full">
                    {/* Image */}
                    <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {blog.featuredImageUrl ? (
                        <img src={blog.featuredImageUrl} alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-6xl opacity-50">{CATEGORY_ICONS[blog.category] ?? '📄'}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                        {CATEGORY_ICONS[blog.category]} {blog.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 flex-grow leading-relaxed">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[11px] text-slate-400 space-y-0.5">
                          <p className="font-medium text-slate-600">{blog.author}</p>
                          <p className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{blog.readTime} · {fmtDate(blog.date)}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {filtered.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No articles found</p>
          <p className="text-sm mt-1">Try a different search term or category</p>
          <button onClick={() => { setSearch(''); setCat('All'); }}
            className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
