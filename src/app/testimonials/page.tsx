import React from "react";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Testimonials | Vijay Hospital",
  description: "Read genuine reviews and testimonials from patients treated at Vijay Hospital, Narnaul.",
};

export default async function TestimonialsPage() {
  const dbTestimonials = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const googleReviewsMock = [
    {
      author: "Harendra Singh",
      rating: 5,
      relativeTime: "2 weeks ago",
      text: "Outstanding service. The doctors are highly professional. The nursing staff took great care of my mother. Highly recommended in the Narnaul area.",
    },
    {
      author: "Pooja Sharma",
      rating: 5,
      relativeTime: "1 month ago",
      text: "Extremely clean hospital with great facilities. Dr. Meera Rao is amazing with kids! She guided us with proper care and attention.",
    },
    {
      author: "Deepak Yadav",
      rating: 4,
      relativeTime: "3 months ago",
      text: "Excellent cardiac center. Quick response during emergencies. Cashless TPA insurance settlement was handled very smoothly without any delay.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-surface">
        {/* Banner */}
        <div className="bg-primary/5 py-16 px-6 text-center border-b border-outline-variant/30">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              What Patients Say
            </span>
            <h1 className="text-4xl font-bold font-display text-primary">
              Patient Testimonials
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
              Genuine experiences from patients who have trusted Vijay Hospital with their care.
            </p>
            <p className="text-sm text-on-surface-variant/60 italic font-body">
              सच्चे अनुभव, स्वस्थ मुस्कान।
            </p>
          </div>
        </div>

        {/* DB Testimonials */}
        <Testimonials reviews={dbTestimonials} />

        {/* Google Reviews */}
        <div className="bg-white py-20 px-6 border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center bg-surface-container-low p-8 rounded-[40px] border border-outline-variant/30 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.92 1 12 1 7.37 1 3.4 3.66 1.5 7.54l3.85 2.99C6.26 7.5 8.9 5.04 12 5.04z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58v2.98h3.85c2.25-2.07 3.56-5.12 3.56-8.66z"/>
                    <path fill="#FBBC05" d="M5.35 14.55c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.96C.54 8.88 0 11.04 0 13.3s.54 4.42 1.5 6.34l3.85-2.99z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.85-2.98c-1.07.72-2.44 1.15-4.11 1.15-3.1 0-5.74-2.46-6.65-5.49L1.5 15.75C3.4 19.64 7.37 23 12 23z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary font-display">Google Business Reviews</h3>
                  <p className="text-xs text-on-surface-variant">Vijay Hospital, Narnaul</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary font-display">
                    4.8 <span className="text-sm font-normal text-on-surface-variant">/ 5</span>
                  </div>
                  <div className="flex gap-1 text-yellow-500 justify-center">
                    {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-xs fill-current">star</span>)}
                  </div>
                  <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-semibold mt-1">342 Reviews</p>
                </div>
                <a
                  href="https://search.google.com/local/writereview?placeid=ChIJje1eI9-1EjkRsajxHA-z-UY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button bg-primary text-black px-6 py-2.5 text-xs font-semibold hover:bg-primary/95 transition-all shadow-md"
                >
                  Write a Review
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {googleReviewsMock.map((rev, idx) => (
                <div key={idx} className="bg-surface-container-low/30 p-8 rounded-[32px] border border-outline-variant/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-primary text-sm font-display">{rev.author}</div>
                    <span className="text-[10px] text-on-surface-variant/70 font-medium">{rev.relativeTime}</span>
                  </div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(rev.rating)].map((_, i) => <span key={i} className="material-symbols-outlined text-[10px] fill-current">star</span>)}
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">&quot;{rev.text}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
