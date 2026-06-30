'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Copy, ExternalLink } from 'lucide-react';

interface ImageManagerProps {
  images: Array<{ url: string; publicId: string; title?: string }>;
  onDelete?: (publicId: string) => Promise<void>;
  showActions?: boolean;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  images,
  onDelete,
  showActions = true,
}) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }, []);

  const handleDelete = useCallback(
    async (publicId: string) => {
      if (!onDelete) return;

      try {
        setDeleting(publicId);
        await onDelete(publicId);
      } finally {
        setDeleting(null);
      }
    },
    [onDelete]
  );

  if (images.length === 0) {
    return <div className="text-center py-8 text-slate-500">No images uploaded yet</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.publicId}
          className="group relative bg-slate-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Image */}
          <div className="relative h-48 w-full bg-slate-200">
            <Image
              src={image.url}
              alt={image.title || 'Gallery image'}
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          {image.title && (
            <div className="p-3 bg-white border-t border-slate-200">
              <p className="text-sm font-medium text-slate-900 truncate">{image.title}</p>
              <p className="text-xs text-slate-500 truncate">{image.publicId}</p>
            </div>
          )}

          {/* Actions Overlay */}
          {showActions && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleCopy(image.url)}
                title="Copy URL"
                className={`p-2 rounded-lg transition-colors ${
                  copiedUrl === image.url
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Copy size={18} />
              </button>

              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new tab"
                className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ExternalLink size={18} />
              </a>

              {onDelete && (
                <button
                  onClick={() => handleDelete(image.publicId)}
                  disabled={deleting === image.publicId}
                  title="Delete image"
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageManager;
