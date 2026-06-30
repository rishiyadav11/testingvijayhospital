import { z } from "zod";

// Doctor Schema
export const DoctorSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  photo: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  availableDays: z.string().optional(),
  timeSlots: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  order: z.number().int().default(0),
});

export type DoctorInput = z.infer<typeof DoctorSchema>;

// Blog Schema
export const BlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().max(160, "Excerpt must be 160 characters or less").optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  featuredImageUrl: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  author: z.string().default("Admin"),
  publishedAt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  keywords: z.string().optional(),
  readTime: z.string().optional(),
});

export type BlogInput = z.infer<typeof BlogSchema>;

// Gallery Schema
export const GallerySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().url("Must be a valid URL"),
  altText: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type GalleryInput = z.infer<typeof GallerySchema>;

// Career Schema
export const CareerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().toLowerCase().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only").optional(),
  department: z.string().optional(),
  experience: z.string().optional(),
  salary: z.string().optional(),
  jobType: z.enum(["Full-time", "Part-time", "Contract"]).default("Full-time"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
  location: z.string().default("Narnaul"),
  status: z.enum(["ACTIVE", "CLOSED", "DRAFT"]).default("ACTIVE"),
  expiresAt: z.string().optional(),
});

export type CareerInput = z.infer<typeof CareerSchema>;

// Testimonial Schema
export const TestimonialSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  photoUrl: z.string().optional(),
  recoveryType: z.string().min(2, "Recovery type is required"),
  rating: z.number().min(1).max(5).int(),
  text: z.string().min(10).max(500, "Testimonial must be 500 characters or less"),
  visitDate: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type TestimonialInput = z.infer<typeof TestimonialSchema>;

// Login Schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
