'use server'

import { revalidatePath } from 'next/cache'

interface GalleryItem {
  id: string
  title: string
  description?: string
  type: 'IMAGE' | 'VIDEO'
  mediaUrl: string
  altText?: string
  category: string
  order: number
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  pagination?: PaginationMeta
}

function getAuthToken() {
  // In production, this should get the token from a secure session/cookie
  // For now, using a temporary token or environment variable
  return process.env.ADMIN_API_TOKEN || 'temp-token'
}

export async function getGalleryItems(page = 1, limit = 20) {
  try {
    const token = getAuthToken()
    const response = await fetch(
      `/api/admin/gallery?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch gallery items')
    }

    const result: ApiResponse<GalleryItem[]> = await response.json()

    if (!result.success) {
      return { success: false, error: 'Failed to fetch gallery items' }
    }

    return {
      success: true,
      data: result.data || [],
      pagination: result.pagination || { page: 1, limit: 20, total: 0, pages: 0 },
    }
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return { success: false, error: 'Failed to fetch gallery items' }
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const token = getAuthToken()
    const response = await fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete gallery item')
    }

    const result: ApiResponse<{ id: string }> = await response.json()

    if (!result.success) {
      return { success: false, error: 'Failed to delete gallery item' }
    }

    revalidatePath('/admin/gallery')
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return { success: false, error: 'Failed to delete gallery item' }
  }
}
