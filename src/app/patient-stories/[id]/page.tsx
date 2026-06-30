import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import {
  Heart, Baby, Activity, Shield, Ambulance, Brain, Hospital, HeartHandshake,
  Star, ArrowLeft, Clock, Stethoscope, CalendarDays, Quote, MapPin,
} from "lucide-react";

function getStoryIcon(iconName: string, cls = "w-10 h-10") {
  switch (iconName) {
    case "heart":      return <Heart className={`${cls} text-rose-400`} />;
    case "baby":       return <Baby className={`${cls} text-blue-400`} />;
    case "run":        return <Activity className={`${cls} text-emerald-400`} />;
    case "ribbon":     return <Shield className={`${cls} text-purple-400`} />;
    case "ambulance":  return <Ambulance className={`${cls} text-red-400`} />;
    case "brain":      return <Brain className={`${cls} text-indigo-400`} />;
    case "hospital":   return <Hospital className={`${cls} text-sky-400`} />;
    case "heart-gift": return <HeartHandshake className={`${cls} text-pink-400`} />;
    default:           return <Hospital className={`${cls} text-slate-400`} />;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await prisma.patientStory.findUnique({ where: { id } });
  if (!story) return { title: "Story not found" };
  return {
    title: `${story.patientName}'s Story | Vijay Hospital`,
    description: story.story.slice(0, 160),
  };
}

export default async function PatientStoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = await prisma.patientStory.findUnique({
    where: { id, status: "PUBLISHED" },
  });

  if (!story) notFound();

  const related = await prisma.patientStory.findMany({
    where: { status: "PUBLISHED", specialty: story.specialty, NOT: { id: story.id } },
    take: 3,
    orderBy: { featured: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800 overflow-hidden">
          {/* subtle background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
          />

          <div className="relative max-w-6xl mx-auto px-6 py-16">
            <Link
              href="/patient-stories"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Patient Stories
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left — text */}
              <div className="space-y-6 order-2 lg:order-1">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/30 tracking-wide">
                    {story.specialty}
                  </span>
                  {story.featured && (
                    <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-400/30">
                      ★ Featured Story
                    </span>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-white font-display leading-tight">
                  {story.patientName}&apos;s<br />
                  <span className="text-emerald-300">Recovery</span> Journey
                </h1>

                <p className="text-white/60 text-base leading-relaxed line-clamp-3 font-body">
                  {story.story.slice(0, 160)}…
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: <CalendarDays className="w-3.5 h-3.5" />, label: `Age ${story.age}` },
                    { icon: <Stethoscope className="w-3.5 h-3.5" />, label: story.condition },
                    { icon: <Clock className="w-3.5 h-3.5" />, label: `Recovered in ${story.recoveryTime}` },
                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Vijay Hospital, Narnaul" },
                  ].map((m) => (
                    <span key={m.label} className="flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
                      {m.icon} {m.label}
                    </span>
                  ))}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < story.rating ? "fill-amber-400 text-amber-400" : "text-white/20 fill-white/10"}`} />
                    ))}
                  </div>
                  <span className="text-white/50 text-xs font-medium">{story.rating}.0 / 5</span>
                </div>
              </div>

              {/* Right — photo */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                {story.photoUrl ? (
                  <div className="relative">
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-emerald-400/20 blur-2xl scale-110" />
                    {/* Decorative corner accents */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-xl" />
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-emerald-400/60 rounded-br-xl" />

                    <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-[2rem] overflow-hidden ring-1 ring-white/20 shadow-2xl">
                      <Image
                        src={story.photoUrl}
                        alt={story.patientName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 288px, 320px"
                        priority
                      />
                      {/* Bottom gradient overlay for name */}
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold font-display text-lg leading-tight">{story.patientName}</p>
                        <p className="text-white/70 text-xs mt-0.5">{story.condition}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* No photo — show large icon medallion */
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl scale-125" />
                    <div className="relative w-56 h-56 rounded-full bg-white/5 ring-1 ring-white/20 flex items-center justify-center">
                      {getStoryIcon(story.icon, "w-24 h-24")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Main story */}
            <div className="lg:col-span-2 space-y-10">
              <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-8 border border-emerald-100">
                <Quote className="w-14 h-14 text-emerald-200 absolute top-5 right-5 fill-emerald-100" />
                <div className="space-y-5 relative z-10">
                  {story.story.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i} className="text-base sm:text-lg text-slate-700 leading-8 font-body">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Signature row */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {story.photoUrl ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-emerald-200 shadow-md">
                      <Image src={story.photoUrl} alt={story.patientName} width={56} height={56} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 ring-2 ring-emerald-100 flex items-center justify-center">
                      {getStoryIcon(story.icon, "w-7 h-7")}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-slate-900 font-display">{story.patientName}</p>
                  <p className="text-sm text-slate-500">{story.condition} · {story.specialty} · Vijay Hospital</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick facts */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-3">
                <h3 className="font-bold text-slate-900 font-display text-xs uppercase tracking-widest mb-4">Quick Facts</h3>
                {[
                  { label: "Patient", value: story.patientName },
                  { label: "Age", value: `${story.age} years` },
                  { label: "Department", value: story.specialty },
                  { label: "Condition", value: story.condition },
                  { label: "Recovery", value: story.recoveryTime },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-start text-sm py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-400 font-medium shrink-0">{item.label}</span>
                    <span className="text-slate-800 font-semibold text-right ml-3">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400 font-medium text-sm">Rating</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < story.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 space-y-4 text-center">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 bg-white/15 rounded-2xl mx-auto flex items-center justify-center">
                    {getStoryIcon(story.icon, "w-7 h-7")}
                  </div>
                  <div>
                    <p className="text-white font-bold font-display">Need similar care?</p>
                    <p className="text-white/60 text-xs mt-1 leading-relaxed">
                      Our {story.specialty} specialists are here for you.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="block bg-white text-emerald-700 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                    Book a Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related stories ───────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-100 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  More {story.specialty} Stories
                </h2>
                <Link href="/patient-stories" className="text-sm text-emerald-600 font-semibold hover:underline">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/patient-stories/${r.id}`}
                    className="group relative bg-white hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 rounded-2xl overflow-hidden transition-all hover:shadow-md"
                  >
                    {r.photoUrl ? (
                      <div className="relative h-36 w-full overflow-hidden">
                        <Image src={r.photoUrl} alt={r.patientName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-2 left-3 text-white text-xs font-bold font-display">{r.patientName}</span>
                      </div>
                    ) : (
                      <div className="h-20 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                        {getStoryIcon(r.icon, "w-8 h-8")}
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      {!r.photoUrl && (
                        <p className="font-bold text-slate-900 text-sm font-display group-hover:text-emerald-700 transition-colors">
                          {r.patientName}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 font-medium">{r.condition} · {r.recoveryTime}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{r.story}</p>
                      <span className="inline-block text-xs font-semibold text-emerald-600 group-hover:underline pt-1">
                        Read story →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
