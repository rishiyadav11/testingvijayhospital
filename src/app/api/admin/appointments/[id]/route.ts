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

// GET - Fetch a single appointment
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
        { success: false, error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: appointment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

// PUT - Update appointment
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
        { success: false, error: "Invalid appointment ID" },
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
      patientName?: unknown;
      patientEmail?: unknown;
      patientPhone?: unknown;
      date?: unknown;
      time?: unknown;
      doctorId?: unknown;
      status?: unknown;
      notes?: unknown;
    };

    // Build update data with type validation
    const updateData: {
      patientName?: string;
      patientEmail?: string;
      patientPhone?: string;
      date?: string;
      time?: string;
      doctorId?: string;
      status?: string;
      notes?: string | null;
    } = {};

    if (typedBody.patientName !== undefined) {
      if (typeof typedBody.patientName === "string") {
        updateData.patientName = typedBody.patientName;
      } else {
        return NextResponse.json(
          { success: false, error: "patientName must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.patientEmail !== undefined) {
      if (typeof typedBody.patientEmail === "string") {
        updateData.patientEmail = typedBody.patientEmail;
      } else {
        return NextResponse.json(
          { success: false, error: "patientEmail must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.patientPhone !== undefined) {
      if (typeof typedBody.patientPhone === "string") {
        updateData.patientPhone = typedBody.patientPhone;
      } else {
        return NextResponse.json(
          { success: false, error: "patientPhone must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.date !== undefined) {
      if (typeof typedBody.date === "string") {
        updateData.date = typedBody.date;
      } else {
        return NextResponse.json(
          { success: false, error: "date must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.time !== undefined) {
      if (typeof typedBody.time === "string") {
        updateData.time = typedBody.time;
      } else {
        return NextResponse.json(
          { success: false, error: "time must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.doctorId !== undefined) {
      if (typeof typedBody.doctorId === "string") {
        // Verify doctor exists
        const doctor = await prisma.doctor.findUnique({
          where: { id: typedBody.doctorId },
        });
        if (!doctor) {
          return NextResponse.json(
            { success: false, error: "Doctor not found" },
            { status: 404 }
          );
        }
        updateData.doctorId = typedBody.doctorId;
      } else {
        return NextResponse.json(
          { success: false, error: "doctorId must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.status !== undefined) {
      if (typeof typedBody.status === "string") {
        updateData.status = typedBody.status;
      } else {
        return NextResponse.json(
          { success: false, error: "status must be a string" },
          { status: 400 }
        );
      }
    }

    if (typedBody.notes !== undefined) {
      if (typedBody.notes === null) {
        updateData.notes = null;
      } else if (typeof typedBody.notes === "string") {
        updateData.notes = typedBody.notes;
      } else {
        return NextResponse.json(
          { success: false, error: "notes must be a string or null" },
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

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { doctor: true },
    });

    return NextResponse.json(
      { success: true, data: appointment, message: "Appointment updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete appointment
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
        { success: false, error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
