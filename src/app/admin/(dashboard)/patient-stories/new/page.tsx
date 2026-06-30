'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';
import Link from 'next/link';

const SPECIALTIES = ['Cardiology', 'Orthopedics', 'Neurology', 'Maternity', 'Oncology', 'Emergency', 'Pediatrics', 'Gynecology', 'General Surgery', 'Gastroenterology', 'ENT', 'Ophthalmology', 'Dermatology', 'Urology'];
const ICONS = ['heart', 'baby', 'run', 'ribbon', 'ambulance', 'brain', 'hospital', 'heart-gift'];

export default function NewPatientStoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientName: '', age: '', specialty: '', condition: '', story: '',
    icon: 'hospital', photoUrl: '', rating: '5', recoveryTime: '',
    featured: false, status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  });

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/patient-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Story created', description: `"${form.patientName}" added successfully.` });
        router.push('/admin/patient-stories');
      } else {
        toast({ title: 'Error', description: data.error, type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/patient-stories">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add Patient Story</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient Name *</label>
            <Input required value={form.patientName} onChange={e => set('patientName', e.target.value)} placeholder="e.g. Rajesh Kumar" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age *</label>
            <Input required type="number" min="1" max="120" value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 45" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Specialty *</label>
            <select required value={form.specialty} onChange={e => set('specialty', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Select specialty</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Condition *</label>
            <Input required value={form.condition} onChange={e => set('condition', e.target.value)} placeholder="e.g. Heart Surgery" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Story *</label>
          <textarea required rows={5} value={form.story} onChange={e => set('story', e.target.value)}
            placeholder="Patient's story in their own words…"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recovery Time *</label>
            <Input required value={form.recoveryTime} onChange={e => set('recoveryTime', e.target.value)} placeholder="e.g. 3 months" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rating</label>
            <select value={form.rating} onChange={e => set('rating', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Icon</label>
            <select value={form.icon} onChange={e => set('icon', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Photo upload */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700">Patient Photo <span className="font-normal text-slate-400">(optional)</span></p>
          <CloudinaryUpload
            onUploadSuccess={(url) => set('photoUrl', url)}
            folder="patient-stories"
          />
          {form.photoUrl && (
            <p className="text-xs text-emerald-600 font-medium">✓ Photo uploaded successfully</p>
          )}
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Featured</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Status:</label>
            <select value={form.status} onChange={e => set('status', e.target.value as 'DRAFT' | 'PUBLISHED')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={submitting} className="bg-emerald-600 hover:bg-emerald-700">
            Create Story
          </Button>
          <Link href="/admin/patient-stories">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
