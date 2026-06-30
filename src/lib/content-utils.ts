/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .slice(0, 200); // Limit length
}

/**
 * Calculate reading time based on word count (avg 200 words per minute)
 */
export function calculateReadTime(content: string): string {
  const wordCount = content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min`;
}

/**
 * Sanitize HTML content to prevent XSS (basic version)
 */
export function sanitizeHTML(content: string): string {
  // Basic sanitization - in production, use DOMPurify
  return content
    .replace(/script>/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/javascript:/gi, "");
}
