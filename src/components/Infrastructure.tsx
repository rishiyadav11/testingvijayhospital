import React from "react";
import { prisma } from "@/lib/prisma";
import {
  Hospital, HeartPulse, Activity, FlaskConical, ShieldAlert,
  Users, Check, Baby, Droplets, Scan, Dumbbell, Stethoscope, Pill,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  hospital:  <Hospital    className="text-primary w-6 h-6" />,
  heart:     <HeartPulse  className="text-primary w-6 h-6" />,
  pharmacy:  <Activity    className="text-primary w-6 h-6" />,
  lab:       <FlaskConical className="text-primary w-6 h-6" />,
  emergency: <ShieldAlert className="text-primary w-6 h-6" />,
  users:     <Users       className="text-primary w-6 h-6" />,
  baby:      <Baby        className="text-primary w-6 h-6" />,
  blood:     <Droplets    className="text-primary w-6 h-6" />,
  scan:      <Scan        className="text-primary w-6 h-6" />,
  rehab:     <Dumbbell    className="text-primary w-6 h-6" />,
  opd:       <Stethoscope className="text-primary w-6 h-6" />,
  pill:      <Pill        className="text-primary w-6 h-6" />,
};

const DEFAULT_FACILITIES = [
  {
    id: "modular-ots",
    title: "Modular Operating Theaters",
    category: "Surgical Excellence",
    icon: "hospital",
    description: "Ultra-clean sterile environments with laminar airflow, HEPA filtration, and robotic surgical interfaces — engineered for zero infection risk.",
    image: "/modular_ot.png",
    highlights: ["Zero Infection Design", "Laminar Flow", "Robotic Ready"],
  },
  {
    id: "icu",
    title: "Intensive Care Unit (ICU)",
    category: "Critical Care",
    icon: "heart",
    description: "Continuous patient monitoring with high-end ventilators and multi-parameter monitors, overseen 24/7 by senior intensivists.",
    image: "/icu_ward.png",
    highlights: ["24/7 Intensivist", "Multi-Para Monitors", "Ventilator Support"],
  },
  {
    id: "pharmacy",
    title: "24/7 In-House Pharmacy",
    category: "Patient Support",
    icon: "pill",
    description: "Fully-stocked clinical pharmacy inside the hospital providing instant access to critical life-saving medications round the clock.",
    image: "/pharmacy.png",
    highlights: ["Round-the-Clock", "100% Genuine", "Emergency Stock"],
  },
  {
    id: "pathology",
    title: "Pathology & Biotech Lab",
    category: "Diagnostics",
    icon: "lab",
    description: "Fully automated laboratory with high-precision hematology, biochemistry, microbiology, and histopathology capabilities.",
    image: "/diagnostic_lab.png",
    highlights: ["Automated Analyzers", "Rapid Turnaround", "NABL Standards"],
  },
  {
    id: "emergency",
    title: "Emergency & Trauma Center",
    category: "Emergency Services",
    icon: "emergency",
    description: "Dedicated resuscitation bays, crash carts, and direct OT access — Level II trauma center with 24/7 ATLS-trained teams.",
    image: "/emergency_room.png",
    highlights: ["Immediate Response", "Advanced Life Support", "Air Ambulance"],
  },
  {
    id: "opd",
    title: "OPD Suite",
    category: "Outpatient Care",
    icon: "opd",
    description: "Spacious multi-specialty outpatient suites with digital queue management ensuring comfort and minimal waiting time.",
    image: "/opd_suite.png",
    highlights: ["20+ Specialties", "Digital Queue", "Minimal Wait"],
  },
  {
    id: "nicu",
    title: "Neonatal ICU (NICU)",
    category: "Neonatal Care",
    icon: "baby",
    description: "Dedicated neonatal intensive care unit with incubators, phototherapy units, and neonatal ventilators staffed by specialist neonatologists.",
    image: "/icu_ward.png",
    highlights: ["Incubator Units", "Phototherapy", "24/7 Neonatologist"],
  },
  {
    id: "blood-bank",
    title: "Blood Bank",
    category: "Transfusion Services",
    icon: "blood",
    description: "Licensed blood bank with component separation, cross-matching, and cold-chain storage ensuring safe and timely transfusions.",
    image: "/diagnostic_lab.png",
    highlights: ["All Components", "24/7 Availability", "Safe Transfusion"],
  },
  {
    id: "radiology",
    title: "Radiology & Imaging",
    category: "Imaging",
    icon: "scan",
    description: "Digital X-ray, ultrasound, CT scan, and MRI services with immediate radiologist reporting for rapid clinical decision-making.",
    image: "/modular_ot.png",
    highlights: ["CT & MRI", "Digital X-Ray", "Same-Day Reports"],
  },
];

export default async function Infrastructure() {
  const dbItems = await prisma.gallery.findMany({
    where: { category: "Infrastructure", status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });

  // Enrich default facilities with DB images when title matches
  const facilities = DEFAULT_FACILITIES.map((fac) => {
    const dbMatch = dbItems.find(
      (d) =>
        d.title.toLowerCase().includes(fac.title.toLowerCase().split(" ")[0]) ||
        fac.title.toLowerCase().includes(d.title.toLowerCase().split(" ")[0])
    );
    return { ...fac, image: dbMatch ? dbMatch.mediaUrl : fac.image };
  });

  return (
    <section
      className="px-6 py-24 relative overflow-hidden bg-[#0d5945] bg-cover bg-center"
      style={{ backgroundImage: "url('/green_paper_bg.png')" }}
      id="infrastructure"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/25 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-white uppercase">
            Clinical Standards
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white">
            Advanced Infrastructure
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
            Equipped with state-of-the-art medical technology to provide unmatched diagnostic and surgical precision in Narnaul.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="group bg-[#fafcf9] border border-[#becbbf]/60 shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-2 flex flex-col rounded-[28px] overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  alt={fac.title}
                  src={fac.image}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#0a5c46] text-white text-[10px] tracking-wider uppercase px-3 py-1 rounded-full font-bold shadow-md">
                  {fac.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-grow space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-lg font-bold font-display text-[#163320] group-hover:text-[#0a5c46] transition-colors leading-snug">
                      {fac.title}
                    </h3>
                    <div className="flex-shrink-0 mt-0.5">
                      {ICON_MAP[fac.icon] ?? ICON_MAP.hospital}
                    </div>
                  </div>
                  <p className="text-sm text-[#385240] leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="border-t border-[#dee5df] pt-5 flex flex-wrap gap-2 mt-auto">
                  {fac.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-[#eaf4eb] text-[#0a5c46] border border-[#cde2d1] text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
