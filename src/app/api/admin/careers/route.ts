import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token ? token.length > 0 : false;
}

function isValidJobStatus(status: unknown): status is JobStatus {
  return typeof status === "string" && ["ACTIVE", "CLOSED", "DRAFT"].includes(status);
}

interface CreateCareerRequest {
  title?: unknown;
  department?: unknown;
  experience?: unknown;
  salary?: unknown;
  jobType?: unknown;
  description?: unknown;
  requirements?: unknown;
  location?: unknown;
  status?: unknown;
}

function validateCreateCareerRequest(body: unknown): { valid: false } | { valid: true; data: CreateCareerRequest } {
  if (!body || typeof body !== "object") {
    return { valid: false };
  }
  return { valid: true, data: body as CreateCareerRequest };
}

// GET - Fetch all careers with pagination
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const [careers, total] = await Promise.all([
      prisma.career.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { applications: true },
          },
        },
      }),
      prisma.career.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        careers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch careers" },
      { status: 500 }
    );
  }
}

// POST - Create a new career
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = validateCreateCareerRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const {
      title,
      department,
      experience,
      salary,
      jobType,
      description,
      requirements,
      location,
      status,
    } = validation.data;

    // Validate required fields
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Validate JobStatus enum
    const jobStatus: JobStatus = isValidJobStatus(status) ? status : "ACTIVE";

    const career = await prisma.career.create({
      data: {
        title: title.trim(),
        department: typeof department === "string" ? department : "",
        experience: typeof experience === "string" ? experience : "",
        salary: typeof salary === "string" ? salary : null,
        jobType: typeof jobType === "string" ? jobType : "Full-time",
        description: typeof description === "string" ? description : "",
        requirements: typeof requirements === "string" ? requirements : "",
        location: typeof location === "string" ? location : "Narnaul",
        status: jobStatus,
      },
    });

    return NextResponse.json(
      { success: true, data: career, message: "Career created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating career:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create career" },
      { status: 500 }
    );
  }
}
