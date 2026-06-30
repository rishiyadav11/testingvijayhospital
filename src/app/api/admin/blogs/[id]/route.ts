import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token ? token.length > 0 : false;
}

function isValidStatus(status: unknown): status is Status {
  return typeof status === "string" && ["DRAFT", "PUBLISHED"].includes(status);
}

interface UpdateBlogRequest {
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  featuredImageUrl?: unknown;
  category?: unknown;
  tags?: unknown;
  author?: unknown;
  status?: unknown;
}

// GET - Fetch a single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Blog retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT - Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const req = body as UpdateBlogRequest;
    const {
      title,
      excerpt,
      content,
      featuredImageUrl,
      category,
      tags,
      author,
      status,
    } = req;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};

    if (typeof title === "string" && title.trim()) {
      updateData.title = title;
    }

    if (typeof content === "string" && content.trim()) {
      updateData.content = content;
    }

    if (typeof excerpt === "string" && excerpt.trim()) {
      updateData.excerpt = excerpt;
    }

    if (featuredImageUrl !== undefined) {
      updateData.featuredImageUrl = typeof featuredImageUrl === "string" ? featuredImageUrl : null;
    }

    if (typeof category === "string" && category.trim()) {
      updateData.category = category;
    }

    if (typeof author === "string" && author.trim()) {
      updateData.author = author;
    }

    if (isValidStatus(status)) {
      updateData.status = status;
    }

    if (tags !== undefined) {
      if (typeof tags === "string") {
        updateData.tags = tags;
      } else if (Array.isArray(tags)) {
        updateData.tags = JSON.stringify(tags);
      } else {
        updateData.tags = null;
      }
    }

    // Perform update only if there are changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: { id },
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
