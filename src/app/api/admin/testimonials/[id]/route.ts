import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return false;

  try {
    return token.length > 0;
  } catch {
    return false;
  }
}

// GET - Fetch a single testimonial
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT - Update a testimonial
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      patientName,
      photoUrl,
      recoveryType,
      rating,
      text,
      visitDate,
      featured,
      status,
    } = body;

    // Verify testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        {
          success: false,
          error: "rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ["DRAFT", "PUBLISHED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "status must be DRAFT or PUBLISHED",
        },
        { status: 400 }
      );
    }

    // Build update data object - only include fields that were provided
    const updateData: Record<string, unknown> = {};
    if (patientName !== undefined) updateData.patientName = patientName;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (recoveryType !== undefined) updateData.recoveryType = recoveryType;
    if (rating !== undefined) updateData.rating = rating;
    if (text !== undefined) updateData.text = text;
    if (visitDate !== undefined) updateData.visitDate = visitDate ? new Date(visitDate) : null;
    if (featured !== undefined) updateData.featured = featured;
    if (status !== undefined) updateData.status = status;

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a testimonial
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid testimonial ID" },
        { status: 400 }
      );
    }

    // Verify testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
