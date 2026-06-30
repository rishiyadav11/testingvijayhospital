'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button';

const DoctorCreateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  specialty: z.string().optional().nullable(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type DoctorCreateInput = z.infer<typeof DoctorCreateSchema>;

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Maternity',
  'Pediatrics',
  'General',
];

export default function NewDoctorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DoctorCreateInput>({
    resolver: zodResolver(DoctorCreateSchema),
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

  const onSubmit = async (data: DoctorCreateInput) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        photoUrl: photoUrl || null,
      };

      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create doctor');
      }

      toast({
        title: 'Success',
        description: 'Doctor created successfully',
        type: 'success',
      });

      router.push('/admin/doctors');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create doctor';
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
          <h1 className="text-3xl font-bold text-slate-900">Create New Doctor</h1>
          <p className="text-slate-600 mt-1">Add a new doctor to the hospital</p>
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
                    Creating...
                  </>
                ) : (
                  'Create Doctor'
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
          </div>
        </div>
      </form>
    </div>
  );
}
