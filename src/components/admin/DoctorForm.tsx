'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DoctorSchema, type DoctorInput } from '@/lib/schemas'
import { createDoctor, updateDoctor, checkSlugExists } from '@/lib/actions/doctor-actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Maternity',
  'Pediatrics',
  'General',
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface DoctorFormProps {
  doctor?: {
    id: string
    slug?: string | null
    name: string
    photo?: string | null
    department: string
    qualifications: string
    experience: string
    bio?: string | null
    availableDays?: string | null
    timeSlots?: string | null
    seoTitle?: string | null
    seoDesc?: string | null
    status: 'DRAFT' | 'PUBLISHED'
    order: number
  }
}

export function DoctorForm({ doctor }: DoctorFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(doctor?.photo || null)
  const [slugError, setSlugError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DoctorInput>({
    resolver: zodResolver(DoctorSchema) as any,
    defaultValues: doctor
      ? {
          name: doctor.name,
          slug: doctor.slug || '',
          photo: doctor.photo || '',
          department: doctor.department,
          qualifications: doctor.qualifications,
          experience: doctor.experience,
          bio: doctor.bio || '',
          availableDays: doctor.availableDays || '',
          timeSlots: doctor.timeSlots || '',
          seoTitle: doctor.seoTitle || '',
          seoDesc: doctor.seoDesc || '',
          status: doctor.status,
          order: doctor.order,
        }
      : {
          name: '',
          slug: '',
          photo: '',
          department: 'General',
          qualifications: '',
          experience: '',
          bio: '',
          availableDays: '',
          timeSlots: '',
          seoTitle: '',
          seoDesc: '',
          status: 'DRAFT',
          order: 0,
        },
  })

  const nameValue = watch('name')
  const slugValue = watch('slug')

  // Auto-generate slug from name
  useEffect(() => {
    if (!doctor && nameValue && !slugValue) {
      const newSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', newSlug)
    }
  }, [nameValue, slugValue, doctor, setValue])

  // Check slug uniqueness
  useEffect(() => {
    const checkSlug = async () => {
      if (slugValue) {
        const result = await checkSlugExists(slugValue, doctor?.id)
        if (result.exists) {
          setSlugError('This slug is already taken')
        } else {
          setSlugError('')
        }
      }
    }
    const timer = setTimeout(checkSlug, 500)
    return () => clearTimeout(timer)
  }, [slugValue, doctor?.id])

  const onSubmit: SubmitHandler<DoctorInput> = async (data) => {
    if (slugError) {
      toast.error('Please fix the slug error')
      return
    }

    setIsLoading(true)
    try {
      const result = doctor
        ? await updateDoctor(doctor.id, data)
        : await createDoctor(data)

      if (result.success) {
        toast.success(
          doctor ? 'Doctor updated successfully' : 'Doctor created successfully'
        )
        if (!doctor) {
          router.push('/admin/doctors')
        }
      } else {
        toast.error(result.error || 'Failed to save doctor')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('An error occurred while saving')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        setValue('photo', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    setValue('photo', '')
  }

  const handleAvailableDaysChange = (day: string) => {
    const current = (watch('availableDays') || '').split(',').filter(Boolean)
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day]
    setValue('availableDays', updated.join(','))
  }

  const selectedDays = (watch('availableDays') || '').split(',').filter(Boolean)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Doctor Name *
        </label>
        <Input
          {...register('name')}
          placeholder="e.g., Dr. John Smith"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          URL Slug *
        </label>
        <Input
          {...register('slug')}
          placeholder="auto-generated from name"
          className={slugError ? 'border-red-500' : errors.slug ? 'border-red-500' : ''}
        />
        {slugError && (
          <p className="text-red-600 text-sm mt-1">{slugError}</p>
        )}
        {errors.slug && !slugError && (
          <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Photo
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          {photoPreview ? (
            <div className="space-y-4">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto"
              />
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photo-input')?.click()}
                >
                  Replace Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              <p className="text-slate-600">Drag and drop your photo here, or click to select</p>
              <p className="text-sm text-slate-500 mt-1">Max 5MB • JPG, PNG, WebP</p>
            </div>
          )}
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Department *
        </label>
        <select
          {...register('department')}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

      {/* Qualifications */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Qualifications
        </label>
        <Input
          {...register('qualifications')}
          placeholder="e.g., MD, Board Certified"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Experience
        </label>
        <Input
          {...register('experience')}
          placeholder="e.g., 10+ years"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Biography
        </label>
        <textarea
          {...register('bio')}
          placeholder="Write a brief biography..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      {/* Available Days */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Available Days
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DAYS.map((day) => (
            <label key={day} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => handleAvailableDaysChange(day)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">{day}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Time Slots
        </label>
        <Input
          {...register('timeSlots')}
          placeholder="e.g., 10:00 AM - 2:00 PM, 4:00 PM - 7:00 PM"
        />
      </div>

      {/* SEO Fields */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">SEO Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SEO Title
            </label>
            <Input
              {...register('seoTitle')}
              placeholder="e.g., Dr. John Smith - Cardiologist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SEO Description
            </label>
            <textarea
              {...register('seoDesc')}
              placeholder="Brief description for search engines..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Status & Order */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status *
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="DRAFT"
                {...register('status')}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="PUBLISHED"
                {...register('status')}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">Published</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Display Order
          </label>
          <Input
            type="number"
            {...register('order', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-2 pt-6">
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : doctor ? 'Update Doctor' : 'Create Doctor'}
        </Button>
        {doctor && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
