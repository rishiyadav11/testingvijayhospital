"use server";

import { prisma } from "@/lib/prisma";
import type { PatientStory } from "@prisma/client";

export interface PatientStoryInput {
  patientName: string;
  age: number;
  specialty: string;
  condition: string;
  story: string;
  icon?: string;
  photoUrl?: string;
  rating?: number;
  recoveryTime: string;
  featured?: boolean;
  status: "DRAFT" | "PUBLISHED";
}

export async function createPatientStory(data: PatientStoryInput) {
  try {
    const created = await prisma.patientStory.create({ data: { ...data, icon: data.icon || "hospital", rating: data.rating || 5, featured: data.featured || false } });
    return { success: true, data: created };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create" };
  }
}

export async function updatePatientStory(id: string, data: Partial<PatientStoryInput>) {
  try {
    const updated = await prisma.patientStory.update({ where: { id }, data });
    return { success: true, data: updated };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update" };
  }
}

export async function deletePatientStory(id: string) {
  try {
    await prisma.patientStory.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete" };
  }
}

export async function getPatientStory(id: string): Promise<PatientStory | null> {
  return prisma.patientStory.findUnique({ where: { id } });
}
