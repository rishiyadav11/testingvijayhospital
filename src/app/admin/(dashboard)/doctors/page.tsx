'use client';

import { Suspense, useCallback } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { Trash2, Edit, Eye, Plus, User, Loader2, Hospital, GraduationCap, Briefcase } from 'lucide-react';
import type { Doctor } from '@prisma/client';

interface DoctorResponse {
  success: boolean;
  data?: Doctor[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const DEPARTMENTS = ['General', 'Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics', 'Oncology'];
const STATUSES = ['DRAFT', 'PUBLISHED'];

function DoctorsListContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [total, setTotal] = useState(0);

  // Fetch doctors when filters or page changes
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      
      if (departmentFilter) params.append('department', departmentFilter);
      if (specialtyFilter) params.append('specialty', specialtyFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/admin/doctors?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') || 'temp-token' : 'temp-token'}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const result: DoctorResponse = await response.json();

      if (result.success && result.data && result.pagination) {
        setDoctors(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch doctors',
          type: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, departmentFilter, specialtyFilter, statusFilter]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') || 'temp-token' : 'temp-token'}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      const result: DeleteResponse = await response.json();

      if (result.success) {
        setDoctors(doctors.filter((d) => d.id !== id));
        setTotal(total - 1);
        toast({
          title: 'Success',
          description: 'Doctor deleted successfully',
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete doctor',
          type: 'error',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
      });
    } finally {
      setDeleting(null);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      (doctor.specialty && doctor.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Doctors</h1>
          <p className="text-slate-600 mt-1">Manage hospital staff and physician information</p>
        </div>
        <Link href="/admin/doctors/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Search</label>
            <Input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Specialty</label>
            <Input
              type="text"
              placeholder="Filter by specialty..."
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter((e.target as HTMLInputElement).value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || departmentFilter || specialtyFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearch('');
              setDepartmentFilter('');
              setSpecialtyFilter('');
              setStatusFilter('');
              setPage(1);
            }}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table & Cards */}
      <div>
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-slate-600 mt-2">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600">No doctors found</p>
            <Link href="/admin/doctors/new">
              <Button className="mt-4">Add your first doctor</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => {
                const photo = doctor.photo || doctor.photoUrl || '';
                const hasValidPhoto = photo && (photo.startsWith('http') || photo.startsWith('/'));
                return (
                  <div key={doctor.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group">
                    <div className="relative h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
                      {hasValidPhoto ? (
                        <img src={photo} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                          <User className="w-16 h-16 text-slate-300" />
                        </div>
                      )}
                      <span className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                        doctor.status === 'PUBLISHED' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${doctor.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {doctor.status}
                      </span>
                    </div>
                    
                    <div className="p-6 flex-grow space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 leading-tight tracking-tight transition-colors duration-300 group-hover:text-primary">
                          {doctor.name}
                        </h3>
                        <p className="text-sm font-semibold text-emerald-600 mt-1 uppercase tracking-wider">
                          {doctor.specialty || 'General'}
                        </p>
                      </div>
                      
                      <div className="space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center text-xs text-slate-600">
                          <Hospital className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-500 w-16">Dept:</span>
                          <span className="text-slate-800 font-medium">{doctor.department}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-slate-600">
                          <GraduationCap className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-500 w-16">Degree:</span>
                          <span className="text-slate-800 font-medium truncate flex-1" title={doctor.qualifications || ''}>
                            {doctor.qualifications || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs text-slate-600">
                          <Briefcase className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-500 w-16">Exp:</span>
                          <span className="text-slate-800 font-medium">{doctor.experience || '0 years'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 grid grid-cols-3 gap-2">
                      <Link href={`/admin/doctors/${doctor.id}`}>
                        <Button size="sm" variant="outline" className="w-full justify-center text-xs px-2 py-1.5 h-9 border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all">
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/doctors/${doctor.slug || doctor.id}`}>
                        <Button size="sm" variant="outline" className="w-full justify-center text-xs px-2 py-1.5 h-9 border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(doctor.id, doctor.name)}
                        disabled={deleting === doctor.id}
                        className="text-red-600 hover:bg-red-50 border-red-100 w-full justify-center text-xs px-2 py-1.5 h-9 hover:border-red-300 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        {deleting === doctor.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center mt-6">
                <div className="text-sm text-slate-600">
                  Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                  {' '}<span className="text-slate-500">({total} total)</span>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
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
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <DoctorsListContent />
    </Suspense>
  );
}
