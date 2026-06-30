"use server";

import type { Blog } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BlogSchema, type BlogInput } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { generateSlug, calculateReadTime } from "@/lib/content-utils";

/**
 * Check if a slug is unique (for new blogs or when updating)
 */
async function isSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.blog.findUnique({
    where: { slug },
  });

  // If no existing blog with this slug, it's unique
  if (!existing) return true;

  // If updating and the slug belongs to the same blog, it's unique
  if (excludeId && existing.id === excludeId) return true;

  return false;
}

/**
 * Create a new blog post
 */
export async function createBlog(
  data: BlogInput
): Promise<{ success: boolean; data?: Blog; error?: string }> {
  try {
    // Validate input
    const validated = BlogSchema.parse(data);

    // Generate slug if not provided
    let slug = validated.slug;
    if (!slug) {
      slug = generateSlug(validated.title);
    }

    // Check if slug is unique
    const isUnique = await isSlugUnique(slug);
    if (!isUnique) {
      return {
        success: false,
        error: "Slug already exists. Please choose a different title or slug.",
      };
    }

    // Calculate read time if not provided
    const readTime = validated.readTime || calculateReadTime(validated.content);

    // Create blog
    const blog = await prisma.blog.create({
      data: {
        ...validated,
        publishedAt: validated.publishedAt && validated.publishedAt.trim() !== ""
          ? new Date(validated.publishedAt)
          : null,
        slug,
        readTime,
      },
    });

    // Revalidate blog pages
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");

    return { success: true, data: blog };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create blog",
    };
  }
}

/**
 * Update a blog post
 */
export async function updateBlog(
  id: string,
  data: BlogInput
): Promise<{ success: boolean; data?: Blog; error?: string }> {
  try {
    const validated = BlogSchema.parse(data);

    // Check if blog exists
    const existing = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Blog not found" };
    }

    // Generate slug if not provided
    let slug = validated.slug || existing.slug;
    if (!slug) {
      slug = generateSlug(validated.title);
    }

    // Check if slug is unique (excluding current blog)
    const isUnique = await isSlugUnique(slug, id);
    if (!isUnique) {
      return {
        success: false,
        error: "Slug already exists. Please choose a different title or slug.",
      };
    }

    // Calculate read time if not provided
    const readTime = validated.readTime || calculateReadTime(validated.content);

    // Update blog
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...validated,
        publishedAt: validated.publishedAt && validated.publishedAt.trim() !== ""
          ? new Date(validated.publishedAt)
          : null,
        slug,
        readTime,
      },
    });

    // Revalidate blog pages
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");

    return { success: true, data: blog };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update blog",
    };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlog(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.blog.delete({
      where: { id },
    });

    // Revalidate blog pages
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete blog",
    };
  }
}

/**
 * Get all blogs with optional filtering
 */
export async function getBlogs(filters?: {
  status?: string;
  category?: string;
  searchQuery?: string;
}): Promise<Blog[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.searchQuery && {
          OR: [
            { title: { contains: filters.searchQuery, mode: "insensitive" as any } },
            { excerpt: { contains: filters.searchQuery, mode: "insensitive" as any } },
            {
              content: { contains: filters.searchQuery, mode: "insensitive" as any },
            },
          ],
        }),
      } as any,
      orderBy: { createdAt: "desc" },
    });

    return blogs;
  } catch (error) {
    console.error("Failed to get blogs:", error);
    return [];
  }
}

/**
 * Get a single blog by ID
 */
export async function getBlog(id: string): Promise<Blog | null> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    return blog;
  } catch (error) {
    console.error("Failed to get blog:", error);
    return null;
  }
}
