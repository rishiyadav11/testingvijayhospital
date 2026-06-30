'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = ['Infrastructure', 'Doctors', 'Events', 'Patient Care', 'Awards', 'Other'];

export default function NewGalleryItemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'IMAGE', mediaUrl: '',
    altText: '', category: 'Infrastructure', order: '0', status: 'PUBLISHED',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: 'Required', description: 'Title is required.', type: 'error' }); return; }
    if (!form.mediaUrl) { toast({ title: 'Required', description: 'Please upload an image.', type: 'error' }); return; }
    if (!form.category) { toast({ title: 'Required', description: 'Category is required.', type: 'error' }); return; }

    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Created', description: 'Gallery item added.' });
        router.push('/admin/gallery');
      } else {
        toast({ title: 'Error', description: result.error, type: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/gallery">
          <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add Gallery Item</h1>
          <p className="text-slate-500 text-xs">Upload a new photo or video</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Media <span className="text-red-500">*</span>
          </label>
          <CloudinaryUpload
            onUploadSuccess={url => set('mediaUrl', url)}
            onClear={() => set('mediaUrl', '')}
            folder="gallery"
          />
          {form.mediaUrl && <p className="text-xs text-emerald-600 mt-1.5">✓ Media uploaded</p>}
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
            <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Item'}
          </Button>
          <Link href="/admin/gallery">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
