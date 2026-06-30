'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const CATEGORIES = ['Infrastructure', 'Doctors', 'Events', 'Patient Care', 'Awards', 'Other'];

function authHeaders(extra?: Record<string, string>) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { Authorization: `Bearer ${token}`, ...extra };
}

export default function EditGalleryItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', description: '', type: 'IMAGE', mediaUrl: '',
    altText: '', category: 'Infrastructure', order: '0', status: 'DRAFT',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/gallery/${params.id}`, { headers: authHeaders() });
      const result = await res.json();
      if (result.success) {
        const d = result.data;
        setForm({
          title: d.title || '',
          description: d.description || '',
          type: d.type || 'IMAGE',
          mediaUrl: d.mediaUrl || '',
          altText: d.altText || '',
          category: d.category || 'Infrastructure',
          order: String(d.order ?? 0),
          status: d.status || 'DRAFT',
        });
      } else {
        toast({ title: 'Error', description: 'Item not found.', type: 'error' });
        router.push('/admin/gallery');
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: 'Required', description: 'Title is required.', type: 'error' }); return; }
    if (!form.mediaUrl) { toast({ title: 'Required', description: 'Media URL is required.', type: 'error' }); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/gallery/${params.id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Saved', description: 'Gallery item updated.' });
        router.push('/admin/gallery');
      } else {
        toast({ title: 'Error', description: result.error, type: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete this item? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${params.id}`, { method: 'DELETE', headers: authHeaders() });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Deleted', description: 'Gallery item removed.' });
        router.push('/admin/gallery');
      } else {
        toast({ title: 'Error', description: result.error, type: 'error' });
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/gallery">
          <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">Edit Gallery Item</h1>
          <p className="text-slate-500 text-xs truncate">{form.title}</p>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40">
          <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Media <span className="text-red-500">*</span>
          </label>
          <CloudinaryUpload
            initialUrl={form.mediaUrl}
            onUploadSuccess={url => set('mediaUrl', url)}
            onClear={() => set('mediaUrl', '')}
            folder="gallery"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
          <div className="flex gap-3">
            {['IMAGE', 'VIDEO'].map(t => (
              <button key={t} onClick={() => set('type', t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  form.type === t
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. ICU Ward" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Optional short description"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alt Text</label>
          <Input value={form.altText} onChange={e => set('altText', e.target.value)} placeholder="Accessibility description" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sort Order</label>
            <Input type="number" value={form.order} onChange={e => set('order', e.target.value)} min="0" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving} className="gap-1.5 flex-1">
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Changes'}
          </Button>
          <Link href="/admin/gallery">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
