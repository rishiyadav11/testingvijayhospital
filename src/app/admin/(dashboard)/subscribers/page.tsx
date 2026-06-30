'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Mail, Search, Trash2, Copy, Check, Users, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface SubscriberResponse {
  success: boolean;
  data: Subscriber[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function SubscribersContent() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || '';
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '30',
      });

      const response = await fetch(`/api/admin/subscribers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result: SubscriberResponse = await response.json();

      if (response.ok && result.success) {
        setSubscribers(result.data || []);
        setTotalPages(result.pagination.totalPages || 1);
        setTotal(result.pagination.total || 0);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch subscribers list',
          type: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Unsubscribe and delete "${email}"?`)) return;

    setDeleting(id);
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || '';
      const response = await fetch(`/api/admin/subscribers?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        setTotal(t => t - 1);
        toast({
          title: 'Deleted',
          description: 'Subscriber removed successfully',
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete subscriber',
          type: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete subscriber',
        type: 'error',
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleCopySingle = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast({
      description: 'Email copied to clipboard',
      duration: 2000 as any,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (subscribers.length === 0) return;
    const emailsList = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emailsList);
    setCopiedAll(true);
    toast({
      title: 'Success',
      description: `Copied ${subscribers.length} emails to clipboard`,
      type: 'success',
    });
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-8 h-8 text-indigo-600" />
            Newsletter Subscribers
          </h1>
          <p className="text-slate-600 mt-1">Manage users who subscribed to your health tips articles.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCopyAll}
            disabled={subscribers.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-bold text-sm shadow-md shadow-indigo-500/10"
          >
            {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy Email List
          </Button>
          <button
            onClick={fetchSubscribers}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-900">{total}</p>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Total Active Subscribers</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">💡 Sending campaigns</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Click <strong>Copy Email List</strong> to copy a list of all subscriber emails formatted for direct input (e.g., BCC field) in your mailing client.
          </p>
        </div>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center gap-2 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs">Loading subscribers list...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Mail className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-500 font-semibold">No subscribers found</p>
            <p className="text-slate-400 text-xs">Emails will appear here once users subscribe to your blog.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(sub => (
              <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      {sub.email}
                      <button
                        onClick={() => handleCopySingle(sub.email, sub.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        title="Copy Email"
                      >
                        {copiedId === sub.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Subscribed on {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(sub.id, sub.email)}
                  disabled={deleting === sub.id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-slate-200 flex items-center gap-1.5 h-8 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  title="Remove Subscriber"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscribersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading subscribers...</div>}>
      <SubscribersContent />
    </Suspense>
  );
}
