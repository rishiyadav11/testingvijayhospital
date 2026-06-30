import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

/**
 * Verify admin authentication from Authorization header
 */
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token ? token.length > 0 : false;
}

/**
 * POST /api/admin/upload
 * Upload file to Cloudinary
 * Body: FormData with 'file' (required) and 'folder' (optional) fields
 * Returns: { success: boolean, url: string, public_id: string, error?: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "vijay-hospital";

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, folder);

    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload file";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/upload
 * Delete file from Cloudinary by public_id
 * Body: { public_id: string }
 * Returns: { success: boolean, error?: string, message?: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get public_id from request body
    const body = await request.json();
    const { public_id } = body;

    // Validate public_id exists
    if (!public_id) {
      return NextResponse.json(
        { success: false, error: "public_id is required" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(public_id);

    return NextResponse.json(
      {
        success: true,
        message: "File deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete file";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
