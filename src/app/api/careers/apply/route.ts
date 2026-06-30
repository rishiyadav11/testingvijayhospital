import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const experience = formData.get("experience") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resume = formData.get("resume") as File;

    // Validate required fields
    if (!fullName || !email || !phone || !position || !experience || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF or Word document" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Look up the career by position title
    let career = await prisma.career.findFirst({
      where: { title: position },
    });

    // For "General Application" or unmatched positions, use the first active career
    if (!career) {
      career = await prisma.career.findFirst({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!career) {
      return NextResponse.json(
        { error: "No active positions available at this time" },
        { status: 404 }
      );
    }

    // Save resume file to public/uploads/resumes/
    const uploadsDir = join(process.cwd(), "public", "uploads", "resumes");
    await mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const ext = resume.name.split(".").pop();
    const filename = `resume-${timestamp}.${ext}`;
    const filePath = join(uploadsDir, filename);

    const bytes = new Uint8Array(await resume.arrayBuffer());
    await writeFile(filePath, bytes);

    const resumeUrl = `/uploads/resumes/${filename}`;

    // Save application to database
    const application = await prisma.application.create({
      data: {
        careerId: career.id,
        name: fullName,
        email,
        phone,
        resume: resumeUrl,
        coverLetter: coverLetter || null,
        status: "Pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Application submitted successfully! We will review your resume and contact you soon.",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
