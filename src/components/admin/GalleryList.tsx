'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { deleteGalleryItem } from '@/lib/actions/gallery-actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Edit, 
  Play, 
  Image as ImageIcon, 
  Video, 
  Search, 
  Calendar, 
  Eye, 
  X, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  EyeOff
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: 'IMAGE' | 'VIDEO' | string;
  mediaUrl: string;
  altText?: string | null;
  category: string;
  order: number;
  status: 'DRAFT' | 'PUBLISHED' | string;
  createdAt: string;
  updatedAt: string;
}

interface GalleryListProps {
  items: GalleryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const CATEGORIES = ['All', 'Infrastructure', 'Team', 'Services', 'Patient Care'];

export function GalleryList({ items: initialItems, pagination }: GalleryListProps) {
  const router = useRouter();
  
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  // Advanced filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Lightbox
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Stats calculation
  const totalCount = items.length;
  const publishedCount = items.filter(i => i.status === 'PUBLISHED').length;
  const draftCount = items.filter(i => i.status === 'DRAFT').length;
  const videoCount = items.filter(i => i.type === 'VIDEO').length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleting(id);
    const result = await deleteGalleryItem(id);

    if (result.success) {
      toast.success('Gallery item deleted successfully');
      setItems(items.filter((item) => item.id !== id));
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete gallery item');
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (item: GalleryItem) => {
    const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setToggling(item.id);

    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') || 'temp-token' : 'temp-token'}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      if (result.success) {
        toast.success(`Status updated to ${newStatus}`);
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setToggling(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infrastructure':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Team':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Services':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Patient Care':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const Thumbnail = ({ item }: { item: GalleryItem }) => {
    if (item.type === 'VIDEO') {
      return (
        <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
          <img
            src={item.mediaUrl}
            alt={item.altText || item.title}
            className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 transform scale-90 group-hover:scale-100 transition-all duration-300">
            <Play className="w-5 h-5 fill-current" />
          </div>
        </div>
      );
    }

    return (
      <img
        src={item.mediaUrl}
        alt={item.altText || item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Items</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Published Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{publishedCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Draft Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drafts</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{draftCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
            <Edit className="w-5 h-5" />
          </div>
        </div>

        {/* Videos Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Videos</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{videoCount}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
            <Video className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full bg-slate-50/50 focus:bg-white transition-colors"
            />
          </div>

          {/* Select Controls */}
          <div className="flex w-full md:w-auto gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="All">All Types</option>
              <option value="IMAGE">Images</option>
              <option value="VIDEO">Videos</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                categoryFilter === cat
                  ? "bg-[#0d5945] text-white shadow-md scale-105"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => setActiveItem(item)}>
                <Thumbnail item={item} />
                
                {/* Visual tags overlay */}
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase flex items-center gap-1 shadow-md ${
                    item.type === 'VIDEO' ? 'bg-purple-600 text-white' : 'bg-sky-600 text-white'
                  }`}>
                    {item.type === 'VIDEO' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {item.type}
                  </span>
                  <span className={`px-2.5 py-0.5 border text-[10px] rounded font-bold shadow-md ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-grow space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors text-lg" title={item.title}>
                      {item.title}
                    </h3>
                    
                    {/* Quick Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(item)}
                      disabled={toggling === item.id}
                      className={`flex-shrink-0 p-1.5 rounded-lg border transition-all ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                      }`}
                      title={item.status === 'PUBLISHED' ? 'Set as Draft' : 'Publish Item'}
                    >
                      {toggling === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : item.status === 'PUBLISHED' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {item.description ? (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No description provided</p>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>Updated: {new Date(item.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link href={`/admin/gallery/${item.id}`} className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex gap-1.5 items-center justify-center text-xs h-9 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all font-semibold"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.title)}
                      isLoading={deleting === item.id}
                      disabled={deleting !== null}
                      className="w-full flex gap-1.5 items-center justify-center text-xs h-9 text-rose-600 hover:bg-rose-50 border-rose-100 hover:border-rose-300 transition-all font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-sm mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-850 mb-1">No media found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or add a new gallery item.</p>
        </div>
      )}

      {/* Pagination & Count Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm">
        <p className="font-semibold text-slate-600">
          Showing <span className="text-[#0d5945] font-bold">{filteredItems.length}</span> of{' '}
          <span className="text-slate-800 font-bold">{pagination.total}</span> items
        </p>
        {pagination.pages > 1 && (
          <p className="font-bold bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm text-slate-700">
            Page {pagination.page} of {pagination.pages}
          </p>
        )}
      </div>

      {/* Lightbox / Preview Modal */}
      <AnimatePresence>
        {activeItem && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black text-white hover:text-rose-500 rounded-full transition-all border border-white/10"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Display */}
              <div className="relative flex-1 min-h-[300px] md:min-h-[450px] max-h-[65vh] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {activeItem.type === 'VIDEO' ? (
                  <iframe
                    src={activeItem.mediaUrl}
                    title={activeItem.title}
                    className="w-full h-full aspect-video"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={activeItem.mediaUrl}
                    alt={activeItem.altText || activeItem.title}
                    className="max-w-full max-h-[65vh] object-contain"
                  />
                )}
              </div>

              {/* Text Info */}
              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 border text-[10px] rounded font-bold uppercase ${getCategoryColor(activeItem.category)}`}>
                    {activeItem.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeItem.status === 'PUBLISHED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>
                    {activeItem.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{activeItem.title}</h2>
                {activeItem.description && (
                  <p className="text-slate-400 text-sm leading-relaxed">{activeItem.description}</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
