import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { 
  Plane, 
  Car, 
  Hotel, 
  Languages, 
  Coins, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

export const metadata: Metadata = {
  title: "International Patients",
  description: "Comprehensive support for international patients seeking quality healthcare at Vijay Hospital, Narnaul.",
};

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "plane":
      return <Plane className="w-10 h-10 text-emerald-600" />;
    case "car":
      return <Car className="w-10 h-10 text-emerald-600" />;
    case "hotel":
      return <Hotel className="w-10 h-10 text-emerald-600" />;
    case "interpreter":
      return <Languages className="w-10 h-10 text-emerald-600" />;
    case "currency":
      return <Coins className="w-10 h-10 text-emerald-600" />;
    case "insurance":
      return <ShieldCheck className="w-10 h-10 text-emerald-600" />;
    default:
      return <Plane className="w-10 h-10 text-slate-500" />;
  }
};

export default function InternationalPatientsPage() {
  const services = [
    {
      icon: "plane",
      title: "Visa & FRRO Assistance",
      description: "Help with medical visa applications and FRRO registration for your stay",
    },
    {
      icon: "car",
      title: "Airport Pickup",
      description: "Complimentary airport and railway station transfer service",
    },
    {
      icon: "hotel",
      title: "Accommodation Support",
      description: "Help arranging nearby hotels and accommodation for attendants",
    },
    {
      icon: "interpreter",
      title: "Interpreter Services",
      description: "Professional translators for your preferred language",
    },
    {
      icon: "currency",
      title: "Currency Exchange",
      description: "Assistance with currency conversion and ATM access",
    },
    {
      icon: "insurance",
      title: "Insurance Verification",
      description: "Support with international insurance claim processing",
    },
  ];

  const process = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out with your medical details and we'll prepare a consultation plan",
    },
    {
      step: 2,
      title: "Doctor Consultation",
      description: "Video or in-person consultation with our specialists",
    },
    {
      step: 3,
      title: "Treatment Plan",
      description: "Detailed treatment plan with cost estimation and timeline",
    },
    {
      step: 4,
      title: "Travel Arrangement",
      description: "We assist with visa, travel bookings, and accommodation",
    },
    {
      step: 5,
      title: "Reception & Care",
      description: "Dedicated team to handle all your needs during treatment",
    },
    {
      step: 6,
      title: "Follow-up Support",
      description: "Post-treatment consultation and follow-up via telemedicine",
    },
  ];

  const countries = [
    { name: "USA", code: "US" },
    { name: "UK", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Middle East", code: "ME" },
    { name: "Southeast Asia", code: "SEA" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-20 md:py-32">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              World-Class Healthcare For International Patients
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Vijay Hospital welcomes patients from around the world. We provide comprehensive support to make your healthcare journey comfortable and hassle-free.
            </p>
            <Link href="/contact">
              <Button size="lg" className="!text-black font-bold">Schedule Consultation</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <SectionHeading
            subtitle="International Care"
            title="Why Choose Vijay Hospital?"
            description="We combine world-class medical expertise with compassionate patient care"
          />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-4">
                {[
                  "NABH accredited hospital meeting international standards",
                  "Experienced doctors trained at reputed international institutions",
                  "State-of-the-art medical equipment and technology",
                  "Affordable treatment costs (up to 70% savings vs developed countries)",
                  "Quick visa assistance and hassle-free registration",
                  "Dedicated liaison officer for international patients",
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0 mt-1" />
                    <p className="text-slate-700 text-lg">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary/10 rounded-2xl p-8 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <Globe className="w-20 h-20 text-primary" />
                </div>
                <p className="text-2xl text-slate-900 font-semibold">Serving Patients From 50+ Countries</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-b border-slate-200/50">
        <Container>
          <SectionHeading
            subtitle="Complete Support"
            title="Our Services For International Patients"
            description="Comprehensive assistance throughout your medical journey"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 bg-white border border-slate-100">
                <CardBody className="text-center p-8 flex flex-col items-center justify-center">
                  <div className="mb-4">{getServiceIcon(service.icon)}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Patient Journey */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <SectionHeading
            title="Your Journey With Us"
            description="Simple and straightforward process for international patients"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-slate-100 p-8 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{item.description}</p>
                </div>
                {idx < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Treatment Packages */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-b border-slate-200/50">
        <Container>
          <SectionHeading
            subtitle="Popular Treatments"
            title="Treatment Packages"
            description="Affordable medical packages for international patients"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Cardiac Care",
                duration: "7-10 days",
                cost: "$4,000-8,000",
                includes: "Consultation, Tests, Procedure, Follow-up",
              },
              {
                title: "Joint Replacement",
                duration: "3-5 days",
                cost: "$6,000-10,000",
                includes: "Surgery, Hospital stay, Physiotherapy",
              },
              {
                title: "Dental Implants",
                duration: "2-3 visits",
                cost: "$800-1,500",
                includes: "Consultation, Implant, Crown, Follow-up",
              },
              {
                title: "Eye Surgery",
                duration: "1-2 days",
                cost: "$1,000-2,000",
                includes: "Pre-op tests, Surgery, Post-op care",
              },
              {
                title: "General Health Check",
                duration: "1 day",
                cost: "$400-600",
                includes: "All major tests, Specialist consultation",
              },
              {
                title: "Wellness Package",
                duration: "1 week",
                cost: "$2,000-3,000",
                includes: "Tests, Ayurveda, Yoga, Nutrition",
              },
            ].map((pkg, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 bg-white border border-slate-100">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{pkg.title}</h3>
                  <div className="space-y-2 mb-4 text-sm">
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-700">Duration:</span> {pkg.duration}
                    </p>
                    <p className="text-primary font-bold text-lg">{pkg.cost}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      <span className="font-semibold text-slate-700">Includes:</span> {pkg.includes}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Countries Served */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12 tracking-tight">
            Patients From Around The World
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {countries.map((country, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/60 p-6 text-center hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center bg-slate-50/50"
              >
                <div className="text-lg font-bold text-emerald-600 mb-1.5">{country.code}</div>
                <p className="font-semibold text-slate-900 text-sm">{country.name}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-200/50">
        <Container>
          <SectionHeading
            title="Frequently Asked Questions"
            description="Common questions from international patients"
          />
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Do you provide medical visa letter?",
                a: "Yes, we provide official medical visa invitation letters. Submit your medical reports and we'll prepare the documentation.",
              },
              {
                q: "What is the cost comparison with other countries?",
                a: "Medical costs in India are 60-75% less than developed countries. Our NABH accreditation ensures quality at affordable rates.",
              },
              {
                q: "Can family members stay with the patient?",
                a: "Yes, we provide assistance in arranging nearby accommodation for family members or attendants.",
              },
              {
                q: "Is telemedicine consultation available?",
                a: "Yes, you can have online consultations with our doctors before traveling. Helps in better planning.",
              },
              {
                q: "What about post-treatment follow-up?",
                a: "We provide 6 months of follow-up care via telemedicine at no extra cost after your treatment.",
              },
            ].map((faq, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow duration-300 bg-white border border-slate-100">
                <CardBody className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-20 md:py-32 bg-primary text-black">
        <Container className="text-center">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
            Contact our international patient liaison team and we'll guide you through the entire process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-black text-black hover:bg-black/5 font-semibold">
                Contact Us
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="!text-white font-semibold">
              Schedule Consultation
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
