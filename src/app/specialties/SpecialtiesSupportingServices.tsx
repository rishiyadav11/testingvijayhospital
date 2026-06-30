"use client";

import { motion } from "framer-motion";
import { FlaskConical, Activity, HeartPulse } from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "pathology":
      return <FlaskConical className="w-12 h-12 text-primary" />;
    case "physio":
      return <Activity className="w-12 h-12 text-primary" />;
    case "imaging":
      return <HeartPulse className="w-12 h-12 text-primary" />;
    default:
      return <Activity className="w-12 h-12 text-primary" />;
  }
};

export default function SpecialtiesSupportingServices() {
  const services = [
    {
      icon: "pathology",
      title: "Pathology Lab",
      desc: "Fully automated, high-precision laboratory testing for hematology, biochemistry, and microbiology.",
    },
    {
      icon: "physio",
      title: "Physiotherapy & Rehab",
      desc: "Tailored post-operative recovery, joint pain management, and physical rehabilitation programs.",
    },
    {
      icon: "imaging",
      title: "Diagnostics & Imaging",
      desc: "High-speed digital X-rays, ultrasound scans, and advanced cardiac monitoring (ECG, Holter).",
    },
  ];

  return (
    <section className="py-20 md:py-32 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Supporting Healthcare
            <span className="block text-primary">Services</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive in-house facilities to support patient recovery and
            accurate clinical diagnostics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">{getIcon(service.icon)}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
