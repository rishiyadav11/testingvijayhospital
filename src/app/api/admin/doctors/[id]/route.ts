import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface AuthRequest extends NextRequest {
  headers: Headers & { get: (key: string) => string | null };
}

interface RouteParams {
  params: Promise<{ id: string }>;
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

// GET - Fetch a single doctor
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (!verifyAuth(request as AuthRequest)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { appointments: true },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: doctor },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

// PUT - Update doctor
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!verifyAuth(request as AuthRequest)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    const body = await request.json() as unknown;

    // Validate body structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const typedBody = body as {
      name?: unknown;
      photoUrl?: unknown;
      specialty?: unknown;
      qualifications?: unknown;
      experience?: unknown;
      bio?: unknown;
      department?: unknown;
      status?: unknown;
    };

    // Build update data with type validation
    const updateData: {
      name?: string;
      photoUrl?: string | null;
      specialty?: string | null;
      qualifications?: string;
      experience?: string;
      bio?: string | null;
      department?: string;
      status?: "DRAFT" | "PUBLISHED";
    } = {};

    if (typedBody.name !== undefined) {
      if (typeof typedBody.name === "string" && typedBody.name.trim().length > 0) {
        updateData.name = typedBody.name.trim();
      } else {
        return NextResponse.json(
          { success: false, error: "name must be a non-empty string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.photoUrl !== undefined) {
      if (typedBody.photoUrl === null || typeof typedBody.photoUrl === "string") {
        updateData.photoUrl = typedBody.photoUrl;
      } else {
        return NextResponse.json(
          { success: false, error: "photoUrl must be a string or null" },
          { status: 400 }
        );
      }
    }

    if (typedBody.specialty !== undefined) {
      if (typedBody.specialty === null || typeof typedBody.specialty === "string") {
        updateData.specialty = typedBody.specialty;
      } else {
        return NextResponse.json(
          { success: false, error: "specialty must be a string or null" },
          { status: 400 }
        );
      }
    }

    if (typedBody.qualifications !== undefined) {
      if (typeof typedBody.qualifications === "string") {
        updateData.qualifications = typedBody.qualifications;
      } else {
        return NextResponse.json(
          { success: false, error: "qualifications must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.experience !== undefined) {
      if (typeof typedBody.experience === "string") {
        updateData.experience = typedBody.experience;
      } else {
        return NextResponse.json(
          { success: false, error: "experience must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.bio !== undefined) {
      if (typedBody.bio === null || typeof typedBody.bio === "string") {
        updateData.bio = typedBody.bio;
      } else {
        return NextResponse.json(
          { success: false, error: "bio must be a string or null" },
          { status: 400 }
        );
      }
    }

    if (typedBody.department !== undefined) {
      if (typeof typedBody.department === "string") {
        updateData.department = typedBody.department;
      } else {
        return NextResponse.json(
          { success: false, error: "department must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.status !== undefined) {
      if (typedBody.status === "DRAFT" || typedBody.status === "PUBLISHED") {
        updateData.status = typedBody.status;
      } else {
        return NextResponse.json(
          { success: false, error: "status must be DRAFT or PUBLISHED" },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!existingDoctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: updateData,
      include: { appointments: true },
    });

    return NextResponse.json(
      { success: true, data: doctor, message: "Doctor updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

// DELETE - Delete doctor
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!verifyAuth(request as AuthRequest)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid doctor ID" },
        { status: 400 }
      );
    }

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    await prisma.doctor.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
