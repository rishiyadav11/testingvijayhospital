import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function verifyAuth(request: NextRequest): boolean {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  return !!(token && token.length > 0);
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      prisma.gallery.findMany({ where, orderBy: [{ order: "asc" }, { createdAt: "desc" }], skip, take: limit }),
      prisma.gallery.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { title, description, type, mediaUrl, altText, category, order, status } = body;
    if (!title || !mediaUrl || !category) {
      return NextResponse.json({ success: false, error: "title, mediaUrl and category are required" }, { status: 400 });
    }
    const item = await prisma.gallery.create({
      data: {
        title: String(title), description: description ? String(description) : null,
        type: type || "IMAGE", mediaUrl: String(mediaUrl), altText: altText ? String(altText) : null,
        category: String(category), order: Number(order) || 0, status: status || "PUBLISHED",
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create gallery item" }, { status: 500 });
  }
}
