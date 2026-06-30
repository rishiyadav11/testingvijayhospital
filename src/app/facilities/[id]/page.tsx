import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import {
  ArrowLeft, CheckCircle2, ChevronRight, Phone, CalendarDays,
  Star, Shield, Clock, Activity, Microscope, Pill, Ambulance,
  Stethoscope, Building2, FlaskConical, HeartPulse,
} from "lucide-react";

// ─── All facility data ────────────────────────────────────────────────────────

const FACILITY_DATA = {
  "modular-ots": {
    name: "Modular Operating Theaters",
    tagline: "Precision Surgery in a Sterile Environment",
    icon: <Activity className="w-8 h-8" />,
    color: "from-blue-900 via-blue-800 to-indigo-900",
    accentColor: "bg-blue-500",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    heroImage: "/opd_suite.png",
    description:
      "Our Modular Operating Theaters represent the pinnacle of surgical infrastructure. Designed with laminar airflow and HEPA filtration, they eliminate the risk of surgical site infections while equipping our surgeons with robotic-ready platforms and high-definition imaging.",
    longDescription:
      "Each OT at Vijay Hospital is built to international standards with positive-pressure laminar air flow systems that maintain a sterile environment throughout the procedure. Our theaters support minimally invasive surgeries, laparoscopic procedures, orthopedic surgeries, cardiac operations, and complex multi-disciplinary procedures.",
    stats: [
      { value: "6", label: "Operating Theaters" },
      { value: "99.97%", label: "Air Filtration" },
      { value: "500+", label: "Surgeries/Month" },
      { value: "Zero", label: "HAI Rate" },
    ],
    equipment: [
      { name: "Robotic Surgical Interfaces", spec: "Latest Generation", icon: "🤖" },
      { name: "HEPA Filtration System", spec: "99.97% Efficiency", icon: "🌬️" },
      { name: "Advanced Anesthesia Stations", spec: "Multi-parameter monitoring", icon: "💉" },
      { name: "High-Definition Surgical Microscopes", spec: "4K Resolution", icon: "🔬" },
      { name: "C-Arm Fluoroscopy", spec: "2D/3D Imaging", icon: "📡" },
      { name: "Electrosurgical Units", spec: "Harmonic & Bipolar", icon: "⚡" },
      { name: "Laparoscopy Tower", spec: "HD Video Column", icon: "📷" },
      { name: "Patient Warming Systems", spec: "Forced Air Warming", icon: "🌡️" },
    ],
    features: [
      "Zero Hospital-Acquired Infection (HAI) protocol",
      "Laminar airflow — 400+ air changes per hour",
      "Robotic-assisted surgery capable",
      "Integrated imaging during surgery",
      "Dedicated cardiac and neurosurgery suites",
      "24/7 emergency surgical access",
    ],
    procedures: ["Cardiac Surgery", "Neurosurgery", "Orthopedic Replacements", "Laparoscopic Procedures", "Oncology Resections", "Vascular Surgery"],
  },

  "icu": {
    name: "Intensive Care Unit (ICU)",
    tagline: "Round-the-Clock Critical Care",
    icon: <HeartPulse className="w-8 h-8" />,
    color: "from-rose-900 via-red-800 to-rose-900",
    accentColor: "bg-rose-500",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    heroImage: "/emergency_room.png",
    description:
      "Our Intensive Care Unit operates 24 hours a day, 7 days a week, under the supervision of senior intensivists and specialized nursing staff. Every bed is equipped with continuous multi-parameter monitoring and immediate intervention capability.",
    longDescription:
      "Vijay Hospital's ICU is a 20-bed unit divided into Medical ICU, Surgical ICU, and Cardiac ICU bays. Each patient bay has a dedicated ventilator, hemodynamic monitor, infusion pumps, and nurse call system. Our intensivists conduct multi-disciplinary rounds twice daily with real-time telemedicine consultation available.",
    stats: [
      { value: "20", label: "ICU Beds" },
      { value: "24/7", label: "Intensivist Cover" },
      { value: "1:2", label: "Nurse-to-Patient" },
      { value: "< 5 min", label: "Emergency Response" },
    ],
    equipment: [
      { name: "Multi-Parameter Monitors", spec: "Continuous Real-Time", icon: "📊" },
      { name: "Mechanical Ventilators", spec: "High-End, Portable", icon: "💨" },
      { name: "Continuous Renal Replacement Therapy", spec: "CRRT Units", icon: "🫀" },
      { name: "Hemodynamic Monitoring", spec: "Invasive & Non-Invasive", icon: "❤️" },
      { name: "Smart Infusion Pumps", spec: "Drug Error Reduction", icon: "💉" },
      { name: "Point-of-Care Lab", spec: "Bedside ABG & Glucose", icon: "🧪" },
      { name: "Portable X-Ray", spec: "Bedside Imaging", icon: "📡" },
      { name: "Bedside Echo", spec: "Critical Care Ultrasound", icon: "🔊" },
    ],
    features: [
      "Dedicated Medical, Surgical & Cardiac ICU bays",
      "1:2 nurse-to-patient ratio at all times",
      "Telemedicine intensivist consultation",
      "Family updates every 6 hours",
      "Strict infection control protocols",
      "Post-ICU step-down care unit",
    ],
    procedures: ["Mechanical Ventilation", "Hemodynamic Support", "Renal Replacement", "Sepsis Management", "Post-Operative Monitoring", "Cardiac Monitoring"],
  },

  "pharmacy": {
    name: "24/7 In-House Pharmacy",
    tagline: "Life-Saving Medicines Always Available",
    icon: <Pill className="w-8 h-8" />,
    color: "from-emerald-900 via-teal-800 to-emerald-900",
    accentColor: "bg-emerald-500",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    heroImage: "/pharmacy.png",
    description:
      "Our fully-stocked in-house pharmacy operates around the clock, ensuring no patient is ever without their medication. With a digital inventory system and automated dispensing, prescription fulfillment is rapid, accurate, and fully traceable.",
    longDescription:
      "Vijay Hospital's pharmacy stocks over 3,000 medications including critical care drugs, oncology agents, rare disease treatments, and all essential medicines. Our pharmacists work closely with treating physicians to check drug interactions, counsel patients on dosage, and ensure medication adherence. Cold-chain storage ensures temperature-sensitive biologics remain effective.",
    stats: [
      { value: "3,000+", label: "Medicines Stocked" },
      { value: "24/7", label: "Operations" },
      { value: "100%", label: "Genuine Drugs" },
      { value: "< 10 min", label: "Dispensing Time" },
    ],
    equipment: [
      { name: "Pharmacy Management System", spec: "Real-Time Digital Inventory", icon: "💻" },
      { name: "Automated Dispensing Cabinets", spec: "Ward-Level Dispensing", icon: "🗄️" },
      { name: "Cold Chain Storage", spec: "-20°C to +8°C", icon: "❄️" },
      { name: "Medication Barcode System", spec: "Error-Free Dispensing", icon: "📱" },
      { name: "Drug Interaction Checker", spec: "AI-Powered", icon: "🤖" },
      { name: "Sterile Compounding Unit", spec: "IV Admixture Preparation", icon: "⚗️" },
      { name: "Narcotic Storage Vault", spec: "Controlled Substance Compliance", icon: "🔒" },
      { name: "In-House Quality Testing", spec: "Batch Verification", icon: "🧪" },
    ],
    features: [
      "Round-the-clock pharmacist on duty",
      "100% genuine, hospital-grade medications",
      "Emergency drug protocol for ICU & OT",
      "Patient medication counseling",
      "Drug interaction monitoring",
      "Home delivery for discharged patients",
    ],
    procedures: ["Prescription Dispensing", "IV Admixture", "Chemotherapy Preparation", "Antibiotic Stewardship", "Patient Counseling", "Drug Reconciliation"],
  },

  "pathology": {
    name: "Pathology Laboratory",
    tagline: "Accurate Diagnostics, Faster Results",
    icon: <FlaskConical className="w-8 h-8" />,
    color: "from-violet-900 via-purple-800 to-violet-900",
    accentColor: "bg-violet-500",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-200",
    heroImage: "/diagnostic_lab.png",
    description:
      "Our NABL-accredited pathology laboratory processes thousands of tests daily across hematology, biochemistry, microbiology, and histopathology. Turnaround times as fast as 2 hours for urgent panels ensure clinical decisions are never delayed.",
    longDescription:
      "Vijay Hospital's pathology laboratory is equipped with fully automated analyzers that minimize human error and ensure reproducibility. Our team of senior pathologists and microbiologists are available around the clock to interpret complex results, manage blood bank inventory, and support the ICU with critical value reporting.",
    stats: [
      { value: "500+", label: "Tests Offered" },
      { value: "< 2 hrs", label: "Urgent TAT" },
      { value: "NABL", label: "Accreditation" },
      { value: "24/7", label: "Emergency Lab" },
    ],
    equipment: [
      { name: "High-Throughput Biochemistry Analyzer", spec: "1500 tests/hour", icon: "🔬" },
      { name: "Immunoassay Analyzer", spec: "Chemiluminescence Technology", icon: "💡" },
      { name: "5-Part Hematology Analyzer", spec: "Full Blood Count + Diff", icon: "🩸" },
      { name: "Automated Microbiology Analyzer", spec: "MALDI-TOF Identification", icon: "🦠" },
      { name: "Coagulation Analyzer", spec: "PT, APTT, Fibrinogen", icon: "⏱️" },
      { name: "Histopathology Processor", spec: "Tissue Embedding & Staining", icon: "🧬" },
      { name: "Blood Gas Analyzer", spec: "Critical Care Panel", icon: "💨" },
      { name: "Blood Bank Refrigerators", spec: "Component Storage", icon: "❄️" },
    ],
    features: [
      "NABL-accredited quality standards",
      "Automated sample processing — minimal human error",
      "Critical value calling within 15 minutes",
      "Online report delivery via patient portal",
      "Blood bank with all components",
      "Frozen section for intra-operative diagnosis",
    ],
    procedures: ["Complete Blood Count", "Liver & Kidney Function", "Culture & Sensitivity", "Histopathology", "Hormone Panels", "Tumour Markers"],
  },

  "emergency": {
    name: "Emergency & Trauma Center",
    tagline: "Every Second Counts",
    icon: <Ambulance className="w-8 h-8" />,
    color: "from-orange-900 via-red-800 to-orange-900",
    accentColor: "bg-orange-500",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    heroImage: "/emergency_room.png",
    description:
      "Vijay Hospital's Emergency & Trauma Center is a Level II trauma facility with a dedicated helicopter landing pad, 24/7 trauma surgeons, and a rapid-response team capable of receiving and stabilizing the most critical patients within minutes of arrival.",
    longDescription:
      "Our emergency department sees over 200 patients daily and handles trauma cases ranging from road accidents to industrial injuries. The triage system ensures the most critical patients receive immediate attention. Our ATLS-certified trauma team works with dedicated trauma bays, resuscitation rooms, and direct OT access for emergency surgeries.",
    stats: [
      { value: "200+", label: "Daily Visits" },
      { value: "< 5 min", label: "Triage Time" },
      { value: "24/7", label: "Trauma Surgeons" },
      { value: "Level II", label: "Trauma Center" },
    ],
    equipment: [
      { name: "Trauma Resuscitation Bays", spec: "4 Dedicated Bays", icon: "🏥" },
      { name: "Automated External Defibrillators", spec: "AED Throughout", icon: "⚡" },
      { name: "Portable Ventilators", spec: "Transport Grade", icon: "💨" },
      { name: "Point-of-Care Ultrasound", spec: "FAST Exam Capable", icon: "🔊" },
      { name: "Helicopter Ambulance", spec: "Air Evacuation Ready", icon: "🚁" },
      { name: "Advanced Life Support Ambulances", spec: "Fleet of 6", icon: "🚑" },
      { name: "Rapid Infuser Systems", spec: "Massive Transfusion Protocol", icon: "💉" },
      { name: "Crash Cart", spec: "Every Bay", icon: "🔴" },
    ],
    features: [
      "ATLS-certified trauma team on duty 24/7",
      "Helicopter landing pad with air evacuation",
      "Direct OT access for emergency surgeries",
      "Mass casualty incident protocol",
      "Dedicated paediatric emergency bay",
      "Poison & snake bite management protocols",
    ],
    procedures: ["Trauma Resuscitation", "Cardiac Arrest Management", "Stroke Thrombolysis", "Fracture Stabilisation", "Burns Management", "Toxicology Management"],
  },

  "opd": {
    name: "Out-Patient Department (OPD)",
    tagline: "Expert Consultations, No Admission Needed",
    icon: <Stethoscope className="w-8 h-8" />,
    color: "from-teal-900 via-cyan-800 to-teal-900",
    accentColor: "bg-teal-500",
    badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
    heroImage: "/opd_suite.png",
    description:
      "Our multi-specialty OPD serves over 500 patients daily across 20+ departments. With a digital queue system, air-conditioned waiting areas, and point-of-care diagnostics, we ensure your outpatient visit is efficient, comfortable, and thorough.",
    longDescription:
      "The OPD at Vijay Hospital operates from 8 AM to 8 PM on weekdays and 8 AM to 2 PM on Saturdays. Each specialty has dedicated consultation rooms with trained nursing support. Online pre-registration, appointment booking, and digital prescriptions reduce wait times and improve the overall patient experience.",
    stats: [
      { value: "500+", label: "Daily Patients" },
      { value: "20+", label: "Specialties" },
      { value: "< 30 min", label: "Average Wait" },
      { value: "Digital", label: "Prescriptions" },
    ],
    equipment: [
      { name: "Digital Patient Queue System", spec: "Token & Display Boards", icon: "📱" },
      { name: "Electronic Health Record System", spec: "Paperless Consultations", icon: "💻" },
      { name: "Point-of-Care ECG Machines", spec: "12-Lead Digital", icon: "❤️" },
      { name: "Portable Spirometry", spec: "Pulmonary Function", icon: "💨" },
      { name: "Digital Weighing & BMI Stations", spec: "Auto-capture to Records", icon: "⚖️" },
      { name: "Ophthalmic Slit Lamp", spec: "Dedicated Eye Clinic", icon: "👁️" },
      { name: "ENT Examination Unit", spec: "Otoscopy & Nasal Endoscopy", icon: "👂" },
      { name: "Dermatoscopy Units", spec: "Skin & Hair Clinics", icon: "🔍" },
    ],
    features: [
      "Online appointment booking & queue management",
      "20+ specialties under one roof",
      "Digital prescriptions & e-reports",
      "Interpreter service for non-Hindi patients",
      "Insurance pre-authorization desk",
      "Pharmacy and labs co-located within OPD",
    ],
    procedures: ["General Consultations", "Follow-Up Reviews", "Minor Procedures", "Wound Dressings", "Vaccination", "Health Screenings"],
  },
};

type FacilityId = keyof typeof FACILITY_DATA;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const fac = FACILITY_DATA[id as FacilityId];
  if (!fac) return { title: "Facility Not Found" };
  return {
    title: `${fac.name} | Vijay Hospital`,
    description: fac.description,
  };
}

export default async function FacilityDetailPage({ params }: Props) {
  const { id } = await params;
  const fac = FACILITY_DATA[id as FacilityId];
  if (!fac) notFound();

  // Fetch related gallery images from DB
  const galleryImages = await prisma.gallery.findMany({
    where: { status: "PUBLISHED", category: "Infrastructure" },
    orderBy: { order: "asc" },
    take: 6,
  });

  const allFacilities = Object.entries(FACILITY_DATA)
    .filter(([key]) => key !== id)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-white">

        {/* ── HERO ── */}
        <div className={`relative bg-gradient-to-br ${fac.color} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          {/* Background image with overlay */}
          {fac.heroImage && (
            <div className="absolute inset-0">
              <Image src={fac.heroImage} alt={fac.name} fill className="object-cover opacity-10" />
            </div>
          )}

          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <Link href="/facilities"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-10 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Facilities
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${fac.badgeColor} bg-white/10 border-white/20 text-white`}>
                  {fac.icon}
                  {fac.name}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white font-display leading-tight">
                  {fac.tagline}
                </h1>
                <p className="text-white/70 text-lg leading-relaxed">{fac.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/book-appointment"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition text-sm">
                    <CalendarDays className="w-4 h-4" /> Book Appointment
                  </Link>
                  <a href="tel:+911234567890"
                    className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition text-sm">
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {fac.stats.map(s => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-white font-display">{s.value}</div>
                    <div className="text-white/60 text-xs font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

          {/* About + Features */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">About this facility</span>
                <h2 className="text-3xl font-bold text-slate-900 font-display mt-2">{fac.name}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">{fac.longDescription}</p>

              {/* Procedures */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Procedures Performed</h3>
                <div className="flex flex-wrap gap-2">
                  {fac.procedures.map(p => (
                    <span key={p} className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Features checklist */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 p-8 space-y-4">
              <h3 className="font-bold text-slate-900 font-display flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" /> Key Features
              </h3>
              {fac.features.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technology</span>
              <h2 className="text-3xl font-bold text-slate-900 font-display">Advanced Equipment</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">State-of-the-art technology to ensure accurate diagnosis and safe treatment</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fac.equipment.map(e => (
                <div key={e.name} className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all space-y-3">
                  <div className="text-3xl">{e.icon}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm leading-snug">{e.name}</p>
                    <p className="text-slate-400 text-xs mt-1">{e.spec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div>
              <div className="text-center mb-10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Photo Tour</span>
                <h2 className="text-3xl font-bold text-slate-900 font-display">Inside Our Hospital</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map(img => (
                  <div key={img.id} className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                    <img src={img.mediaUrl} alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                      <div className="p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white font-bold text-sm">{img.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-center space-y-5">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white">
              {fac.icon}
            </div>
            <h2 className="text-3xl font-bold text-white font-display">Need {fac.name}?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
              Our team is available around the clock. Book a consultation or call us directly to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/book-appointment"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-7 py-3.5 rounded-xl hover:bg-slate-100 transition text-sm">
                <CalendarDays className="w-4 h-4" /> Book Appointment
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-7 py-3.5 rounded-xl border border-white/20 hover:bg-white/20 transition text-sm">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Other Facilities */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Other Facilities</h2>
              <Link href="/facilities" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {allFacilities.map(([key, f]) => (
                <Link key={key} href={`/facilities/${key}`}
                  className="group flex items-start gap-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl p-5 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                    <Building2 className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{f.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{f.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
