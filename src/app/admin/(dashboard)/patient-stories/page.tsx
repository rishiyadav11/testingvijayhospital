'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { Trash2, Edit, Plus, Heart, Star, Calendar, Clock, User, Quote, Loader2 } from 'lucide-react';

interface PatientStory {
  id: string;
  patientName: string;
  age: number;
  specialty: string;
  condition: string;
  story: string;
  rating: number;
  recoveryTime: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
}

function PatientStoriesAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [stories, setStories] = useState<PatientStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  const fetchStories = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }

    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '9' });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/patient-stories?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStories(data.data);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, router]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const token = localStorage.getItem('admin_token');
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/patient-stories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: `"${name}" was removed.` });
        fetchStories();
      } else {
        toast({ title: 'Error', description: data.error, type: "error" });
      }
    } finally {
      setDeleting(null);
    }
  };

  const toggleFeatured = async (story: PatientStory) => {
    setTogglingFeatured(story.id);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/admin/patient-stories/${story.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !story.featured }),
      });
      const data = await res.json();
      if (data.success) {
        setStories(prev => prev.map(s => s.id === story.id ? { ...s, featured: !s.featured } : s));
        toast({ title: 'Updated', description: 'Story featured status updated.' });
      }
    } finally {
      setTogglingFeatured(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Stories</h1>
          <p className="text-sm text-slate-500 mt-1">{total} total stories</p>
        </div>
        <Link href="/admin/patient-stories/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Plus className="w-4 h-4" /> Add Story
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search by patient name…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="text-slate-600 mt-2">Loading stories...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No patient stories found</p>
          <Link href="/admin/patient-stories/new">
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Add First Story</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => {
              const initials = story.patientName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const gradients = [
                'from-rose-400 to-pink-500',
                'from-emerald-400 to-teal-500',
                'from-blue-400 to-indigo-500',
                'from-amber-400 to-orange-500',
                'from-violet-400 to-purple-500',
              ];
              const gradient = gradients[story.patientName.length % gradients.length];

              return (
                <div
                  key={story.id}
                  className="group bg-white rounded-3xl border border-slate-100 hover:border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    {/* Top Patient Meta Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                            {story.patientName}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold">Age {story.age}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 uppercase tracking-wide">
                        {story.specialty}
                      </span>
                    </div>

                    {/* Middle Section: Condition, Rating, Quote */}
                    <div className="space-y-2 flex-grow flex flex-col justify-start mt-2">
                      <div className="flex items-center justify-between text-xs border-y border-slate-100 py-1.5 my-1">
                        <div className="text-[10px] text-slate-500 font-medium">
                          Condition: <strong className="text-slate-800">{story.condition}</strong>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Recovery: <strong className="text-slate-800">{story.recoveryTime}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < story.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="relative mt-2 flex-grow">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-100/80 -z-0 pointer-events-none transform -scale-x-100" />
                        <p className="relative z-10 text-xs text-slate-600 italic leading-relaxed font-medium font-body line-clamp-4 hover:line-clamp-none transition-all duration-300 cursor-pointer pt-1" title="Click to expand story text">
                          "{story.story}"
                        </p>
                      </div>
                    </div>

                    {/* Quick Toggles */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                      <button
                        onClick={() => toggleFeatured(story)}
                        disabled={togglingFeatured === story.id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-200 shadow-sm ${
                          story.featured
                            ? 'bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100'
                        }`}
                        title="Toggle Featured"
                      >
                        {togglingFeatured === story.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                        ) : (
                          <Star className={`w-3.5 h-3.5 ${story.featured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                        )}
                        {story.featured ? 'Featured' : 'Standard'}
                      </button>

                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border ${
                        story.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                          : 'bg-slate-50 text-slate-600 border-slate-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${story.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {story.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex gap-2">
                    <Link href={`/admin/patient-stories/${story.id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200 hover:border-blue-300 transition-colors h-9"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(story.id, story.patientName)}
                      disabled={deleting === story.id}
                      className="flex items-center justify-center gap-1 bg-white text-red-600 hover:text-red-700 border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors h-9 px-3"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting === story.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-6 py-4 mt-6">
            <p className="text-xs text-slate-500 font-medium">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</Button>
              <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function PatientStoriesAdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-600">Loading patient stories...</div>}>
      <PatientStoriesAdminContent />
    </Suspense>
  );
}
