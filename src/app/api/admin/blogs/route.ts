import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token ? token.length > 0 : false;
}

function isValidStatus(status: unknown): status is Status {
  return typeof status === "string" && ["DRAFT", "PUBLISHED"].includes(status);
}

interface CreateBlogRequest {
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  featuredImageUrl?: unknown;
  category?: unknown;
  tags?: unknown;
  author?: unknown;
  status?: unknown;
}

// GET - Fetch all blogs with pagination
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid page or limit" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      message: "Blogs retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST - Create a new blog
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const req = body as CreateBlogRequest;
    const {
      title,
      excerpt,
      content,
      featuredImageUrl,
      category,
      tags,
      author,
      status,
      slug,
      keywords,
      readTime,
      publishedAt,
      seoTitle,
      seoDesc,
    } = req as typeof req & {
      slug?: string; keywords?: string; readTime?: string;
      publishedAt?: string; seoTitle?: string; seoDesc?: string;
    };

    // Validate required fields
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    // Validate and set optional fields
    const blogStatus = isValidStatus(status) ? status : "DRAFT";
    const blogAuthor = typeof author === "string" && author.trim() ? author : "Admin";
    const blogCategory = typeof category === "string" && category.trim() ? category : "Health Tips";
    const blogExcerpt =
      typeof excerpt === "string" && excerpt.trim()
        ? excerpt
        : content.substring(0, 160);
    const blogFeaturedImageUrl =
      typeof featuredImageUrl === "string" ? featuredImageUrl : null;

    // Handle tags - can be array or JSON string
    let blogTags: string | null = null;
    if (tags) {
      if (typeof tags === "string") {
        blogTags = tags;
      } else if (Array.isArray(tags)) {
        blogTags = JSON.stringify(tags);
      }
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug: typeof slug === 'string' && slug.trim() ? slug.trim() : undefined,
        content,
        excerpt: blogExcerpt,
        featuredImageUrl: blogFeaturedImageUrl,
        category: blogCategory,
        tags: blogTags,
        author: blogAuthor,
        status: blogStatus,
        keywords: typeof keywords === 'string' ? keywords : '',
        readTime: typeof readTime === 'string' && readTime ? readTime : '5 min',
        publishedAt: publishedAt ? new Date(publishedAt) : (blogStatus === 'PUBLISHED' ? new Date() : null),
        seoTitle: typeof seoTitle === 'string' ? seoTitle : null,
        seoDesc: typeof seoDesc === 'string' ? seoDesc : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: blog,
        message: "Blog created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
