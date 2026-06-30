import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAuth(request: NextRequest): boolean {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return !!token && token.length > 0;
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request))
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "10"));
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const where: Record<string, unknown> = {};
  if (search) where.patientName = { contains: search };
  if (status) where.status = status;

  const [stories, total] = await Promise.all([
    prisma.patientStory.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.patientStory.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: stories,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request))
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { patientName, age, specialty, condition, story, icon, photoUrl, rating, recoveryTime, featured, status } = body;

  if (!patientName || !specialty || !condition || !story || !recoveryTime)
    return NextResponse.json({ success: false, error: "Required fields missing" }, { status: 400 });

  const created = await prisma.patientStory.create({
    data: {
      patientName,
      age: parseInt(age) || 30,
      specialty,
      condition,
      story,
      icon: icon || "hospital",
      photoUrl: photoUrl || null,
      rating: parseInt(rating) || 5,
      recoveryTime,
      featured: featured || false,
      status: status || "DRAFT",
    },
  });

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
