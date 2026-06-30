import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token ? token.length > 0 : false;
}

// GET - List uploaded images
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, you'd query a database or cloud storage
    // For now, return a placeholder response
    const images = [
      {
        id: "1",
        name: "hospital-facility.jpg",
        url: "/emergency_room.png",
        uploadedAt: new Date().toISOString(),
        size: "2.5 MB",
      },
      {
        id: "2",
        name: "doctor-team.jpg",
        url: "/hero_doctor.png",
        uploadedAt: new Date().toISOString(),
        size: "3.1 MB",
      },
    ];

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

// POST - Upload image
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `hospital-${timestamp}.${ext}`;

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    // For now, simulate successful upload
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      image: {
        id: timestamp.toString(),
        name: filename,
        url: imageUrl,
        uploadedAt: new Date().toISOString(),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
