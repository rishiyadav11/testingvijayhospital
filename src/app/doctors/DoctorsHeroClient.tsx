"use client";

import { motion } from "framer-motion";
import { Stethoscope, ShieldCheck, Clock, Award } from "lucide-react";

const STATS = [
  { value: "20+", label: "Specialist Doctors", icon: <Stethoscope className="w-4 h-4" /> },
  { value: "15+", label: "Years of Excellence", icon: <Award className="w-4 h-4" /> },
  { value: "24/7", label: "Available Care", icon: <Clock className="w-4 h-4" /> },
  { value: "NABH", label: "Accredited", icon: <ShieldCheck className="w-4 h-4" /> },
];

export default function DoctorsHeroClient() {
  return (
    <section className="relative bg-white overflow-hidden border-b border-slate-100">
      {/* subtle dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #0a5c46 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest">
              <Stethoscope className="w-3.5 h-3.5" />
              Expert Medical Team
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Doctors &amp; Specialists
              </span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
              Highly qualified specialists with decades of combined experience — delivering compassionate, world-class medical care across every major discipline.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                    {s.icon}
                  </div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-[11px] text-slate-400 font-semibold leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — decorative doctor illustration placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* outer ring */}
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 flex items-center justify-center">
                {/* inner circle */}
                <div className="w-52 h-52 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <img
                    src="/hero_doctor.png"
                    alt="Vijay Hospital doctors"
                    className="w-44 h-44 object-contain drop-shadow-lg"
                  />
                </div>
              </div>

              {/* floating badge — top right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-lg">🏥</span>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">NABH Accredited</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Certified Quality</p>
                </div>
              </motion.div>

              {/* floating badge — bottom left */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-6 bg-white border border-slate-100 shadow-xl rounded-2xl px-4 py-2.5 flex items-center gap-2"
              >
                <span className="text-lg">⭐</span>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">4.9 / 5 Rating</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Patient Satisfaction</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
