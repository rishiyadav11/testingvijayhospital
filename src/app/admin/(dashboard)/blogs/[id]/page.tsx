'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogSchema, type BlogInput } from '@/lib/schemas';
import { updateBlog, getBlog, deleteBlog } from '@/lib/actions/blog-actions';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { CloudinaryUpload } from '@/components/admin/CloudinaryUpload';
import { useToast } from '@/hooks/useToast';
import type { Blog } from '@prisma/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORIES = ['Health Tips', 'Disease Awareness', 'Hospital News', 'Maternity'];
const DOCTORS = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Admin'];
const STATUSES = ['DRAFT', 'PUBLISHED'] as const;
export default function EditBlogPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTime, setAutoSaveTime] = useState<Date | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<BlogInput>({
    resolver: zodResolver(BlogSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Health Tips',
      tags: '',
      author: 'Admin',
      status: 'DRAFT' as const,
      keywords: '',
      readTime: '5 min',
    },
  });

  const draftKey = `blog_draft_${resolvedParams.id}`;

  // Load blog on mount
  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const result = await getBlog(resolvedParams.id);
        if (result) {
          setBlog(result);

          // Check for draft
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            try {
              const draft = JSON.parse(savedDraft) as Partial<BlogInput>;
              Object.entries(draft).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  setValue(key as keyof BlogInput, value);
                }
              });
            } catch (error) {
              console.error('Failed to load draft:', error);
            }
          } else {
            // Pre-fill form with blog data
            Object.entries(result).forEach(([key, value]) => {
              if (
                value !== undefined &&
                value !== null &&
                key !== 'id' &&
                key !== 'createdAt' &&
                key !== 'updatedAt'
              ) {
                if (key === 'publishedAt') {
                  const dateObj = new Date(value as string | Date);
                  if (!isNaN(dateObj.getTime())) {
                    const dateStr = dateObj.toISOString().slice(0, 16);
                    setValue(key as keyof BlogInput, dateStr as unknown as BlogInput[keyof BlogInput]);
                  }
                } else {
                  setValue(key as keyof BlogInput, value as unknown as BlogInput[keyof BlogInput]);
                }
              }
            });
          }
        } else {
          toast({ description: 'Blog not found', type: 'error' });
          router.push('/admin/blogs');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred',
          type: 'error',
        });
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [resolvedParams.id, setValue, draftKey, toast, router]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isDirty) return;

    const interval = setInterval(() => {
      const formData = watch();
      localStorage.setItem(draftKey, JSON.stringify(formData));
      setAutoSaveTime(new Date());
      setHasUnsavedChanges(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isDirty, watch, draftKey]);

  // Mark as unsaved when form changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const onSubmit = async (data: Partial<BlogInput>) => {
    setSubmitting(true);
    try {
      const result = await updateBlog(resolvedParams.id, data as any);

      if (result.success) {
        // Clear draft from localStorage
        localStorage.removeItem(draftKey);

        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
          type: 'success',
        });

        // Redirect to blogs list
        router.push('/admin/blogs');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update blog',
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
    localStorage.setItem(draftKey, JSON.stringify(formData));
    setAutoSaveTime(new Date());
    setHasUnsavedChanges(false);
    toast({
      title: 'Saved',
      description: 'Draft saved to browser',
      type: 'success',
      duration: 2000 as any,
    });
  };

  const handleDelete = async () => {
    if (!confirm('Delete this blog post permanently? This cannot be undone.')) return;

    setDeleting(true);
    try {
      const result = await deleteBlog(resolvedParams.id);

      if (result.success) {
        localStorage.removeItem(draftKey);
        toast({
          title: 'Success',
          description: 'Blog post deleted',
          type: 'success',
        });
        router.push('/admin/blogs');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete blog',
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
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-2xl mb-2">⏳</div>
          <p className="text-slate-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Blog post not found</p>
        <Button onClick={() => router.push('/admin/blogs')}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  const excerpt = watch('excerpt');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/blogs')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Blog Post</h1>
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
            {/* Title */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('title')}
                  placeholder="Enter blog post title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('slug')}
                  placeholder="blog-post-title"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                )}
                <p className="text-slate-500 text-xs mt-1">URL-friendly version of the title</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Excerpt <span className="text-slate-500 text-xs">{(excerpt || '').length}/160</span>
                </label>
                <textarea
                  {...register('excerpt')}
                  placeholder="Brief summary of your blog post (max 160 characters)"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                    errors.excerpt ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.excerpt && (
                  <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <BlogEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your blog post content..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-2">{errors.content.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status & Publish */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Status & Publishing</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Publish Date (Optional)
                </label>
                <Input
                  type="datetime-local"
                  {...register('publishedAt')}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Category & Tags */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Organization</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  {...register('tags')}
                  placeholder="health, tips, hospital"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Author & Meta */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Author & Meta</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                <select
                  {...register('author')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {DOCTORS.map((doc) => (
                    <option key={doc} value={doc}>
                      {doc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SEO Title (Optional)
                </label>
                <Input {...register('seoTitle')} placeholder="SEO title" className="text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  SEO Description (Optional)
                </label>
                <Input
                  {...register('seoDesc')}
                  placeholder="SEO description"
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <Input
                  {...register('keywords')}
                  placeholder="keyword1, keyword2"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <h3 className="font-semibold text-slate-900">Featured Image</h3>

              <div>
                {watch('featuredImageUrl') && (
                  <div className="mb-4">
                    <img
                      src={watch('featuredImageUrl')}
                      alt="Featured"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                <CloudinaryUpload
                  folder="vijay-hospital/blogs"
                  onUploadSuccess={(url) => {
                    setValue('featuredImageUrl', url);
                    toast({
                      title: 'Success',
                      description: 'Image uploaded successfully',
                      type: 'success',
                      duration: 2000 as any,
                    });
                  }}
                  onUploadError={(error) => {
                    toast({
                      title: 'Error',
                      description: error,
                      type: 'error',
                    });
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 space-y-3">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? 'Updating...' : 'Update Blog Post'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="w-full"
                disabled={!isDirty}
              >
                💾 Save as Draft
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete Blog Post'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
