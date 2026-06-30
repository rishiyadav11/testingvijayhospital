"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHoverAnimation,
} from "@/lib/animations";
import { doctors } from "@/server/data";
import { Search, User, Star } from "lucide-react";

const DoctorGridClient: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get unique specialties
  const specialties = useMemo(() => {
    const unique = Array.from(new Set(doctors.map((d) => d.specialty)));
    return ["All", ...unique.sort()];
  }, []);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSpecialty =
        selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
      const matchesSearch =
        !searchQuery ||
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, searchQuery]);

  // Calculate review count and average rating
  const getReviewStats = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    const reviews = doctor?.reviews || [];
    return {
      count: reviews.length,
      rating: doctor?.rating || 0,
    };
  };

  return (
    <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Section */}
        <motion.div
          className="mb-16 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 shadow-sm focus:shadow-lg"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-slate-400" />
              </span>
            </div>
          </div>

          {/* Specialty Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Filter by Specialty
              </h3>
              <button
                onClick={() => setSelectedSpecialty("All")}
                className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {specialties.map((specialty) => (
                <motion.button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedSpecialty === specialty
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 scale-105"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {specialty}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <motion.p className="text-sm text-slate-600 text-center">
            Found{" "}
            <span className="font-bold text-primary text-base">
              {filteredDoctors.length}
            </span>{" "}
            doctor{filteredDoctors.length !== 1 ? "s" : ""}
          </motion.p>
        </motion.div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredDoctors.map((doctor) => {
              const { count: reviewCount, rating } = getReviewStats(doctor.id);
              const displayRating = doctor.rating || 4.8;

              return (
                <motion.div key={doctor.id} variants={staggerItem}>
                  <Link href={`/doctors/${doctor.id}`}>
                    <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group relative">
                      <div className="relative w-full h-80 bg-gradient-to-br from-slate-300 to-slate-400 overflow-hidden">
                        {doctor.image && (doctor.image.startsWith('http://') || doctor.image.startsWith('https://') || doctor.image.startsWith('/')) ? (
                          <Image
                            src={doctor.image}
                            alt={doctor.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 flex items-center justify-center">
                            <User className="w-20 h-20 text-primary/40" />
                          </div>
                        )}

                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


                        {/* Rating Badge */}
                        <motion.div
                          className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-lg flex items-center gap-2 border border-white/50"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">
                              {displayRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-600">
                              ({reviewCount})
                            </span>
                          </div>
                        </motion.div>

                        {/* Specialty Badge */}
                        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {doctor.specialty}
                        </div>
                      </div>

                      {/* Doctor Info Section */}
                      <CardBody className="space-y-4 flex flex-col h-full">
                        {/* Name and Title */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-slate-500 font-semibold">
                            {doctor.qualification}
                          </p>
                        </div>
                        {/* Experience */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                          <span className="text-lg">💼</span>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Experience</p>
                            <p className="text-sm text-slate-600">{doctor.experience}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-3 flex-grow">
                          {doctor.about}
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4 border-t border-slate-200">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full"
                          >
                            <Link href={`/doctors/${doctor.id}`}>
                              <Button
                                variant="primary"
                                size="sm"
                                className="w-full font-bold"
                              >
                                View Profile
                              </Button>
                            </Link>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full"
                          >
                            <Link href="/book-appointment">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                              >
                                Book Now
                              </Button>
                            </Link>
                          </motion.div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block space-y-4">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900">
                No doctors found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DoctorGridClient;
