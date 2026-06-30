import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";
import CareerApplicationForm from "../CareerApplicationForm";
import {
  Briefcase,
  ArrowLeft,
  ShieldCheck,
  Clock,
  HeadphonesIcon,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apply for a Position - Vijay Hospital Careers",
  description:
    "Submit your application to join Vijay Hospital's team of dedicated healthcare professionals.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ position?: string }>;
}) {
  const { position } = await searchParams;
  const selectedPosition = position ? decodeURIComponent(position) : "";

  const dbCareers = await prisma.career.findMany({
    where: { status: "ACTIVE" },
    orderBy: { postedAt: "desc" },
  });

  const jobListings = dbCareers.map((job) => ({
    id: job.id,
    title: job.title,
    department: job.department,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <Container className="relative z-10">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Careers
            </Link>

            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5">
                <Briefcase className="w-3.5 h-3.5" /> Application Form
              </span>

              {selectedPosition ? (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">
                    Applying for{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                      {selectedPosition}
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mb-4">
                    at Vijay Hospital, Narnaul
                  </p>
                </>
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                  Apply to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    Vijay Hospital
                  </span>
                </h1>
              )}

              <p className="text-base md:text-lg text-slate-300 opacity-90 leading-relaxed max-w-xl">
                Fill out the form below. We review every application and will
                reach out if your profile is a match.
              </p>

              {/* Steps */}
              <div className="flex items-center gap-3 mt-8">
                {["Fill Details", "Upload Resume", "Submit"].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      <span className="text-xs text-slate-400 font-medium hidden sm:block">
                        {step}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="w-8 h-px bg-slate-700 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Form Section */}
        <section className="py-16 md:py-20">
          <Container>
            <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/80 overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Your Application
                      </h2>
                      <p className="text-xs text-slate-500">
                        All fields marked * are required
                      </p>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 md:p-10">
                    <CareerApplicationForm
                      jobListings={jobListings}
                      selectedPosition={selectedPosition}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 lg:sticky lg:top-8">
                {/* Why Join Us */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-100">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Why Join Us?
                  </h3>
                  <ul className="space-y-2.5 text-xs leading-relaxed">
                    {[
                      "Supportive & collaborative work culture",
                      "Continuous learning & training programs",
                      "Competitive salary & benefits",
                      "Modern facilities in Narnaul",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-200" />
                        <span className="text-emerald-50">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Application Tips
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Keep your resume up-to-date with relevant healthcare experience.",
                      "Include certifications, licenses, and training.",
                      "A strong cover letter sets you apart.",
                      "Upload your resume as PDF for best formatting.",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Info Cards */}
                {[
                  {
                    icon: ShieldCheck,
                    title: "Your Data is Safe",
                    desc: "We keep your information confidential and only use it for recruitment.",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    icon: Clock,
                    title: "Quick Review",
                    desc: "Our HR team reviews applications within 3–5 business days.",
                    color: "bg-amber-50 text-amber-600",
                  },
                  {
                    icon: HeadphonesIcon,
                    title: "Need Help?",
                    desc: (
                      <>
                        Email{" "}
                        <a
                          href="mailto:careers@vijayhospital.com"
                          className="text-emerald-600 font-semibold hover:underline"
                        >
                          careers@vijayhospital.com
                        </a>{" "}
                        or call{" "}
                        <a
                          href="tel:+919306710615"
                          className="text-slate-900 font-semibold hover:text-emerald-600"
                        >
                          +91 93067 10615
                        </a>
                      </>
                    ),
                    color: "bg-emerald-50 text-emerald-600",
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${card.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">
                            {card.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
