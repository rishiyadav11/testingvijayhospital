import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAuth(request: NextRequest): boolean {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return !!token && token.length > 0;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAuth(request))
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const story = await prisma.patientStory.findUnique({ where: { id } });
  if (!story)
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: story });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAuth(request))
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { patientName, age, specialty, condition, story, icon, photoUrl, rating, recoveryTime, featured, status } = body;

  const updated = await prisma.patientStory.update({
    where: { id },
    data: {
      ...(patientName !== undefined && { patientName }),
      ...(age !== undefined && { age: parseInt(age) }),
      ...(specialty !== undefined && { specialty }),
      ...(condition !== undefined && { condition }),
      ...(story !== undefined && { story }),
      ...(icon !== undefined && { icon }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(rating !== undefined && { rating: parseInt(rating) }),
      ...(recoveryTime !== undefined && { recoveryTime }),
      ...(featured !== undefined && { featured }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAuth(request))
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.patientStory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
