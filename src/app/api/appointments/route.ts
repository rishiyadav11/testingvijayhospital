import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public POST — no auth required, patients book their own appointments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientName, patientPhone, patientEmail, doctorId, date, time, age, gender, symptoms } = body;

    if (!patientName || !patientPhone || !doctorId || !date || !time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, phone, doctor, date, time" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return NextResponse.json({ success: false, error: "Doctor not found" }, { status: 404 });
    }

    const notes = [
      age ? `Age: ${age}` : null,
      gender ? `Gender: ${gender}` : null,
      symptoms ? `Symptoms: ${symptoms}` : null,
    ].filter(Boolean).join(" | ") || null;

    const appointment = await prisma.appointment.create({
      data: {
        patientName: String(patientName),
        patientEmail: String(patientEmail || ""),
        patientPhone: String(patientPhone),
        date: String(date),
        time: String(time),
        doctorId: String(doctorId),
        status: "Pending",
        notes,
      },
      include: { doctor: { select: { name: true, specialty: true } } },
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ success: false, error: "Failed to book appointment" }, { status: 500 });
  }
}
