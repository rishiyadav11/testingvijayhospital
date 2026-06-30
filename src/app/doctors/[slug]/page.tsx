import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoctorDetailClient from "./DoctorDetailClient";
import { doctors } from "@/server/data";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ArrowRight } from "lucide-react";

interface DoctorDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all doctors
export async function generateStaticParams() {
  return doctors.map((doctor) => ({
    slug: doctor.id,
  }));
}

// Generate metadata for each doctor
export async function generateMetadata(
  props: DoctorDetailPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const doctor = doctors.find((d) => d.id === slug);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
      description: "The doctor profile you are looking for does not exist.",
    };
  }

  return {
    title: `${doctor.name} - ${doctor.specialty} at Vijay Hospital`,
    description: `Meet ${doctor.name}, ${doctor.specialty} at Vijay Hospital. ${doctor.bio.slice(0, 100)}...`,
    keywords: [
      doctor.name,
      doctor.specialty,
      "doctor",
      "consultation",
      "Vijay Hospital",
      doctor.qualification,
    ],
    openGraph: {
      title: `${doctor.name} - ${doctor.specialty}`,
      description: `Consult with ${doctor.name}, experienced ${doctor.specialty}`,
      type: "profile",
      url: `/doctors/${doctor.id}`,
    },
  };
}

export default async function DoctorDetailPage(
  props: DoctorDetailPageProps
) {
  const { slug } = await props.params;
  const doctor = doctors.find((d) => d.id === slug);

  if (!doctor) {
    notFound();
  }

  // Get similar doctors
  const similarDoctors = doctors
    .filter((d) => d.specialty === doctor.specialty && d.id !== doctor.id)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
                Home
              </Link>
              <ChevronRight size={16} className="text-slate-400" />
              <Link href="/doctors" className="text-primary hover:text-primary/80 transition-colors">
                Doctors
              </Link>
              <ChevronRight size={16} className="text-slate-400" />
              <span className="text-slate-700 font-medium">{doctor.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
            <DoctorDetailClient doctor={doctor} />
          </div>
        </div>

        {/* Similar Doctors Section */}
        {similarDoctors.length > 0 && (
          <section className="bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 py-16 md:py-24 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Other {doctor.specialty} Specialists
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto">
                  Meet our other expert specialists in {doctor.specialty}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {similarDoctors.map((similarDoctor) => (
                  <Link
                    key={similarDoctor.id}
                    href={`/doctors/${similarDoctor.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300 h-full border border-slate-100 hover:border-primary/20">
                      <div className="text-6xl mb-6">👨‍⚕️</div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-1">
                        {similarDoctor.name}
                      </h3>
                      <p className="text-primary font-semibold mb-3">
                        {similarDoctor.specialty}
                      </p>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {similarDoctor.qualification}
                      </p>
                      <div className="flex items-center justify-center gap-1 mb-6">
                        <span>⭐</span>
                        <span className="font-semibold text-slate-900">
                          {similarDoctor.rating}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>

              {similarDoctors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600 mb-6">
                    No other specialists in this field currently available.
                  </p>
                  <Link href="/doctors">
                    <Button variant="primary">View All Doctors</Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-accent !text-black px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Schedule Your Consultation
              </h2>
              <p className="text-lg !text-black/90 max-w-2xl mx-auto">
                Book an appointment with {doctor.name} and take the first step towards better health. 
                Flexible scheduling and online consultation options available.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/book-appointment" className="inline-block">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-slate-100 font-bold !text-black"
                >
                  Book Appointment
                </Button>
              </Link>
              <a href="tel:+919306710615" className="inline-block">
                <Button
                  size="lg"
                  variant="outline"
                  className="!text-black border-white hover:bg-white/10"
                >
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
