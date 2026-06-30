'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Plus, Eye, Search, BookOpen, Clock, User, Loader2, RefreshCw, Calendar } from 'lucide-react';
import type { Blog } from '@prisma/client';

const CATEGORY_ICONS: Record<string, string> = {
  Cardiology: '❤️', Orthopedics: '🦴', Neurology: '🧠', Pediatrics: '👶',
  Maternity: '🤱', Emergency: '🚑', 'General Wellness': '🌿', 'Mental Wellness': '🧘',
  Pulmonology: '💨', Geriatrics: '👴', Endocrinology: '🩺', Dermatology: '🌸',
  Ophthalmology: '👁️', ENT: '👂', Nutrition: '🥗', 'Health Tips': '💊',
};

function fmtDate(d: string | Date | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function token() {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') ?? '' : '';
}

function BlogsListContent() {
  const [blogs, setBlogs]         = useState<Blog[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [toggling, setToggling]   = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: page.toString(), limit: '12' });
      if (statusFilter) p.append('status', statusFilter);
      const res = await fetch(`/api/admin/blogs?${p}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data ?? []);
        setTotalPages(data.pagination?.pages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setBlogs(prev => prev.filter(b => b.id !== id));
      setTotal(t => t - 1);
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (blog: Blog) => {
    setToggling(blog.id);
    const newStatus = blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : null }),
      });
      setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, status: newStatus as Blog['status'] } : b));
    } finally {
      setToggling(null);
    }
  };

  const filtered = blogs.filter(b =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const published = blogs.filter(b => b.status === 'PUBLISHED').length;
  const drafts    = blogs.filter(b => b.status === 'DRAFT').length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} articles · {published} published · {drafts} drafts</p>
        </div>
        <Link href="/admin/blogs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Blog Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search title, category, author…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" />
        </div>
        <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50 focus:bg-white text-slate-700 font-medium">
          <option value="">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
        <button onClick={fetchBlogs}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading blogs…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto" />
          <p className="text-slate-500 font-medium">No blog posts found</p>
          <Link href="/admin/blogs/new"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            <Plus className="w-4 h-4" /> Write your first post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(blog => (
            <div key={blog.id} className="group bg-white rounded-3xl border border-slate-100 hover:border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {blog.featuredImageUrl ? (
                  <img src={blog.featuredImageUrl} alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-6xl opacity-40">
                    {CATEGORY_ICONS[blog.category] ?? '📝'}
                  </span>
                )}

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-md border ${
                    blog.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      : 'bg-amber-50 text-amber-700 border-amber-200/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${
                      blog.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    {blog.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                  </span>
                </div>

                {/* Quick view on hover */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                  <Link href={`/blogs/${blog.slug ?? blog.id}`} target="_blank"
                    className="w-10 h-10 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md text-slate-700 hover:text-emerald-600 hover:scale-110 transition-all duration-200"
                    title="View Live">
                    <Eye className="w-4.5 h-4.5" />
                  </Link>
                  <Link href={`/admin/blogs/${blog.id}`}
                    className="w-10 h-10 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md text-slate-700 hover:text-blue-600 hover:scale-110 transition-all duration-200"
                    title="Edit Post">
                    <Edit className="w-4.5 h-4.5" />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 mb-2 uppercase tracking-wide">
                    {CATEGORY_ICONS[blog.category] ?? '📝'} {blog.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-emerald-700 transition-colors flex-grow">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{blog.excerpt}</p>
                )}

                <div className="mt-auto space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" />{blog.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" />{blog.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    <span>{blog.status === 'PUBLISHED' ? `Published ${fmtDate(blog.publishedAt)}` : `Updated ${fmtDate(blog.updatedAt)}`}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between gap-2">
                <Link href={`/admin/blogs/${blog.id}`} className="flex-1">
                  <button className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors duration-200">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </Link>
                <button onClick={() => toggleStatus(blog)} disabled={toggling === blog.id}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-200 ${
                    blog.status === 'PUBLISHED'
                      ? 'border-amber-200 bg-white hover:bg-amber-50 text-amber-700'
                      : 'border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700'
                  }`}>
                  {toggling === blog.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : blog.status === 'PUBLISHED' ? (
                    'Draft'
                  ) : (
                    'Publish'
                  )}
                </button>
                <button onClick={() => handleDelete(blog.id, blog.title)} disabled={deleting === blog.id}
                  className="p-1.5 rounded-lg border border-red-100 bg-white hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center justify-center"
                  title="Delete Post">
                  {deleting === blog.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all">
              ← Previous
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    }>
      <BlogsListContent />
    </Suspense>
  );
}
