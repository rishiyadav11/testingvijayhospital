'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Sparkles, Loader2, ChevronRight, Check,
  Edit3, Send, RefreshCw, Clock, BookOpen, Zap,
} from 'lucide-react';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';

const SPECIALTIES = [
  { id: 'Cardiology',        label: 'Cardiology',         icon: '❤️'  },
  { id: 'Orthopedics',       label: 'Orthopedics',        icon: '🦴'  },
  { id: 'Neurology',         label: 'Neurology',          icon: '🧠'  },
  { id: 'Pediatrics',        label: 'Pediatrics',         icon: '👶'  },
  { id: 'Maternity',         label: 'Maternity',          icon: '🤱'  },
  { id: 'Emergency',         label: 'Emergency',          icon: '🚑'  },
  { id: 'General Wellness',  label: 'General Wellness',   icon: '🌿'  },
  { id: 'Mental Wellness',   label: 'Mental Wellness',    icon: '🧘'  },
  { id: 'Pulmonology',       label: 'Pulmonology',        icon: '💨'  },
  { id: 'Geriatrics',        label: 'Geriatrics',         icon: '👴'  },
  { id: 'Endocrinology',     label: 'Endocrinology',      icon: '🩺'  },
  { id: 'Dermatology',       label: 'Dermatology',        icon: '🌸'  },
  { id: 'Ophthalmology',     label: 'Ophthalmology',      icon: '👁️' },
  { id: 'ENT',               label: 'ENT',                icon: '👂'  },
  { id: 'Nutrition',         label: 'Nutrition',          icon: '🥗'  },
  { id: 'Health Tips',       label: 'Health Tips',        icon: '💊'  },
];

interface Suggestion { title: string; angle: string; readTime: string }
interface BlogDraft {
  title: string; slug: string; excerpt: string; content: string;
  category: string; keywords: string; readTime: string; author: string;
  seoTitle: string; seoDesc: string; featuredImageUrl: string;
  status: 'DRAFT' | 'PUBLISHED';
}

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : '';
}

// ── STEP INDICATOR ───────────────────────────────────────────────────────────
function Steps({ step }: { step: number }) {
  const steps = ['Pick Specialty', 'Choose Topic', 'Review & Publish'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            step > i + 1 ? 'bg-emerald-100 text-emerald-700' :
            step === i + 1 ? 'bg-emerald-600 text-white shadow-sm' :
            'bg-slate-100 text-slate-400'
          }`}>
            {step > i + 1 ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < 2 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

export default function NewBlogPage() {
  const router = useRouter();
  const [step, setStep]                     = useState(1);
  const [specialty, setSpecialty]           = useState('');
  const [suggestions, setSuggestions]       = useState<Suggestion[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [selectedTopic, setSelectedTopic]   = useState<Suggestion | null>(null);
  const [loadingWrite, setLoadingWrite]     = useState(false);
  const [draft, setDraft]                   = useState<BlogDraft | null>(null);
  const [saving, setSaving]                 = useState(false);
  const [saved, setSaved]                   = useState(false);
  const [error, setError]                   = useState('');

  // ── STEP 1 → fetch suggestions ────────────────────────────────────
  const getSuggestions = async (spec: string) => {
    setSpecialty(spec);
    setLoadingSuggest(true);
    setError('');
    setSuggestions([]);
    try {
      const res = await fetch('/api/admin/ai-blog', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'suggest', specialty: spec }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSuggestions(data.suggestions);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get suggestions');
    } finally {
      setLoadingSuggest(false);
    }
  };

  // ── STEP 2 → write blog ───────────────────────────────────────────
  const writeBlog = async (topic: Suggestion) => {
    setSelectedTopic(topic);
    setLoadingWrite(true);
    setError('');
    try {
      const res = await fetch('/api/admin/ai-blog', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'write', title: topic.title, specialty }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setDraft({ ...data.blog, featuredImageUrl: '', status: 'PUBLISHED' });
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to write blog');
    } finally {
      setLoadingWrite(false);
    }
  };

  // ── STEP 3 → save to DB ───────────────────────────────────────────
  const saveBlog = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!draft) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          status,
          publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Save failed');
      setSaved(true);
      setTimeout(() => router.push('/admin/blogs'), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const upd = (field: keyof BlogDraft, val: string) =>
    setDraft(d => d ? { ...d, [field]: val } : d);

  // ── SAVED STATE ───────────────────────────────────────────────────
  if (saved) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <Check className="w-8 h-8 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Blog Published!</h2>
      <p className="text-slate-500 text-sm">Redirecting to blogs list…</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/blogs"
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-500" /> AI Blog Writer
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Powered by Groq · Llama 3.3 70B</p>
        </div>
      </div>

      <Steps step={step} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          ⚠️ {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* ── STEP 1: Pick specialty ───────────────────────────────── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Pick a Medical Specialty</h2>
          <p className="text-sm text-slate-500 mb-6">
            The AI will suggest 6 relevant, SEO-optimised blog topics for that specialty.
          </p>

          {loadingSuggest ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-500 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-violet-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Generating blog ideas…</p>
                <p className="text-sm text-slate-400 mt-1">Asking Groq AI for the best topics</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SPECIALTIES.map(s => (
                <button key={s.id} onClick={() => getSuggestions(s.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-200 hover:border-violet-400 hover:bg-violet-50 transition-all group text-center">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-violet-700">{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: Choose topic ─────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {SPECIALTIES.find(s => s.id === specialty)?.icon} {specialty} Blog Ideas
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                AI generated 6 topics. Click one to write the full article.
              </p>
            </div>
            <button onClick={() => { setStep(1); setSuggestions([]); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Change Specialty
            </button>
          </div>

          {loadingWrite ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
                <Edit3 className="absolute inset-0 m-auto w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">Writing your blog…</p>
                <p className="text-sm text-slate-400 mt-1">
                  Crafting a complete, SEO-optimised article on:<br />
                  <em className="text-slate-600 not-italic font-medium">"{selectedTopic?.title}"</em>
                </p>
              </div>
              <div className="flex gap-1 mt-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => writeBlog(s)}
                  className="w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-sm font-bold text-slate-500 group-hover:text-emerald-700 flex-shrink-0 transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.angle}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 self-center">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <Clock className="w-3 h-3" />{s.readTime}
                    </span>
                    <Zap className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </button>
              ))}

              <button onClick={() => getSuggestions(specialty)}
                className="w-full mt-2 py-3 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50 transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Regenerate different topics
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: Review & Edit & Publish ──────────────────────── */}
      {step === 3 && draft && (
        <div className="space-y-5">
          {/* AI success banner */}
          <div className="bg-gradient-to-r from-violet-50 to-emerald-50 border border-violet-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-violet-600" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-slate-800">Blog written by AI ✓</p>
              <p className="text-xs text-slate-500">Review and edit anything below, then publish.</p>
            </div>
            <button onClick={() => { setStep(2); setDraft(null); }}
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-all">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">

            {/* Main form */}
            <div className="lg:col-span-2 space-y-5">

              {/* Title + slug */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Basic Info</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Title *</label>
                  <input value={draft.title} onChange={e => upd('title', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Slug</label>
                  <input value={draft.slug} onChange={e => upd('slug', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">
                    Excerpt <span className="text-slate-400 font-normal">({draft.excerpt.length}/160)</span>
                  </label>
                  <textarea value={draft.excerpt} onChange={e => upd('excerpt', e.target.value)} rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none" />
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Content (Markdown)
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">{draft.content.length} chars</span>
                </div>
                <textarea value={draft.content} onChange={e => upd('content', e.target.value)} rows={20}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-y bg-slate-50 focus:bg-white" />
              </div>

              {/* SEO */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">SEO</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">
                    SEO Title <span className="text-slate-400 font-normal">({draft.seoTitle?.length ?? 0}/60)</span>
                  </label>
                  <input value={draft.seoTitle ?? ''} onChange={e => upd('seoTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">
                    SEO Description <span className="text-slate-400 font-normal">({draft.seoDesc?.length ?? 0}/155)</span>
                  </label>
                  <textarea value={draft.seoDesc ?? ''} onChange={e => upd('seoDesc', e.target.value)} rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Keywords</label>
                  <input value={draft.keywords} onChange={e => upd('keywords', e.target.value)}
                    placeholder="comma-separated"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Publish actions */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-700">Publish</h3>
                {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">⚠ {error}</p>}
                <button onClick={() => saveBlog('PUBLISHED')} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {saving ? 'Publishing…' : 'Publish Live'}
                </button>
                <button onClick={() => saveBlog('DRAFT')} disabled={saving}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60">
                  Save as Draft
                </button>
              </div>

              {/* Meta */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Details</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Category</label>
                  <select value={draft.category} onChange={e => upd('category', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white">
                    {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Author</label>
                  <input value={draft.author} onChange={e => upd('author', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">Read Time</label>
                  <input value={draft.readTime} onChange={e => upd('readTime', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                </div>
              </div>

              {/* Featured image */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Featured Image</h3>
                {draft.featuredImageUrl && (
                  <img src={draft.featuredImageUrl} alt="featured"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                )}
                <CloudinaryUpload
                  folder="vijay-hospital/blogs"
                  onUploadSuccess={url => upd('featuredImageUrl', url)}
                  onUploadError={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
