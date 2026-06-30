'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TestimonialSchema, type TestimonialInput } from '@/lib/schemas';
import { updateTestimonial, getTestimonial } from '@/lib/actions/testimonial-actions';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';
import type { Testimonial } from '@prisma/client';

const RECOVERY_TYPES = [
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Maternity',
  'General Surgery',
  'Pediatrics',
  'Gynecology',
];

const STATUSES = ['DRAFT', 'PUBLISHED'] as const;

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<TestimonialInput>({
    resolver: zodResolver(TestimonialSchema),
    defaultValues: {
      patientName: '',
      photoUrl: '',
      recoveryType: '',
      rating: 5,
      text: '',
      visitDate: '',
      featured: false,
      status: 'DRAFT',
    },
  });

  // Fetch testimonial on mount
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        setLoading(true);
        const testimonial = await getTestimonial(id);

        if (!testimonial) {
          toast({
            title: 'Error',
            description: 'Testimonial not found',
            type: 'error',
          });
          router.push('/admin/testimonials');
          return;
        }

        // Populate form with testimonial data
        setValue('patientName', testimonial.patientName);
        setValue('photoUrl', testimonial.photoUrl || '');
        setValue('recoveryType', testimonial.recoveryType);
        setValue('rating', testimonial.rating);
        setValue('text', testimonial.text);
        setValue('visitDate', testimonial.visitDate ? testimonial.visitDate.toISOString().split('T')[0] : '');
        setValue('featured', testimonial.featured ?? false);
        setValue('status', (testimonial.status ?? 'DRAFT') as 'DRAFT' | 'PUBLISHED');
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load testimonial',
          type: 'error',
        });
        router.push('/admin/testimonials');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTestimonial();
    }
  }, [id, setValue, toast, router]);

  // Mark as unsaved when form changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const onSubmit = async (data: TestimonialInput) => {
    setSubmitting(true);
    try {
      const result = await updateTestimonial(id, data);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Testimonial updated successfully',
          type: 'success',
        });

        // Redirect to testimonials list
        router.push('/admin/testimonials');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update testimonial',
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
      setSubmitting(false);
    }
  };

  const text = watch('text');
  const photoUrl = watch('photoUrl');

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-slate-600">Loading patient story...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/testimonials')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Patient Story</h1>
          <p className="text-slate-600 mt-1">
            {hasUnsavedChanges && <span className="text-orange-600 font-medium">Unsaved changes</span>}
          </p>
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
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('patientName')}
                  placeholder="Enter patient name"
                  className={errors.patientName ? 'border-red-500' : ''}
                />
                {errors.patientName && (
                  <p className="text-red-600 text-sm mt-1">{errors.patientName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Recovery Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('recoveryType')}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.recoveryType ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select recovery type</option>
                  {RECOVERY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.recoveryType && (
                  <p className="text-red-600 text-sm mt-1">{errors.recoveryType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visit Date (Optional)
                </label>
                <Input
                  type="date"
                  {...register('visitDate')}
                  className={errors.visitDate ? 'border-red-500' : ''}
                />
              </div>
            </div>

            {/* Patient Story Text */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Patient Story</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Story Text <span className="text-slate-500 text-xs">{(text || '').length}/500</span>
                </label>
                <textarea
                  {...register('text')}
                  placeholder="Write the patient's success story (max 500 characters)"
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.text ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.text && (
                  <p className="text-red-600 text-sm mt-1">{errors.text.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating & Status */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Rating & Status</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                  <option value={3}>3 Stars ⭐⭐⭐</option>
                  <option value={2}>2 Stars ⭐⭐</option>
                  <option value={1}>1 Star ⭐</option>
                </select>
                {errors.rating && (
                  <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Feature on website
                </label>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Patient Photo (Optional)</h3>

              <CloudinaryUpload
                initialUrl={photoUrl || ''}
                onUploadSuccess={(url) => setValue('photoUrl', url)}
                onClear={() => setValue('photoUrl', '')}
                folder="testimonials"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/testimonials')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
