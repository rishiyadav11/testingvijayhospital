'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, Share2, Copy, Check, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  Cardiology: '❤️', Orthopedics: '🦴', Neurology: '🧠', Pediatrics: '👶',
  Maternity: '🤱', Emergency: '🚑', 'General Wellness': '🌿', 'Mental Wellness': '🧘',
  Pulmonology: '💨', Geriatrics: '👴', Endocrinology: '🩺', Dermatology: '🌸',
  Ophthalmology: '👁️', ENT: '👂', Nutrition: '🥗', 'Health Tips': '💊',
  Oncology: '🎗️', Gastroenterology: '🫁', Women: '🌸',
};

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string | null;
  category: string;
  author: string;
  readTime: string;
  date: string;
  keywords?: string;
}

interface RelatedBlog {
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

// Minimal markdown → HTML renderer
function parseMarkdown(md: string): string {
  let html = md.trim();
  // h1, h2, h3
  html = html.replace(/^### (.+)$/gm, '<h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">$1</h3>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">$1</h2>');
  // bold + italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  // numbered + bullet lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="mb-1.5">$1</li>');
  html = html.replace(/^[-•] (.+)$/gm, '<li class="mb-1.5">$1</li>');
  // wrap consecutive <li> blocks
  html = html.replace(/(<li[\s\S]*?<\/li>)(\s*<li[\s\S]*?<\/li>)*/g, m =>
    `<ul class="list-disc list-inside space-y-1 mb-4 text-slate-700 leading-relaxed pl-2">${m}</ul>`
  );
  // paragraphs — split on blank lines
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    const t = block.trim();
    if (!t) return '';
    if (/^<(h[1-6]|ul|ol|li|blockquote)/.test(t)) return t;
    return `<p class="mb-4 leading-relaxed text-slate-700">${t.replace(/\n/g, ' ')}</p>`;
  }).join('\n');
  return html;
}

export default function BlogDetailClient({ blog, relatedBlogs }: { blog: Blog; relatedBlogs: RelatedBlog[] }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const icon = CATEGORY_ICONS[blog.category] ?? '📝';

  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        {/* BG image */}
        {blog.featuredImageUrl && (
          <img src={blog.featuredImageUrl} alt="" aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-20">
          <Link href="/blogs"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Link>
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest border border-white/20">
              {icon} {blog.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">{blog.excerpt}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{blog.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmtDate(blog.date)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{blog.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured image (if exists, show below hero) */}
      {blog.featuredImageUrl && (
        <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10 mb-4">
          <img src={blog.featuredImageUrl} alt={blog.title}
            className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl border border-white" />
        </div>
      )}

      {/* Content layout */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">

        {/* Article body */}
        <article className="lg:col-span-2">
          <div
            className="prose-custom text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.content) }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Share this article</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => share('whatsapp')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-semibold">
                💬 WhatsApp
              </button>
              <button onClick={() => share('facebook')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-semibold">
                Facebook
              </button>
              <button onClick={() => share('twitter')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-sm font-semibold">
                𝕏 Twitter
              </button>
              <button onClick={() => share('linkedin')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors text-sm font-semibold">
                LinkedIn
              </button>
              <button onClick={copyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  copied ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
              </button>
            </div>
          </div>

          {/* Author bio */}
          <div className="mt-10 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-2xl flex-shrink-0">
              👨‍⚕️
            </div>
            <div>
              <p className="font-bold text-slate-900">{blog.author}</p>
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-2">{blog.category} Specialist · Vijay Hospital</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                A qualified medical professional at Vijay Hospital with expertise in {blog.category.toLowerCase()}.
                Committed to patient care and evidence-based health education.
              </p>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">

            {/* Book appointment CTA */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white text-center space-y-3">
              <div className="text-3xl">🏥</div>
              <h3 className="font-bold text-lg">Need Expert Advice?</h3>
              <p className="text-emerald-100 text-sm">Book a consultation with our {blog.category} specialists.</p>
              <Link href="/book-appointment"
                className="block w-full py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-colors">
                Book Appointment
              </Link>
              <a href="tel:+919306710615"
                className="block text-emerald-200 text-xs font-medium hover:text-white transition-colors">
                📞 +91 93067 10615
              </a>
            </div>

            {/* Related articles */}
            {relatedBlogs.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Related Articles</h3>
                <div className="space-y-3">
                  {relatedBlogs.map(r => (
                    <Link key={r.id} href={`/blogs/${r.slug}`}
                      className="group flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                        {r.featuredImageUrl
                          ? <img src={r.featuredImageUrl} alt={r.title} className="w-full h-full object-cover" />
                          : <span className="text-2xl">{CATEGORY_ICONS[r.category] ?? '📝'}</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">{r.category}</p>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{r.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/blogs"
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  View all articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-slate-100 bg-slate-50 py-14 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">More Health Articles</h2>
          <p className="text-slate-500 text-sm">Explore expert tips and medical guides from our specialist doctors.</p>
          <Link href="/blogs"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
            Browse All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
