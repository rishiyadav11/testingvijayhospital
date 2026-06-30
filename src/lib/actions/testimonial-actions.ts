"use server";

import type { Testimonial } from "@prisma/client";
import { TestimonialSchema, type TestimonialInput } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

/**
 * Create a new testimonial
 */
export async function createTestimonial(
  data: TestimonialInput
): Promise<{ success: boolean; data?: Testimonial; error?: string }> {
  try {
    const validated = TestimonialSchema.parse(data);

    const testimonial = await prisma.testimonial.create({
      data: {
        patientName: validated.patientName,
        photoUrl: validated.photoUrl,
        recoveryType: validated.recoveryType,
        rating: validated.rating,
        text: validated.text,
        visitDate: validated.visitDate ? new Date(validated.visitDate) : null,
        featured: validated.featured,
        status: validated.status,
      },
    });

    return { success: true, data: testimonial };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial";
    return { success: false, error: message };
  }
}

/**
 * Update a testimonial
 */
export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialInput>
): Promise<{ success: boolean; data?: Testimonial; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: "Testimonial ID is required" };
    }

    // Validate only the fields that are being updated
    const updateData: Record<string, unknown> = {};

    if (data.patientName !== undefined) {
      updateData.patientName = data.patientName;
    }
    if (data.photoUrl !== undefined) {
      updateData.photoUrl = data.photoUrl;
    }
    if (data.recoveryType !== undefined) {
      updateData.recoveryType = data.recoveryType;
    }
    if (data.rating !== undefined) {
      updateData.rating = data.rating;
    }
    if (data.text !== undefined) {
      updateData.text = data.text;
    }
    if (data.visitDate !== undefined) {
      updateData.visitDate = data.visitDate ? new Date(data.visitDate) : null;
    }
    if (data.featured !== undefined) {
      updateData.featured = data.featured;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: testimonial };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return { success: false, error: message };
  }
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: "Testimonial ID is required" };
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete testimonial";
    return { success: false, error: message };
  }
}

/**
 * Get a single testimonial by ID
 */
export async function getTestimonial(
  id: string
): Promise<Testimonial | null> {
  try {
    return await prisma.testimonial.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return null;
  }
}
