'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, BookOpen, Calendar, MessageSquare, ArrowRight,
  CheckCircle, Clock, AlertCircle, Plus, TrendingUp,
  Heart, Image as ImageIcon, Briefcase, Loader2,
} from 'lucide-react';

interface Doctor   { id: string; name: string; status: string; department: string; specialty?: string; createdAt: string; }
interface Blog     { id: string; title: string; excerpt?: string; featuredImageUrl?: string; category: string; status: string; createdAt: string; author: string; }
interface Appt     { id: string; patientName: string; patientPhone: string; date: string; time: string; status: string; createdAt: string; }
interface Testimonial { id: string; status: string; }
interface Stats    { doctors: number; publishedDoctors: number; blogs: number; publishedBlogs: number; appointments: number; testimonials: number; }

const STAT_CARDS = [
  { key: 'doctors',      label: 'Total Doctors',      sub: 'publishedDoctors', subLabel: 'live',       icon: Users,        bg: 'bg-blue-50',    iconColor: 'text-blue-500',    href: '/admin/doctors'      },
  { key: 'appointments', label: 'Appointments',        sub: null,              subLabel: 'all time',    icon: Calendar,     bg: 'bg-emerald-50', iconColor: 'text-emerald-500', href: '/admin/appointments' },
  { key: 'blogs',        label: 'Blog Articles',       sub: 'publishedBlogs',  subLabel: 'published',  icon: BookOpen,     bg: 'bg-amber-50',   iconColor: 'text-amber-500',   href: '/admin/blogs'        },
  { key: 'testimonials', label: 'Testimonials',        sub: null,              subLabel: 'patient reviews', icon: MessageSquare, bg: 'bg-pink-50', iconColor: 'text-pink-500',  href: '/admin/testimonials' },
];

const QUICK_ACTIONS = [
  { label: 'Add Doctor',       href: '/admin/doctors/new',         icon: Users,     color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100/60' },
  { label: 'New Blog Post',    href: '/admin/blogs/new',           icon: BookOpen,  color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100/60' },
  { label: 'Upload Gallery',   href: '/admin/gallery/new',         icon: ImageIcon, color: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-100/60' },
  { label: 'Add Testimonial',  href: '/admin/testimonials/new',    icon: Heart,     color: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100/60' },
  { label: 'Post Career',      href: '/admin/careers/new',         icon: Briefcase, color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-100/60' },
  { label: 'Patient Story',    href: '/admin/patient-stories/new', icon: MessageSquare, color: 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100/60' },
];

const statusColor: Record<string, string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  DRAFT:     'bg-amber-100 text-amber-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Pending:   'bg-orange-100 text-orange-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const StatusIcon = ({ s }: { s: string }) =>
  s === 'PUBLISHED' || s === 'Confirmed' ? <CheckCircle className="w-3 h-3" /> :
  s === 'Pending' ? <Clock className="w-3 h-3" /> :
  <AlertCircle className="w-3 h-3" />;

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading]     = useState(true);
  const [stats, setStats]         = useState<Stats>({ doctors: 0, publishedDoctors: 0, blogs: 0, publishedBlogs: 0, appointments: 0, testimonials: 0 });
  const [recentAppts, setAppts]   = useState<Appt[]>([]);
  const [recentBlogs, setBlogs]   = useState<Blog[]>([]);

  const load = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin/login'); return; }
    const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      const [dr, bl, ap, te] = await Promise.all([
        fetch('/api/admin/doctors?limit=100', { headers: h }).then(r => r.json()),
        fetch('/api/admin/blogs?limit=100',   { headers: h }).then(r => r.json()),
        fetch('/api/admin/appointments?limit=10', { headers: h }).then(r => r.json()),
        fetch('/api/admin/testimonials?limit=100', { headers: h }).then(r => r.json()),
      ]);
      if (dr.status === 401) { localStorage.removeItem('admin_token'); router.push('/admin/login'); return; }
      const docs = dr.data ?? []; const blogs = bl.data ?? [];
      const appts = ap.data ?? []; const testi = te.data ?? [];
      setStats({
        doctors: docs.length, publishedDoctors: docs.filter((d: Doctor) => d.status === 'PUBLISHED').length,
        blogs: blogs.length, publishedBlogs: blogs.filter((b: Blog) => b.status === 'PUBLISHED').length,
        appointments: appts.length, testimonials: testi.length,
      });
      setAppts(appts.sort((a: Appt, b: Appt) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
      setBlogs(blogs.sort((a: Blog, b: Blog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4));
    } catch { /* silent */ } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
        <p className="text-sm text-slate-500">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-950 p-8 sm:p-10 text-white shadow-xl shadow-emerald-950/10">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1.5">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Vijay Hospital Dashboard</h1>
            <p className="text-emerald-100/90 mt-1 text-sm max-w-md">Manage your hospital content, appointments, and media assets with ease.</p>
          </div>
          <TrendingUp className="w-16 h-16 text-white/20 hidden sm:block" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map(card => {
          const Icon = card.icon;
          const val = stats[card.key as keyof Stats] as number;
          const subVal = card.sub ? stats[card.sub as keyof Stats] as number : null;
          return (
            <Link key={card.key} href={card.href}
              className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{val}</p>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{card.label}</p>
                {subVal !== null && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1 bg-emerald-50 inline-block px-2.5 py-0.5 rounded-full">{subVal} {card.subLabel}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(a => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href}
                className={`${a.color} rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all duration-200 hover:scale-[1.02] active:scale-95 border`}>
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-bold leading-tight">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent appointments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="font-bold text-slate-900">Recent Appointments</h2>
            </div>
            <Link href="/admin/appointments"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentAppts.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentAppts.map(a => (
                <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {a.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{a.patientName}</p>
                    <p className="text-xs text-slate-400">{fmtDate(a.date)}{a.time ? ` · ${a.time}` : ''}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusColor[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    <StatusIcon s={a.status} /> {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent blogs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="font-bold text-slate-900">Recent Blogs</h2>
            </div>
            <Link href="/admin/blogs"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentBlogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No blogs yet</p>
              <Link href="/admin/blogs/new"
                className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                <Plus className="w-3 h-3" /> Write your first post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBlogs.map(b => (
                <Link key={b.id} href={`/admin/blogs/${b.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {b.featuredImageUrl
                      ? <img src={b.featuredImageUrl} alt={b.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-slate-300" /></div>}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate group-hover:text-emerald-600 transition-colors">{b.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{b.category} · {fmtDate(b.createdAt)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusColor[b.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {b.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
