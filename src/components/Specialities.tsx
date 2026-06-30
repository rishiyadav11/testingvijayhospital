"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { SPECIALITIES } from "@/lib/constants";
import { staggerContainer, staggerItem, cardHoverAnimation } from "@/lib/animations";
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Users,
  Hospital,
  Activity,
  Stethoscope,
  Volume2,
  Eye,
  Smile,
  Ambulance
} from "lucide-react";

const getIcon = (iconName: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="w-5 h-5 text-rose-500 group-hover:text-white transition-colors duration-300" />,
    brain: <Brain className="w-5 h-5 text-purple-500 group-hover:text-white transition-colors duration-300" />,
    bone: <Bone className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors duration-300" />,
    baby: <Baby className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors duration-300" />,
    child: <Users className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />,
    surgery: <Hospital className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-300" />,
    kidney: <Activity className="w-5 h-5 text-rose-600 group-hover:text-white transition-colors duration-300" />,
    stomach: <Stethoscope className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />,
    ear: <Volume2 className="w-5 h-5 text-amber-500 group-hover:text-white transition-colors duration-300" />,
    eye: <Eye className="w-5 h-5 text-cyan-500 group-hover:text-white transition-colors duration-300" />,
    tooth: <Smile className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors duration-300" />,
    ambulance: <Ambulance className="w-5 h-5 text-red-500 group-hover:text-white transition-colors duration-300" />,
  };
  return iconMap[iconName] || <Hospital className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors duration-300" />;
};

const categories = ["All", "Surgery", "Medicine", "Pediatrics", "Emergency"];

export default function Specialities() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSpecialities = useMemo(() => {
    if (selectedCategory === "All") return SPECIALITIES;

    const categoryMap: Record<string, string[]> = {
      Surgery: ["general-surgery", "orthopedics", "urology"],
      Medicine: ["cardiology", "neurology", "gastroenterology", "ophthalmology"],
      Pediatrics: ["pediatrics", "maternity"],
      Emergency: ["emergency"],
    };

    const idsInCategory = categoryMap[selectedCategory] || [];
    return SPECIALITIES.filter((s) => idsInCategory.includes(s.id));
  }, [selectedCategory]);

  return (
    <section
      className="relative py-20 sm:py-32 overflow-hidden bg-slate-50"
      id="specialities"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-20 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
            Our Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Medical Specialties
            <span className="block text-emerald-600">& Departments</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed px-4 mt-4">
            Explore our comprehensive medical departments staffed with experienced specialists.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              variants={staggerItem}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                selectedCategory === category
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/10"
                  : "bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {filteredSpecialities.map((dept) => (
            <motion.div key={dept.id} variants={staggerItem}>
              <Link href={`/departments/${dept.id}`}>
                <motion.div {...cardHoverAnimation}>
                  <Card className="h-full overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 bg-white group rounded-3xl flex flex-col">
                    {/* Visual Card Image Header */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={dept.image}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
                      <span className="absolute top-4 right-4 text-[9px] font-bold tracking-widest uppercase bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-sm">
                        Department
                      </span>
                    </div>

                    <CardBody className="p-6 flex flex-col flex-grow relative">
                      {/* Overlapping Floating Icon Badge */}
                      <div className="absolute -top-6 left-6 w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-md shadow-slate-200/50 text-slate-600 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-colors duration-300">
                        {getIcon(dept.icon)}
                      </div>

                      <div className="pt-6 flex-grow flex flex-col justify-between h-full">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors mb-1">
                            {dept.name}
                          </h3>

                          {dept.hindiName && (
                            <p className="text-slate-400 text-xs italic font-medium mb-3">
                              {dept.hindiName}
                            </p>
                          )}

                          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-body">
                            {dept.description}
                          </p>
                        </div>

                        <div className="text-emerald-600 font-bold text-xs flex items-center gap-1.5 group mt-auto pt-4 border-t border-slate-50">
                          <span>Explore Services</span>
                          <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                            →
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredSpecialities.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg text-slate-500 font-medium">
              No departments found in this category. Please try another.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
