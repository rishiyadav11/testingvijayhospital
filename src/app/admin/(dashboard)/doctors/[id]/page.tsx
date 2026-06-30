'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button';

const DoctorEditSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  specialty: z.string().optional().nullable(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type DoctorEditInput = z.infer<typeof DoctorEditSchema>;

interface DoctorData {
  id: string;
  name: string;
  specialty: string | null;
  qualifications: string;
  experience: string;
  department: string;
  bio: string | null;
  photoUrl: string | null;
  status: 'DRAFT' | 'PUBLISHED';
}

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Maternity',
  'Pediatrics',
  'General',
];

interface EditDoctorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditDoctorPage({ params }: EditDoctorPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DoctorEditInput>({
    resolver: zodResolver(DoctorEditSchema),
    defaultValues: {
      name: '',
      specialty: '',
      qualifications: '',
      experience: '',
      department: 'General',
      bio: '',
      photoUrl: null,
      status: 'DRAFT',
    },
  });

  const status = watch('status');

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const resolvedParams = await params;
        setDoctorId(resolvedParams.id);

        const response = await fetch(`/api/admin/doctors/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch doctor');
        }

        const doctor = result.data as DoctorData;
        setPhotoUrl(doctor.photoUrl);
        setValue('name', doctor.name);
        setValue('specialty', doctor.specialty || '');
        setValue('qualifications', doctor.qualifications);
        setValue('experience', doctor.experience);
        setValue('department', doctor.department);
        setValue('bio', doctor.bio || '');
        setValue('photoUrl', doctor.photoUrl);
        setValue('status', doctor.status);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch doctor';
        toast({
          title: 'Error',
          description: message,
          type: 'error',
        });
        router.push('/admin/doctors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [params, setValue, toast, router]);

  const onSubmit = async (data: DoctorEditInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        photoUrl: photoUrl || null,
      };

      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update doctor');
      }

      toast({
        title: 'Success',
        description: 'Doctor updated successfully',
        type: 'success',
      });

      router.push('/admin/doctors');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update doctor';
      toast({
        title: 'Error',
        description: message,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUploadSuccess = (url: string) => {
    setPhotoUrl(url);
    setValue('photoUrl', url);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete doctor');
      }

      toast({
        title: 'Success',
        description: 'Doctor deleted successfully',
        type: 'success',
      });

      router.push('/admin/doctors');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete doctor';
      toast({
        title: 'Error',
        description: message,
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-600 mx-auto mb-2" />
          <p className="text-slate-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/doctors')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Doctor</h1>
          <p className="text-slate-600 mt-1">Update doctor information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder="Dr. John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Specialty
                  </label>
                  <Input
                    {...register('specialty')}
                    placeholder="e.g., Cardiology"
                    className={errors.specialty ? 'border-red-500' : ''}
                  />
                  {errors.specialty && (
                    <p className="text-red-600 text-sm mt-1">{errors.specialty.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Experience
                  </label>
                  <Input
                    {...register('experience')}
                    placeholder="e.g., 10 years"
                    className={errors.experience ? 'border-red-500' : ''}
                  />
                  {errors.experience && (
                    <p className="text-red-600 text-sm mt-1">{errors.experience.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Qualifications
                </label>
                <textarea
                  {...register('qualifications')}
                  placeholder="e.g., MBBS, MD Cardiology"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                    errors.qualifications ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.qualifications && (
                  <p className="text-red-600 text-sm mt-1">{errors.qualifications.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  placeholder="Write a brief biography..."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                    errors.bio ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.bio && (
                  <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Photo</h2>
              <CloudinaryUpload
                folder="doctors"
                onUploadSuccess={handlePhotoUploadSuccess}
                onUploadError={(error) =>
                  toast({
                    title: 'Upload Error',
                    description: error,
                    type: 'error',
                  })
                }
              />
              {photoUrl && (
                <div className="mt-4">
                  <img src={photoUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Department & Status */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Settings</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('department')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
                {errors.status && (
                  <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="text-sm text-slate-600">
                  {status === 'PUBLISHED'
                    ? 'This doctor is visible on the public site'
                    : 'This doctor is in draft mode and not visible on the public site'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push('/admin/doctors')}
              >
                Cancel
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6 space-y-4">
              <h3 className="font-semibold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700">
                Permanently delete this doctor record. This action cannot be undone.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Doctor
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
