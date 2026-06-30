import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login without authentication
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect /admin/* routes (except /admin/login)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify JWT token
    const payload = await verifyJWT(token);
    if (!payload) {
      // Token is invalid, redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.next();
  }

  // Define paths that are allowed (not redirected)
  const allowedPaths = [
    "/",
    "/coming-soon",
    "/proposal",
    "/about",
    "/contact",
    "/gallery",
    "/testimonials",
    "/specialties",
    "/doctors",
    "/departments",
    "/facilities",
    "/patient-care",
    "/health-packages",
    "/blogs",
    "/careers",
    "/careers/apply",
    "/book-appointment",
    "/international-patients",
    "/patient-stories",
    "/resources",
    "/help-faqs",
    "/privacy-policy",
    "/terms-of-service",
  ];

  if (
    allowedPaths.includes(pathname) ||
    pathname.startsWith("/blogs/") ||
    pathname.startsWith("/doctors/") ||
    pathname.startsWith("/departments/") ||
    pathname.startsWith("/patient-stories/") ||
    pathname.startsWith("/facilities/") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // static files like logo.png, hero_consultation.jpg, etc.
  ) {
    return NextResponse.next();
  }

  // Redirect all other pages to /coming-soon
  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
