'use client';

import { Suspense, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import {
  Trash2, ChevronLeft, ChevronRight, CalendarDays,
  Clock, User, Phone, Stethoscope, RefreshCw, Calendar,
} from 'lucide-react';
import type { Appointment } from '@prisma/client';

interface AppointmentWithDoctor extends Appointment {
  doctor?: { id: string; name: string; specialty?: string | null };
}

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const STATUS_STYLES: Record<string, string> = {
  Pending:   'bg-amber-100 text-amber-700 border-amber-200',
  Confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Completed: 'bg-blue-100 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  return { Authorization: `Bearer ${token}` };
}

function AppointmentsContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, today: 0 });

  const fetchAppointments = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    if (!token) { router.push('/admin/login'); return; }

    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (dateFilter) params.set('date', dateFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/admin/appointments?${params}`, { headers: authHeaders() });
      if (res.status === 401) { router.push('/admin/login'); return; }

      const result = await res.json();
      if (result.success) {
        let data: AppointmentWithDoctor[] = result.data;
        if (search) {
          const q = search.toLowerCase();
          data = data.filter(a =>
            a.patientName.toLowerCase().includes(q) ||
            a.patientPhone.includes(q) ||
            a.doctor?.name?.toLowerCase().includes(q)
          );
        }
        setAppointments(data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);

        // Compute stats from first page data
        const today = new Date().toISOString().split('T')[0];
        setStats({
          total: result.pagination.total,
          pending: result.data.filter((a: AppointmentWithDoctor) => a.status === 'Pending').length,
          confirmed: result.data.filter((a: AppointmentWithDoctor) => a.status === 'Confirmed').length,
          today: result.data.filter((a: AppointmentWithDoctor) => a.date === today).length,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, dateFilter, statusFilter, search, router]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        toast({ title: 'Status updated', description: `Appointment marked as ${newStatus}.` });
      } else {
        toast({ title: 'Error', description: result.error, type: 'error' });
      }
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete appointment for "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      const result = await res.json();
      if (result.success) {
        setAppointments(prev => prev.filter(a => a.id !== id));
        setTotal(t => t - 1);
        toast({ title: 'Deleted', description: `Appointment for "${name}" removed.` });
      } else {
        toast({ title: 'Error', description: result.error, type: 'error' });
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage patient bookings and schedules</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAppointments} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: stats.total, icon: <CalendarDays className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50 border-blue-100' },
          { label: "Today's Appointments", value: stats.today, icon: <Calendar className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Pending Review', value: stats.pending, icon: <Clock className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 border-amber-100' },
          { label: 'Confirmed', value: stats.confirmed, icon: <User className="w-5 h-5 text-violet-500" />, bg: 'bg-violet-50 border-violet-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 flex items-center gap-4 ${s.bg}`}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
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
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Search</label>
          <Input
            placeholder="Patient name, phone…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Date</label>
          <Input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Status</label>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setDateFilter(''); setStatusFilter(''); setSearch(''); setPage(1); }}>
          Clear
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading appointments…</div>
        ) : appointments.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <CalendarDays className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-500 font-medium">No appointments found</p>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Patient</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Doctor</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date & Time</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Notes</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                    <th className="text-right px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map(appt => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{appt.patientName}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Phone className="w-3 h-3" /> {appt.patientPhone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">{appt.doctor?.name ?? '—'}</p>
                        {appt.doctor?.specialty && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Stethoscope className="w-3 h-3" /> {appt.doctor.specialty}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800 flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(appt.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" /> {appt.time}
                        </p>
                      </td>
                      <td className="px-4 py-4 max-w-[180px]">
                        <p className="text-xs text-slate-500 truncate" title={appt.notes ?? ''}>
                          {appt.notes || '—'}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={appt.status}
                          onChange={e => handleStatusUpdate(appt.id, e.target.value)}
                          disabled={updating === appt.id}
                          className={`px-2.5 py-1 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-colors ${STATUS_STYLES[appt.status] ?? 'bg-slate-100 text-slate-600 border-slate-200'} ${updating === appt.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(appt.id, appt.patientName)}
                          disabled={deleting === appt.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setPage(p => p - 1)} disabled={page === 1} className="gap-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                  </Button>
                  <span className="text-xs text-slate-600 font-medium px-2">Page {page} of {totalPages}</span>
                  <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="gap-1">
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading…</div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
