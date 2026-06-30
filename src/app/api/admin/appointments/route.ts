import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface AuthRequest extends NextRequest {
  headers: Headers & { get: (key: string) => string | null };
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

interface AppointmentFilters {
  doctorId?: string;
  date?: string;
  status?: string;
}

// GET - Fetch all appointments with pagination and filtering
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
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const doctorId = searchParams.get("doctorId") || undefined;
    const date = searchParams.get("date") || undefined;
    const status = searchParams.get("status") || undefined;

    const skip = (page - 1) * limit;

    const filters: AppointmentFilters = {};
    if (doctorId) filters.doctorId = doctorId;
    if (date) filters.date = date;
    if (status) filters.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: filters,
        include: { doctor: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.appointment.count({ where: filters }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: appointments,
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
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST - Create a new appointment
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
      !("patientName" in body) ||
      !("patientEmail" in body) ||
      !("patientPhone" in body) ||
      !("date" in body) ||
      !("time" in body) ||
      !("doctorId" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: patientName, patientEmail, patientPhone, date, time, doctorId",
        },
        { status: 400 }
      );
    }

    const typedBody = body as {
      patientName: unknown;
      patientEmail: unknown;
      patientPhone: unknown;
      date: unknown;
      time: unknown;
      doctorId: unknown;
      status?: unknown;
      notes?: unknown;
    };

    const {
      patientName,
      patientEmail,
      patientPhone,
      date,
      time,
      doctorId,
      status = "Pending",
      notes = null,
    } = typedBody;

    // Validate field types
    if (
      typeof patientName !== "string" ||
      typeof patientEmail !== "string" ||
      typeof patientPhone !== "string" ||
      typeof date !== "string" ||
      typeof time !== "string" ||
      typeof doctorId !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        patientEmail,
        patientPhone,
        date,
        time,
        doctorId,
        status: typeof status === "string" ? status : "Pending",
        notes: typeof notes === "string" ? notes : null,
      },
      include: { doctor: true },
    });

    return NextResponse.json(
      { success: true, data: appointment, message: "Appointment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
