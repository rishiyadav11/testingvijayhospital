import { Metadata } from "next";
import FacilitiesPageClient from "./client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Facilities | Vijay Hospital",
  description:
    "Explore state-of-the-art medical facilities at Vijay Hospital. From advanced operating theaters to 24/7 ICU care, we have everything you need for comprehensive healthcare.",
};

export default async function FacilitiesPage() {
  // Fetch all published gallery images for the Photo Tour
  const galleryItems = await prisma.gallery.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 5,
    select: { id: true, title: true, description: true, type: true, mediaUrl: true, category: true, order: true },
  });

  // Fetch Infrastructure-only images for facility card thumbnails
  const infraItems = await prisma.gallery.findMany({
    where: { category: "Infrastructure", status: "PUBLISHED" },
    orderBy: { order: "asc" },
    select: { id: true, title: true, description: true, type: true, mediaUrl: true, category: true, order: true },
  });

  return <FacilitiesPageClient galleryItems={galleryItems} infraItems={infraItems} />;
}
