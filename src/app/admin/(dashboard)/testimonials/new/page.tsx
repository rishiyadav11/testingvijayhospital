'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TestimonialSchema, type TestimonialInput } from '@/lib/schemas';
import { createTestimonial } from '@/lib/actions/testimonial-actions';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';

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
const DRAFT_KEY = 'testimonial_draft_new';

export default function NewTestimonialPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTime, setAutoSaveTime] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
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

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft) as Partial<TestimonialInput>;
        Object.entries(draft).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as keyof TestimonialInput, value);
          }
        });
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [setValue]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isDirty) return;

    const interval = setInterval(() => {
      const formData = watch();
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      setAutoSaveTime(new Date());
      setHasUnsavedChanges(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isDirty, watch]);

  // Mark as unsaved when form changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const onSubmit = async (data: TestimonialInput) => {
    setSubmitting(true);
    try {
      const result = await createTestimonial(data);

      if (result.success) {
        // Clear draft from localStorage
        localStorage.removeItem(DRAFT_KEY);

        toast({
          title: 'Success',
          description: 'Testimonial created successfully',
          type: 'success',
        });

        // Redirect to testimonials list
        router.push('/admin/testimonials');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create testimonial',
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

  const handleSaveDraft = () => {
    const formData = watch();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    setAutoSaveTime(new Date());
    setHasUnsavedChanges(false);
    toast({
      title: 'Saved',
      description: 'Draft saved to browser',
      type: 'success',
      duration: 2000,
    });
  };

  const handleDiscardDraft = () => {
    if (confirm('Discard all unsaved changes?')) {
      localStorage.removeItem(DRAFT_KEY);
      reset();
      setHasUnsavedChanges(false);
    }
  };

  const text = watch('text');
  const photoUrl = watch('photoUrl');

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
          <h1 className="text-3xl font-bold text-slate-900">Create Patient Story</h1>
          <p className="text-slate-600 mt-1">
            {hasUnsavedChanges && <span className="text-orange-600 font-medium">Unsaved changes • </span>}
            {autoSaveTime && (
              <span className="text-slate-600">
                Last saved: {autoSaveTime.toLocaleTimeString()}
              </span>
            )}
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
                onUploadSuccess={(url) => setValue('photoUrl', url)}
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
            onClick={handleDiscardDraft}
            disabled={submitting}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Testimonial'}
          </Button>
        </div>
      </form>
    </div>
  );
}
