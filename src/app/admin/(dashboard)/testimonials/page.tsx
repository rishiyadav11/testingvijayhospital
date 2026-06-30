'use client';

import { Suspense, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { Trash2, Edit, Plus, Star, Quote, Calendar } from 'lucide-react';
import type { Testimonial } from '@prisma/client';

interface TestimonialResponse {
  success: boolean;
  data: Testimonial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

function TestimonialsListContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch testimonials when filters or page changes
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('adminToken') || '';
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '9');
        
        if (search) params.append('search', search);
        if (statusFilter) params.append('status', statusFilter);

        const response = await fetch(`/api/admin/testimonials?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }

        const data: TestimonialResponse = await response.json();
        setTestimonials(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        toast({ type: "error", description: message });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [page, search, statusFilter]);

  const handleDelete = useCallback(
    async (id: string, patientName: string) => {
      if (!confirm(`Are you sure you want to delete the testimonial from ${patientName}?`)) {
        return;
      }

      try {
        setDeleting(id);
        const token = localStorage.getItem('adminToken') || '';
        const response = await fetch(`/api/admin/testimonials/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data: DeleteResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete testimonial');
        }

        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        toast({ type: 'success', description: 'Testimonial deleted successfully' });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        toast({ type: "error", description: message });
      } finally {
        setDeleting(null);
      }
    },
    [toast]
  );

  const toggleFeatured = useCallback(
    async (id: string, currentFeatured: boolean) => {
      try {
        const token = localStorage.getItem('adminToken') || '';
        const response = await fetch(`/api/admin/testimonials/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ featured: !currentFeatured }),
        });

        if (!response.ok) {
          throw new Error('Failed to update testimonial');
        }

        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, featured: !currentFeatured } : t))
        );
        toast({ type: 'success', description: 'Testimonial updated successfully' });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        toast({ type: "error", description: message });
      }
    },
    [toast]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Stories</h1>
          <p className="text-slate-600 mt-1">Manage patient success stories and testimonials</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Patient Story
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search by Patient Name
            </label>
            <Input
              type="text"
              placeholder="Search testimonials..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Loading patient stories...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600 mb-4">No patient stories found</p>
          <Link href="/admin/testimonials/new">
            <Button>Create First Patient Story</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => {
              // Get initials for avatar
              const initials = testimonial.patientName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              // Use clean color gradients for initials based on patient name length
              const gradients = [
                'from-teal-400 to-emerald-500',
                'from-blue-400 to-indigo-500',
                'from-rose-400 to-pink-500',
                'from-amber-400 to-orange-500',
                'from-violet-400 to-purple-500',
              ];
              const gradient = gradients[testimonial.patientName.length % gradients.length];

              return (
                <div
                  key={testimonial.id}
                  className="group bg-white rounded-3xl border border-slate-100 hover:border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    {/* Top Row: Patient Info and Department Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {testimonial.photoUrl ? (
                          <img
                            src={testimonial.photoUrl}
                            alt={testimonial.patientName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-slate-50"
                          />
                        ) : (
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                            {initials}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                            {testimonial.patientName}
                          </h3>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-300" />
                            <span>
                              {testimonial.visitDate
                                ? new Date(testimonial.visitDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wide">
                        {testimonial.recoveryType || 'General'}
                      </span>
                    </div>

                    {/* Middle Section: Ratings & Quote */}
                    <div className="space-y-2 flex-grow flex flex-col justify-start mt-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < testimonial.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="relative mt-2 flex-grow">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-100/80 -z-0 pointer-events-none transform -scale-x-100" />
                        <p className="relative z-10 text-xs text-slate-600 italic leading-relaxed font-medium font-body line-clamp-4 hover:line-clamp-none transition-all duration-300 cursor-pointer pt-1" title="Click to expand text">
                          "{testimonial.text}"
                        </p>
                      </div>
                    </div>

                    {/* Quick Toggles Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
                      {/* Status Badges */}
                      <button
                        onClick={() =>
                          toggleFeatured(testimonial.id, testimonial.featured)
                        }
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-200 shadow-sm ${
                          testimonial.featured
                            ? 'bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-3.5 h-3.5 ${testimonial.featured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                        {testimonial.featured ? 'Featured' : 'Standard'}
                      </button>

                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border ${
                        testimonial.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                          : 'bg-slate-50 text-slate-600 border-slate-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${testimonial.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {testimonial.status}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Actions Footer */}
                  <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex gap-2">
                    <Link href={`/admin/testimonials/${testimonial.id}`} className="flex-1">
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
                      onClick={() =>
                        handleDelete(testimonial.id, testimonial.patientName)
                      }
                      disabled={deleting === testimonial.id}
                      className="flex items-center justify-center gap-1 bg-white text-red-600 hover:text-red-700 border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors h-9 px-3"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting === testimonial.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-6 py-4 mt-6">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading testimonials...</div>}>
      <TestimonialsListContent />
    </Suspense>
  );
}
