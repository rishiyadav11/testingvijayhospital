'use client';

import React, { useState, useCallback, useId } from 'react';
import { Upload, X, Loader, RefreshCw } from 'lucide-react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError?: (error: string) => void;
  onClear?: () => void;
  folder?: string;
  maxSize?: number;
  initialUrl?: string;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  onClear,
  folder = 'vijay-hospital',
  maxSize = 5,
  initialUrl = '',
}) => {
  const inputId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(initialUrl);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size / (1024 * 1024) > maxSize) {
        const msg = `File size must be less than ${maxSize}MB`;
        setError(msg);
        onUploadError?.(msg);
        return;
      }

      if (!file.type.startsWith('image/')) {
        const msg = 'Please upload an image file (PNG, JPG, WebP, etc.)';
        setError(msg);
        onUploadError?.(msg);
        return;
      }

      // Show local preview immediately
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);

      setIsLoading(true);
      setError('');

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await response.json();
        if (data.success) {
          setPreviewUrl(data.url);
          onUploadSuccess(data.url, data.public_id);
          setError('');
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setError(msg);
        onUploadError?.(msg);
        setPreviewUrl(initialUrl); // revert to initial on failure
      } finally {
        setIsLoading(false);
      }
    },
    [folder, maxSize, initialUrl, onUploadSuccess, onUploadError]
  );

  const handleClear = () => {
    setPreviewUrl('');
    setError('');
    onClear?.();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
          id={inputId}
        />

        {previewUrl ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            {/* overlay buttons */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
              <label
                htmlFor={inputId}
                className="cursor-pointer flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Replace
              </label>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              {isLoading ? (
                <>
                  <Loader className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-sm text-slate-600">Uploading…</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm text-slate-600">Click to upload image (max {maxSize}MB)</span>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CloudinaryUpload;
