'use server'

import { prisma } from '@/lib/prisma'
import { DoctorSchema, type DoctorInput } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { order: 'asc' },
    })
    return { success: true, data: doctors }
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return { success: false, error: 'Failed to fetch doctors' }
  }
}

export async function getDoctor(id: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    })
    if (!doctor) {
      return { success: false, error: 'Doctor not found' }
    }
    return { success: true, data: doctor }
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return { success: false, error: 'Failed to fetch doctor' }
  }
}

export async function createDoctor(data: Partial<DoctorInput>) {
  try {
    // Validate input
    const validated = DoctorSchema.parse(data)

    // Check if slug is unique
    if (validated.slug) {
      const existing = await prisma.doctor.findUnique({
        where: { slug: validated.slug },
      })
      if (existing) {
        return { success: false, error: 'Slug already exists' }
      }
    }

    // Generate slug from name if not provided
    let slug = validated.slug
    if (!slug) {
      slug = validated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Check for uniqueness
      let finalSlug = slug
      let counter = 1
      while (true) {
        const existing = await prisma.doctor.findUnique({
          where: { slug: finalSlug },
        })
        if (!existing) {
          slug = finalSlug
          break
        }
        finalSlug = `${slug}-${counter}`
        counter++
      }
    }

    const doctor = await prisma.doctor.create({
      data: {
        ...validated,
        slug,
      },
    })

    revalidatePath('/admin/doctors')
    return { success: true, data: doctor }
  } catch (error) {
    console.error('Error creating doctor:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create doctor' }
  }
}

export async function updateDoctor(id: string, data: Partial<DoctorInput>) {
  try {
    // Validate input
    const validated = DoctorSchema.partial().parse(data)

    // Check if slug is unique (excluding current doctor)
    if (validated.slug) {
      const existing = await prisma.doctor.findUnique({
        where: { slug: validated.slug },
      })
      if (existing && existing.id !== id) {
        return { success: false, error: 'Slug already exists' }
      }
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/admin/doctors')
    revalidatePath(`/admin/doctors/${id}`)
    return { success: true, data: doctor }
  } catch (error) {
    console.error('Error updating doctor:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update doctor' }
  }
}

export async function deleteDoctor(id: string) {
  try {
    // Soft delete - set status to DRAFT
    const doctor = await prisma.doctor.update({
      where: { id },
      data: { status: 'DRAFT' },
    })

    revalidatePath('/admin/doctors')
    return { success: true, data: doctor }
  } catch (error) {
    console.error('Error deleting doctor:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to delete doctor' }
  }
}

export async function checkSlugExists(slug: string, excludeId?: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { slug },
    })
    
    if (!doctor) {
      return { exists: false }
    }
    
    if (excludeId && doctor.id === excludeId) {
      return { exists: false }
    }
    
    return { exists: true }
  } catch (error) {
    console.error('Error checking slug:', error)
    return { exists: false }
  }
}
