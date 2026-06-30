import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string = 'vijay-hospital'
): Promise<CloudinaryUploadResult> {
  const { promise, resolve, reject } = Promise.withResolvers<CloudinaryUploadResult>();

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: 'auto',
      overwrite: true,
    },
    (error, result) => {
      if (error) {
        reject(new Error(`Cloudinary upload failed: ${error.message}`));
      } else if (result) {
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format,
          width: result.width || 0,
          height: result.height || 0,
          bytes: result.bytes || 0,
        });
      }
    }
  );

  if (typeof file === 'string') {
    uploadStream.end(Buffer.from(file, 'base64'));
  } else {
    uploadStream.end(file);
  }

  return promise;
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();

  cloudinary.uploader.destroy(publicId, (error, result) => {
    if (error) {
      reject(new Error(`Cloudinary delete failed: ${error.message}`));
    } else {
      resolve();
    }
  });

  return promise;
}

/**
 * Get Cloudinary image URL
 */
export function getCloudinaryUrl(publicId: string, options?: Record<string, any>): string {
  return cloudinary.url(publicId, {
    secure: true,
    ...options,
  });
}

/**
 * Transform Cloudinary image URL (resize, quality, etc)
 */
export function transformImageUrl(
  publicId: string,
  width?: number,
  height?: number,
  quality: string = 'auto'
): string {
  return cloudinary.url(publicId, {
    secure: true,
    width,
    height,
    crop: 'fill',
    quality,
  });
}
