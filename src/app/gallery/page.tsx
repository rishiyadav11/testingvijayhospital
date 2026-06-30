import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery - Vijay Hospital",
  description: "Explore photos of Vijay Hospital — modern facilities, operation theatres, wards, and patient care.",
};

export default async function GalleryPage() {
  const dbItems = await prisma.gallery.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <GalleryClient initialItems={dbItems} />
      </main>
      <Footer />
    </div>
  );
}
