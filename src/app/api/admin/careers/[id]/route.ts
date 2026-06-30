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

interface UpdateCareerRequest {
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

function validateUpdateCareerRequest(body: unknown): { valid: false } | { valid: true; data: UpdateCareerRequest } {
  if (!body || typeof body !== "object") {
    return { valid: false };
  }
  return { valid: true, data: body as UpdateCareerRequest };
}

// GET - Fetch a single career
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

    const career = await prisma.career.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    });

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: career });
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch career" },
      { status: 500 }
    );
  }
}

// PUT - Update a career
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

    const body = await request.json();
    const validation = validateUpdateCareerRequest(body);

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

    // Verify career exists
    const existingCareer = await prisma.career.findUnique({
      where: { id },
    });

    if (!existingCareer) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    // Build update data with type safety
    const updateData: Record<string, unknown> = {};

    if (typeof title === "string" && title.trim()) {
      updateData.title = title.trim();
    }
    if (typeof department === "string") {
      updateData.department = department;
    }
    if (typeof experience === "string") {
      updateData.experience = experience;
    }
    if (typeof salary === "string") {
      updateData.salary = salary;
    }
    if (typeof jobType === "string") {
      updateData.jobType = jobType;
    }
    if (typeof description === "string") {
      updateData.description = description;
    }
    if (typeof requirements === "string") {
      updateData.requirements = requirements;
    }
    if (typeof location === "string") {
      updateData.location = location;
    }
    if (isValidJobStatus(status)) {
      updateData.status = status;
    }

    const career = await prisma.career.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: career,
      message: "Career updated successfully",
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update career" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a career
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

    // Verify career exists before deleting
    const career = await prisma.career.findUnique({
      where: { id },
    });

    if (!career) {
      return NextResponse.json(
        { success: false, error: "Career not found" },
        { status: 404 }
      );
    }

    await prisma.career.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting career:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete career" },
      { status: 500 }
    );
  }
}
