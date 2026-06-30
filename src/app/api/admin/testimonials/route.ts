import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

// GET - Fetch all testimonials with pagination
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid page or limit" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.testimonial.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST - Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
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

    // Validate required fields
    if (!patientName || !recoveryType || !text) {
      return NextResponse.json(
        {
          success: false,
          error: "patientName, recoveryType, and text are required",
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        {
          success: false,
          error: "rating must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Validate status
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

    const testimonial = await prisma.testimonial.create({
      data: {
        patientName,
        photoUrl: photoUrl || null,
        recoveryType,
        rating: rating || 5,
        text,
        visitDate: visitDate ? new Date(visitDate) : null,
        featured: featured || false,
        status: status || "DRAFT",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: testimonial,
        message: "Testimonial created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
