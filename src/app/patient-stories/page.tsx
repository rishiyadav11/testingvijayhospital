import { Metadata } from "next";
import PatientStoriesContent from "@/components/PatientStoriesContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Patient Stories | Vijay Hospital",
  description: "Real recovery journeys from patients treated at Vijay Hospital, Narnaul.",
};

export default async function PatientStoriesPage() {
  const dbStories = await prisma.patientStory.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const mappedStories = dbStories.map((s) => ({
    id: s.id,
    name: s.patientName,
    age: s.age,
    specialty: s.specialty,
    condition: s.condition,
    story: s.story,
    image: s.icon,
    rating: s.rating,
    recoveryTime: s.recoveryTime,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Distinctive hero — teal/emerald gradient, different from testimonials blue/white */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-5">
            <span className="inline-block bg-white/15 text-white/90 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20">
              Recovery Journeys
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-white leading-tight">
              Patient Stories
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              These are real patients who came to Vijay Hospital facing serious health challenges — and left transformed. Every story is a testament to what expert care and human compassion can achieve.
            </p>
            <p className="text-sm text-white/60 italic font-body">
              हर मरीज़ एक कहानी है, हर ठीक होना एक जीत।
            </p>
            <div className="flex justify-center gap-8 pt-2">
              {[
                { label: "Lives Transformed", value: "10,000+" },
                { label: "Specialties", value: "20+" },
                { label: "Years of Care", value: "15+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white font-display">{stat.value}</div>
                  <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stories grid with specialty filter */}
        <div className="bg-gradient-to-b from-slate-50 to-white min-h-[60vh]">
          <PatientStoriesContent initialStories={mappedStories} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
