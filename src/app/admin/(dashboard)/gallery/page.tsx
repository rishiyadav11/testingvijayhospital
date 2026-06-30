'use client';

import { Suspense, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import {
  Plus, Trash2, Pencil, Images, Image as ImageIcon,
  Video, ChevronLeft, ChevronRight, RefreshCw, Eye, EyeOff,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  mediaUrl: string;
  altText?: string | null;
  category: string;
  order: number;
  status: string;
  createdAt: string;
}

const CATEGORIES = ['All', 'Infrastructure', 'Doctors', 'Events', 'Patient Care', 'Awards', 'Other'];

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { Authorization: `Bearer ${token}` };
}

function GalleryContent() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '18' });
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/gallery?${params}`, { headers: authHeaders() });
      if (!res.ok) return;
      const result = await res.json();
      if (result.success) {
        let data: GalleryItem[] = result.data;
        if (search) {
          const q = search.toLowerCase();
          data = data.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
        }
        setItems(data);
        setTotalPages(result.pagination.pages || 1);
        setTotal(result.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, statusFilter, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, { method: 'DELETE', headers: authHeaders() });
      const result = await res.json();
      if (result.success) {
        setItems(prev => prev.filter(i => i.id !== item.id));
        setTotal(t => t - 1);
        toast({ title: 'Deleted', description: `"${item.title}" removed.` });
      } else {
        toast({ title: 'Error', description: result.error, type: 'error' });
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (item: GalleryItem) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const res = await fetch(`/api/admin/gallery/${item.id}`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const result = await res.json();
    if (result.success) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
    }
  };

  const publishedCount = items.filter(i => i.status === 'PUBLISHED').length;
  const draftCount = items.filter(i => i.status === 'DRAFT').length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage hospital photos and media</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Items', value: total, icon: <Images className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50 border-blue-100' },
          { label: 'Published', value: publishedCount, icon: <Eye className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Drafts', value: draftCount, icon: <EyeOff className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 border-amber-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 flex items-center gap-4 ${s.bg}`}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategoryFilter(cat); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100 hover:text-slate-800'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        {/* Search + status */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="Search by title or category…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none">
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchItems} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading gallery…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Images className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No gallery items yet</p>
          <p className="text-slate-400 text-sm mb-4">Add your first photo or video</p>
          <Link href="/admin/gallery/new">
            <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Item</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {items.map(item => (
              <div key={item.id} className="group relative bg-white rounded-2xl border border-slate-100/80 hover:border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden flex-shrink-0">
                  {item.type === 'VIDEO' ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img src={item.mediaUrl} alt={item.altText || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                  )}
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100">
                    <Link href={`/admin/gallery/${item.id}`}
                      className="w-9 h-9 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md text-slate-700 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                      title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleToggleStatus(item)}
                      className="w-9 h-9 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md text-slate-700 hover:text-emerald-600 transition-all duration-200 hover:scale-110"
                      title={item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}>
                      {item.status === 'PUBLISHED'
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(item)} disabled={deleting === item.id}
                      className="w-9 h-9 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110 disabled:opacity-40"
                      title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-md border ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                        : 'bg-slate-50 text-slate-600 border-slate-200/50'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${item.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {item.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                  {/* Type badge */}
                  <div className="absolute top-3 right-3">
                    {item.type === 'VIDEO' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-md border bg-blue-50 text-blue-700 border-blue-200/50">
                        <Video className="w-2.5 h-2.5" /> VID
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-md border bg-indigo-50 text-indigo-700 border-indigo-200/50">
                        <ImageIcon className="w-2.5 h-2.5" /> IMG
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5 border-t border-slate-50 flex flex-col justify-between flex-grow bg-slate-50/20">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1" title={item.title}>
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-6 py-4">
              <p className="text-xs text-slate-500">
                Showing {(page - 1) * 18 + 1}–{Math.min(page * 18, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 1} className="gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </Button>
                <span className="text-xs text-slate-600 font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="gap-1">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading…</div>}>
      <GalleryContent />
    </Suspense>
  );
}
