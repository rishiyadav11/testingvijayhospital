"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Info,
  Stethoscope,
  Users,
  Building2,
  HeartPulse,
  Package,
  CalendarCheck,
  Newspaper,
  Briefcase,
  Globe,
  MessageCircle,
  Image as ImageIcon,
  Star,
  BookOpen,
  HelpCircle,
  Phone,
  ShieldCheck,
  ExternalLink,
  Lock,
  type LucideIcon,
} from "lucide-react";

type Page = { name: string; href?: string; icon: LucideIcon };

const PAGES_7: Page[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Specialities", href: "/specialties", icon: Stethoscope },
  { name: "Services", href: "/departments", icon: Building2 },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Testimonials", href: "/testimonials", icon: Star },
  { name: "Contact", href: "/contact", icon: Phone },
];

const PAGES_FULL: Page[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Specialities", href: "/specialties", icon: Stethoscope },
  { name: "Doctors", href: "/doctors", icon: Users },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Facilities", href: "/facilities", icon: HeartPulse },
  { name: "Patient Care", href: "/patient-care", icon: HeartPulse },
  { name: "Health Packages", href: "/health-packages", icon: Package },
  { name: "Book Appointment", href: "/book-appointment", icon: CalendarCheck },
  { name: "Health Blog", href: "/blogs", icon: Newspaper },
  { name: "Careers", href: "/careers", icon: Briefcase },
  { name: "International Patients", href: "/international-patients", icon: Globe },
  { name: "Patient Stories", href: "/patient-stories", icon: MessageCircle },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Testimonials", href: "/testimonials", icon: Star },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Help & FAQs", href: "/help-faqs", icon: HelpCircle },
  { name: "Contact", href: "/contact", icon: Phone },
  { name: "Admin Dashboard", href: "/admin", icon: ShieldCheck },
];

type View = "p35" | "p80";

const META: Record<
  View,
  {
    tab: string;
    tabSub: string;
    tier: string;
    tierClass: string;
    title: string;
    strike: string;
    price: string;
    priceNote: string;
    count: string;
    note: string;
    accent: string;
  }
> = {
  p35: {
    tab: "₹35,000",
    tabSub: "What we agreed",
    tier: "What we agreed",
    tierClass: "bg-slate-100 text-slate-500",
    title: "7-page brochure site",
    strike: "",
    price: "₹35,000",
    priceNote: "one-time",
    count: "7 pages",
    note: "Just the basics — tap any page to open it live.",
    accent: "#e2e8f0",
  },
  p80: {
    tab: "₹80,000",
    tabSub: "What you actually got",
    tier: "What you actually got",
    tierClass: "bg-emerald-50 text-emerald-700",
    title: "Full hospital website",
    strike: "₹1,20,000 market price",
    price: "₹80,000",
    priceNote: "one-time · save ₹40,000",
    count: "19 live pages",
    note: "Tap any page below to open it live — it's all already built.",
    accent: "#10b981",
  },
};

function PageTile({ page, locked }: { page: Page; locked: boolean }) {
  const Icon = page.icon;
  const inner = (
    <>
      <div
        className={`flex-none w-9 h-9 rounded-lg flex items-center justify-center ${
          locked ? "bg-slate-100 text-slate-400" : "bg-sky-50 text-sky-600"
        }`}
      >
        <Icon className="w-4.5 h-4.5" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`text-sm font-medium truncate ${
            locked ? "text-slate-500" : "text-slate-800"
          }`}
        >
          {page.name}
        </div>
        {!locked && page.href && (
          <div className="text-[11px] text-slate-400 truncate">{page.href}</div>
        )}
      </div>
      {locked ? (
        <Lock className="w-3.5 h-3.5 text-slate-300 flex-none" />
      ) : (
        page.href && (
          <ExternalLink className="w-3.5 h-3.5 text-sky-400 flex-none" />
        )
      )}
    </>
  );

  if (locked || !page.href) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
        {inner}
      </div>
    );
  }

  return (
    <a
      href={page.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition-all hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5"
    >
      {inner}
    </a>
  );
}

export default function ProposalPage() {
  const [view, setView] = useState<View>("p35");
  const m = META[view];
  const pages = view === "p35" ? PAGES_7 : PAGES_FULL;
  const locked = false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-sky-50/40 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-7">
          <p className="text-xs tracking-[0.18em] uppercase text-sky-600 font-medium">
            Vijay Hospital · Website
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900">
            See exactly what each budget builds
          </h1>
          <p className="mt-2 text-slate-500">
            Switch between the two to see the actual pages
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-1.5 bg-slate-100 rounded-full p-1.5 max-w-md mx-auto mb-7">
          {(["p35", "p80"] as const).map((k) => {
            const on = view === k;
            return (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`flex-1 rounded-full py-2.5 px-2 leading-tight transition-all ${
                  on
                    ? "bg-white shadow-md text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="block text-xs font-normal opacity-80">
                  {META[k].tabSub}
                </span>
                <span className="text-base font-semibold">{META[k].tab}</span>
              </button>
            );
          })}
        </div>

        {/* Card */}
        <motion.div
          animate={{ borderColor: m.accent }}
          className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden"
        >
          {/* Price header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-3">
            <div>
              <span
                className={`inline-block text-xs font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${m.tierClass}`}
              >
                {m.tier}
              </span>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {m.title}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">{m.note}</p>
            </div>
            <div className="text-right whitespace-nowrap">
              <div className="h-4 text-xs text-slate-400 line-through">
                {m.strike}
              </div>
              <div className="text-3xl font-semibold text-slate-900 leading-tight">
                {m.price}
              </div>
              <div className="text-xs text-slate-400">{m.priceNote}</div>
              <div className="mt-1 text-xs font-medium text-sky-600">
                {m.count}
              </div>
            </div>
          </div>

          {/* Page grid */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-2.5"
              >
                {pages.map((p) => (
                  <PageTile key={p.name} page={p} locked={locked} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-400 mt-5 max-w-lg mx-auto">
          Same developer. Same hospital. The ₹80,000 version is the complete site
          you can click through right now.
        </p>
      </div>
    </div>
  );
}
