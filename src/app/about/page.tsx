import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Heart, Star, CheckCircle2, Zap, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Vijay Hospital's 25+ year legacy of healthcare excellence in Narnaul, Haryana.",
};

export default function AboutPage() {
  const timeline = [
    {
      year: "1998",
      title: "Foundation",
      description: "Vijay Hospital established with vision to serve the community",
    },
    {
      year: "2005",
      title: "Expansion",
      description: "Extended facilities and added multiple specialties",
    },
    {
      year: "2015",
      title: "NABH Accreditation",
      description: "Achieved National Accreditation Board for Hospital accreditation",
    },
    {
      year: "2020",
      title: "PM-JAY Empanelment",
      description: "Recognized as Ayushman Bharat PM-JAY empanelled hospital",
    },
    {
      year: "2024",
      title: "Digital Transformation",
      description: "Launched online appointment booking and telemedicine services",
    },
  ];

  const values = [
    {
      icon: <Heart className="w-10 h-10 text-rose-500" />,
      title: "Compassion",
      description: "Treating every patient with empathy and care",
    },
    {
      icon: <Star className="w-10 h-10 text-amber-500 fill-amber-500" />,
      title: "Excellence",
      description: "Delivering highest standards of medical care",
    },
    {
      icon: <CheckCircle2 className="w-10 h-10 text-emerald-500" />,
      title: "Integrity",
      description: "Operating with honesty and transparency",
    },
    {
      icon: <Zap className="w-10 h-10 text-sky-500" />,
      title: "Innovation",
      description: "Adopting latest technologies and practices",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-20 md:py-32">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              About Vijay Hospital
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              For over 25 years, we've been committed to providing comprehensive, compassionate healthcare to the communities we serve. Our journey is marked by a dedication to excellence, innovation, and patient-centered care.
            </p>
            <Link href="/contact">
              <Button size="lg">Get In Touch</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                To provide accessible, high-quality healthcare that improves the health and well-being of every individual and family we serve, with integrity, compassion, and excellence as our guiding principles.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe that everyone deserves quality healthcare without financial burden, and we strive to make that a reality through our cashless treatment options and insurance partnerships.
              </p>
            </div>
            <div className="bg-primary/10 rounded-2xl p-8 h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">25+</div>
                <p className="text-2xl text-slate-900 font-semibold">Years of Service</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision */}
      <section className="py-20 md:py-32 bg-slate-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-accent/10 rounded-2xl p-8 h-[400px] flex items-center justify-center order-2 md:order-1">
              <div className="text-center">
                <Target className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <p className="text-xl text-slate-900 font-semibold">Leading Healthcare Excellence</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Vision</h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                To be the most trusted multispecialty hospital in Haryana, recognized for clinical excellence, patient safety, and community service.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We envision a future where advanced medical technology meets compassionate care, creating a healing environment that instills confidence and hope in every patient.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-32">
        <Container>
          <SectionHeading
            subtitle="What Drives Us"
            title="Our Core Values"
            description="These principles guide every decision we make and every patient we serve"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32 bg-slate-50">
        <Container>
          <SectionHeading
            subtitle="Our Journey"
            title="Milestones & Achievements"
            description="Key moments that shaped our commitment to healthcare excellence"
          />
          <div className="relative max-w-3xl mx-auto">
            {timeline.map((item, idx) => (
              <div key={idx} className="mb-12 flex gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary !text-black flex items-center justify-center font-bold text-lg">
                    {item.year}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-1 h-24 bg-primary/30 mt-4" />
                  )}
                </div>
                <div className="pt-2 pb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "25+", label: "Years in Healthcare" },
              { number: "50k+", label: "Happy Patients" },
              { number: "20+", label: "Specialist Doctors" },
              { number: "100+", label: "Hospital Beds" },
            ].map((stat, idx) => (
              <div key={idx} className="p-8">
                <div className="text-5xl font-bold text-primary mb-3">{stat.number}</div>
                <p className="text-slate-600 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary !text-black">
        <Container className="text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Excellence?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book an appointment with our expert doctors or visit our hospital to experience the difference that dedicated care makes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book-appointment">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 !text-black">
                Book Appointment
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
