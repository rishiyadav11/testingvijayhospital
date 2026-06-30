import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  Bell,
  Briefcase,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Coming Soon - Vijay Hospital Careers",
  description:
    "Online applications are coming soon. Stay tuned for updates from Vijay Hospital.",
};

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            {/* Animated Icon */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 animate-pulse" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center">
                <Clock className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="absolute -top-1 -right-1 p-2 rounded-full bg-amber-100 border-2 border-white shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
            </div>

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
              <Briefcase className="w-3.5 h-3.5" />
              Online Applications
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Coming{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Soon
              </span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed mb-8 max-w-md mx-auto">
              We&apos;re working on our online application system. In the
              meantime, you can contact our HR team directly to apply.
            </p>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 text-left space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                How to Apply
              </h3>
              <p className="text-sm text-slate-600">
                Send your resume and cover letter to:
              </p>
              <a
                href="mailto:careers@vijayhospital.com"
                className="block text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                careers@vijayhospital.com
              </a>
              <p className="text-sm text-slate-600">
                Or call us at:{" "}
                <a
                  href="tel:+919306710615"
                  className="font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                >
                  +91 93067 10615
                </a>
              </p>
            </div>

            {/* Back Button */}
            <Link href="/careers">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 font-bold gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Careers
              </Button>
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
