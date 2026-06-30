import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Accreditations from "@/components/Accreditations";
import Specialities from "@/components/Specialities";
import DoctorDirectory from "@/components/DoctorDirectory";
import Infrastructure from "@/components/Infrastructure";
import Testimonials from "@/components/Testimonials";
import BookingSection from "@/components/BookingSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhyChooseUs from "@/components/WhyChooseUs";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const dbTestimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 10,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Top Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        <HeroSection />
        <Accreditations />
        <Specialities />
        <DoctorDirectory />
        <Infrastructure />
        <WhyChooseUs />
        <Testimonials reviews={dbTestimonials} />
        <BookingSection />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

