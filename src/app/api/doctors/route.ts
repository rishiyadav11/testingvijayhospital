import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public GET — fetch published doctors, optionally filtered by specialty
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");

    const doctors = await prisma.doctor.findMany({
      where: {
        status: "PUBLISHED",
        ...(specialty ? { specialty: { contains: specialty } } : {}),
      },
      select: { id: true, name: true, specialty: true, experience: true, photoUrl: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch doctors" }, { status: 500 });
  }
}
