import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { 
  Heart, 
  Hospital, 
  Microscope, 
  Pill, 
  ClipboardList, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  GraduationCap, 
  TrendingUp, 
  Gift 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers - Vijay Hospital",
  description: "Join Vijay Hospital's growing team. Explore job openings and apply for positions in healthcare, nursing, administration, and more.",
};

const benefits = [
  { icon: IndianRupee, title: "Competitive Salary", desc: "Attractive pay packages based on experience and qualification" },
  { icon: ShieldCheck, title: "Health Insurance", desc: "Comprehensive health coverage for you and your family" },
  { icon: Calendar, title: "Flexible Schedules", desc: "Rotating shifts to balance work and life commitments" },
  { icon: GraduationCap, title: "Training & Development", desc: "Continuous professional development and learning programs" },
  { icon: TrendingUp, title: "Career Growth", desc: "Clear career progression paths and internal promotions" },
  { icon: Gift, title: "Benefits Package", desc: "Performance bonuses, travel allowances, and special perks" },
];

const getJobIcon = (department: string, title: string) => {
  const dept = department.toLowerCase();
  const t = title.toLowerCase();
  if (dept.includes("nurse") || dept.includes("nursing") || t.includes("nurse")) return Heart;
  if (dept.includes("laboratory") || dept.includes("lab") || dept.includes("radiology") || t.includes("tech") || t.includes("radiographer")) return Microscope;
  if (dept.includes("emergency") || t.includes("doctor")) return Hospital;
  if (dept.includes("pharmacy") || t.includes("pharmacist")) return Pill;
  return ClipboardList;
};

export default async function CareersPage() {
  // Fetch active careers from DB
  const dbCareers = await prisma.career.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      postedAt: "desc",
    },
  });

  // Map to simple structure
  const jobListings = dbCareers.map((job) => {
    const requirements = job.requirements
      ? job.requirements
          .split("\n")
          .map((r) => r.replace(/^-\s*/, "").trim())
          .filter(Boolean)
      : [];
    
    return {
      id: job.id,
      title: job.title,
      department: job.department,
      experience: job.experience || "2+ years",
      salary: job.salary || "Competitive",
      location: job.location || "Narnaul",
      description: job.description || "",
      requirements,
      jobType: job.jobType || "Full-time",
    };
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[480px] bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 text-white flex items-center py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <Container className="relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                <Briefcase className="w-3.5 h-3.5" /> Work With Us
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                Build Your Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Vijay Hospital</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 opacity-90 mb-10 max-w-2xl leading-relaxed">
                Join our team of dedicated healthcare professionals committed to providing 
                excellent patient care and making a difference in the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link
                  href="/careers/apply"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-bold rounded-full px-8 py-4 text-lg bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Apply Now
                </Link>
                <a href="#jobs" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:border-white hover:bg-white/5 active:scale-95 transition-all">
                    View Openings
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Why Join Us?</h2>
              <p className="text-lg text-slate-600">We offer competitive benefits, support, and professional growth opportunities to help you succeed.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <Card key={idx} className="border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 group">
                    <CardBody className="p-8">
                      <div className="p-3 w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-6 flex items-center justify-center transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{benefit.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{benefit.desc}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Job Listings */}
        <section className="py-20 bg-slate-50 border-t border-b border-slate-200/50" id="jobs">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Current Openings</h2>
              <p className="text-lg text-slate-600">Join our healthcare team in Narnaul in these key positions</p>
            </div>

            {jobListings.length === 0 ? (
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <ClipboardList className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Openings</h3>
                <p className="text-slate-600 mb-6">We don't have any specific openings at the moment, but you can still submit a general application below.</p>
                <Link
                  href="/careers/apply"
                  className="inline-flex items-center justify-center font-bold rounded-full px-6 py-3 bg-primary text-black hover:bg-primary/90 transition-all"
                >
                  Submit General Application
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {jobListings.map((job) => {
                  const Icon = getJobIcon(job.department, job.title);
                  return (
                    <Card key={job.id} className="border border-slate-200/60 hover:shadow-xl hover:border-slate-300 transition-all duration-300 bg-white flex flex-col justify-between overflow-hidden relative group">
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardBody className="p-8 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3.5 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="inline-block text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full mb-2">
                              {job.department}
                            </span>
                            <h3 className="text-2xl font-bold text-slate-900 leading-snug tracking-tight group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">
                              {job.jobType}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate font-semibold text-slate-800">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate font-semibold text-slate-800">{job.experience}</span>
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <IndianRupee className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate font-semibold text-slate-800">{job.salary}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-600 text-sm leading-relaxed mb-4">{job.description}</p>
                          {job.requirements.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Requirements:</p>
                              <ul className="text-xs text-slate-600 space-y-2">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardBody>
                      
                      <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <Link
                          href={`/careers/apply?position=${encodeURIComponent(job.title)}`}
                          className="w-full inline-flex items-center justify-center font-bold rounded-full px-6 py-3 bg-primary text-black hover:bg-primary/95 transition-all"
                        >
                          Apply for This Position
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Container>
        </section>



        {/* Contact Section */}
        <section className="py-20 bg-emerald-50 border-t border-slate-100">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Questions?</h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                Contact our HR team directly for any inquiries about active openings or the application process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:careers@vijayhospital.com" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 font-bold py-4">
                    <Mail className="w-5 h-5" /> careers@vijayhospital.com
                  </Button>
                </a>
                <a href="tel:+919306710615" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 flex items-center justify-center gap-2 font-bold py-4">
                    <Phone className="w-5 h-5" /> +91 93067 10615
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
