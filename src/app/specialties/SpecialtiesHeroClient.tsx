"use client";

import { motion } from "framer-motion";
import { fadeInUp, slideInLeft } from "@/lib/animations";
import { Hospital } from "lucide-react";

export default function SpecialtiesHeroClient() {
  return (
    <>
      {/* Animated Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-sky-100 to-accent/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20 md:py-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md text-primary px-6 py-2 rounded-full border border-white/50"
          >
            <Hospital className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wide">Our Expertise</span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Medical Specialties &<br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">
              Expert Departments
            </span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            Vijay Hospital brings together world-class clinicians and advanced
            technology to offer tertiary care across 8+ specialized departments.
            Discover comprehensive healthcare excellence.
          </motion.p>

          <motion.div
            {...slideInLeft}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <a
              href="#specialities"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Explore Specialties
            </a>
            <a
              href="/doctors"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-full border border-white/50 hover:bg-white/30 transition-all duration-300"
            >
              Meet Our Doctors
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
