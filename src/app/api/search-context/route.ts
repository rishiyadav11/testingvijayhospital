import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SPECIALITIES } from "@/lib/constants";

export async function GET() {
  try {
    // 1. Fetch published doctors
    const doctors = await prisma.doctor.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, name: true, department: true }
    });

    // 2. Fetch published blogs
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, title: true, excerpt: true }
    });

    // 3. Construct static departments
    const departments = SPECIALITIES.map(spec => ({
      id: spec.id,
      title: spec.name,
      category: "department" as const,
      url: `/departments/${spec.id}`,
      description: spec.description
    }));

    // 4. Construct static pages (All public pages except admin)
    const pages = [
      { id: "about", title: "About Us", category: "page" as const, url: "/about", description: "Learn about our hospital history, values, and leadership" },
      { id: "facilities", title: "Facilities & Infrastructure", category: "page" as const, url: "/facilities", description: "State-of-the-art facilities, ICU, OPD, and emergency services" },
      { id: "book", title: "Book Appointment", category: "page" as const, url: "/book-appointment", description: "Schedule a doctor consultation online" },
      { id: "patient-stories", title: "Patient Success Stories", category: "page" as const, url: "/patient-stories", description: "Read reviews and success stories from our recovered patients" },
      { id: "packages", title: "Health Packages", category: "page" as const, url: "/health-packages", description: "Preventative health checkup packages" },
      { id: "careers", title: "Careers & Jobs", category: "page" as const, url: "/careers", description: "Join our medical and nursing team" },
      { id: "contact", title: "Contact Us", category: "page" as const, url: "/contact", description: "Get our address, phone number, and directions" },
      { id: "help-faqs", title: "FAQs & Help", category: "page" as const, url: "/help-faqs", description: "Frequently asked questions about billing, services, and visiting" },
      { id: "resources", title: "Health Resources", category: "page" as const, url: "/resources", description: "Patient guides, brochures, and wellness tips" },
      { id: "international", title: "International Patients", category: "page" as const, url: "/international-patients", description: "Services and assistance for overseas patients" },
      { id: "testimonials", title: "Testimonials & Reviews", category: "page" as const, url: "/testimonials", description: "What patients say about Vijay Hospital" },
      { id: "blogs-list", title: "Blogs & Health Articles", category: "page" as const, url: "/blogs", description: "Read articles written by medical experts" },
      { id: "doctors-list", title: "Find a Doctor", category: "page" as const, url: "/doctors", description: "Search our team of qualified physicians and surgeons" }
    ];

    // 5. Construct dynamic items
    const doctorItems = doctors.map(doc => ({
      id: doc.slug || doc.name.toLowerCase().replace(/\s+/g, "-"),
      title: doc.name,
      category: "doctor" as const,
      url: `/doctors/${doc.slug || doc.name.toLowerCase().replace(/\s+/g, "-")}`,
      description: `${doc.department} Specialist`
    }));

    const blogItems = blogs.map(b => ({
      id: b.slug || b.title.toLowerCase().replace(/\s+/g, "-"),
      title: b.title,
      category: "blog" as const,
      url: `/blogs/${b.slug || b.title.toLowerCase().replace(/\s+/g, "-")}`,
      description: b.excerpt || undefined
    }));

    // 6. Combine all items
    const searchItems = [
      ...departments,
      ...pages,
      ...doctorItems,
      ...blogItems
    ];

    return NextResponse.json({ searchItems });
  } catch (error) {
    console.error("Error generating search context:", error);
    return NextResponse.json({ error: "Failed to generate search context" }, { status: 500 });
  }
}
