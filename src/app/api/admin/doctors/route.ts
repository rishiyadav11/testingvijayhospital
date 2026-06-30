import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { Status } from "@prisma/client";

interface AuthRequest extends NextRequest {
  headers: Headers & { get: (key: string) => string | null };
}

interface DoctorFilters {
  department?: string;
  specialty?: string;
  status?: Status;
}

function verifyAuth(request: AuthRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return false;

  try {
    return token.length > 0;
  } catch {
    return false;
  }
}

// GET - Fetch all doctors with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request as AuthRequest)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const department = searchParams.get("department") || undefined;
    const specialty = searchParams.get("specialty") || undefined;
    const status = (searchParams.get("status") as Status) || undefined;

    const skip = (page - 1) * limit;

    const filters: DoctorFilters = {};
    if (department) filters.department = department;
    if (specialty) filters.specialty = specialty;
    if (status) filters.status = status;

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.doctor.count({ where: filters }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: doctors,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctors:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Failed to fetch doctors: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST - Create a new doctor
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request as AuthRequest)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json() as unknown;

    // Validate body structure
    if (
      !body ||
      typeof body !== "object" ||
      !("name" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: name",
        },
        { status: 400 }
      );
    }

    const typedBody = body as {
      name: unknown;
      photoUrl?: unknown;
      specialty?: unknown;
      qualifications?: unknown;
      experience?: unknown;
      bio?: unknown;
      department?: unknown;
      status?: unknown;
    };

    const {
      name,
      photoUrl = null,
      specialty = null,
      qualifications = "",
      experience = "0 years",
      bio = null,
      department = "General",
      status = "DRAFT",
    } = typedBody;

    // Validate field types
    if (typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "name must be a string" },
        { status: 400 }
      );
    }

    if (name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "name cannot be empty" },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (photoUrl !== null && typeof photoUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "photoUrl must be a string or null" },
        { status: 400 }
      );
    }

    if (specialty !== null && typeof specialty !== "string") {
      return NextResponse.json(
        { success: false, error: "specialty must be a string or null" },
        { status: 400 }
      );
    }

    if (typeof qualifications !== "string") {
      return NextResponse.json(
        { success: false, error: "qualifications must be a string" },
        { status: 400 }
      );
    }

    if (typeof experience !== "string") {
      return NextResponse.json(
        { success: false, error: "experience must be a string" },
        { status: 400 }
      );
    }

    if (bio !== null && typeof bio !== "string") {
      return NextResponse.json(
        { success: false, error: "bio must be a string or null" },
        { status: 400 }
      );
    }

    if (typeof department !== "string") {
      return NextResponse.json(
        { success: false, error: "department must be a string" },
        { status: 400 }
      );
    }

    if (typeof status !== "string") {
      return NextResponse.json(
        { success: false, error: "status must be a string" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        photoUrl: photoUrl && typeof photoUrl === "string" ? photoUrl : null,
        specialty: specialty && typeof specialty === "string" ? specialty : null,
        qualifications: qualifications || "",
        experience: experience || "0 years",
        bio: bio && typeof bio === "string" ? bio : null,
        department: department || "General",
        status: (status as "DRAFT" | "PUBLISHED") || "DRAFT",
      },
    });

    return NextResponse.json(
      { success: true, data: doctor, message: "Doctor created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating doctor:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Failed to create doctor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
