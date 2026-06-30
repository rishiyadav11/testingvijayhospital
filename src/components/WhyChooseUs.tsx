"use client";

import React from "react";
import { ShieldCheck, Award, HeartHandshake, Ambulance, Landmark, Activity } from "lucide-react";

export default function WhyChooseUs() {
  const stats = [
    {
      value: "15+",
      label: "Years of Care",
      hindi: "15+ वर्षों का विश्वास",
      description: "A clinical legacy of trusted healthcare.",
      icon: Award,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
      glow: "hover:shadow-indigo-100/50 hover:border-indigo-200"
    },
    {
      value: "50k+",
      label: "Patients Served",
      hindi: "50,000+ स्वस्थ मरीज",
      description: "Empowering health across Narnaul and beyond.",
      icon: HeartHandshake,
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-100",
      glow: "hover:shadow-rose-100/50 hover:border-rose-200"
    },
    {
      value: "20+",
      label: "Expert Consultants",
      hindi: "20+ विशेषज्ञ चिकित्सक",
      description: "Dedicated team of leading medical specialists.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
      glow: "hover:shadow-emerald-100/50 hover:border-emerald-200"
    },
    {
      value: "24/7",
      label: "Emergency Support",
      hindi: "24/7 आपातकालीन सेवा",
      description: "Round-the-clock trauma care and pharmacy.",
      icon: Ambulance,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
      glow: "hover:shadow-amber-100/50 hover:border-amber-200"
    }
  ];

  const features = [
    {
      title: "Advanced Medical Tech",
      hindi: "आधुनिक चिकित्सा तकनीक",
      description: "Equipped with state-of-the-art modular operation theatres, ultra-clean ICU wards with HEPA filters, high-resolution diagnostic labs, and advanced patient monitors for precise treatments.",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/5 border-primary/10"
    },
    {
      title: "Cashless TPA & Empathetic Care",
      hindi: "कैशलेस और मरीज-केन्द्रित उपचार",
      description: "Empaneled with major cashless insurance TPAs and the PM-JAY (Ayushman Bharat) scheme. Our compassionate staff handles all administrative paperwork so you can focus on healing.",
      icon: Landmark,
      color: "text-secondary",
      bg: "bg-secondary/5 border-secondary/10"
    },
    {
      title: "Strategic & Accessible Location",
      hindi: "आसानी से पहुँच योग्य स्थान",
      description: "Conveniently located in the heart of Narnaul, directly opposite the Narnaul Bus Stand. Features an on-site 24/7 emergency unit, fully stocked pharmacy, and rapid ambulance pickup.",
      icon: Ambulance,
      color: "text-primary",
      bg: "bg-primary/5 border-primary/10"
    }
  ];

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-surface to-white" id="why-choose-us">
      {/* Background soft aurora blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Trust & Legacy
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-primary">
            Why Choose Vijay Hospital?
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed px-4">
            Delivering high-quality, compassionate, and affordable healthcare to Narnaul for over a decade.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`group bg-white/60 backdrop-blur-md border border-outline-variant/30 p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center gap-4 cursor-default ${stat.glow}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <span className="block text-3xl sm:text-4xl font-extrabold font-display text-primary tracking-tight">
                    {stat.value}
                  </span>
                  <span className="block text-sm font-bold text-primary leading-snug">
                    {stat.label}
                  </span>
                  <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-primary/5 text-primary/80 font-bold font-body tracking-wide border border-primary/10">
                    {stat.hindi}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant/80 font-body leading-relaxed max-w-[200px]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Core Strengths Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group bg-surface-container-low/70 border border-outline-variant/20 p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col gap-4 sm:gap-5"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feature.bg}`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-primary font-display flex flex-col gap-0.5">
                    <span>{feature.title}</span>
                    <span className="text-xs text-on-surface-variant/65 font-bold font-body">
                      {feature.hindi}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant/85 font-body leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
