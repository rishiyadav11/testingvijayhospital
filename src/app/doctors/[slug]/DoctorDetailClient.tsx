"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  staggerItem,
} from "@/lib/animations";
import { Doctor } from "@/server/data";
import { Award, BookOpen, MessageSquare, Calendar, Star, Phone, Briefcase, User } from "lucide-react";

type TabType = "education" | "awards" | "reviews" | "slots";

interface DoctorDetailClientProps {
  doctor: Doctor;
}

const DoctorDetailClient: React.FC<DoctorDetailClientProps> = ({ doctor }) => {
  const [selectedTab, setSelectedTab] = useState<TabType>("education");

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: "education", label: "Education", icon: <BookOpen size={18} /> },
    { id: "awards", label: "Awards", icon: <Award size={18} /> },
    { id: "reviews", label: "Reviews", icon: <MessageSquare size={18} /> },
    { id: "slots", label: "Availability", icon: <Calendar size={18} /> },
  ];

  return (
    <div className="space-y-16">
      {/* Doctor Profile Hero */}
      <motion.div
        className="grid md:grid-cols-3 gap-8 md:gap-12 items-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Left: Doctor Image & Rating */}
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="sticky top-24">
            {/* Image */}
            <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
              {doctor.image && (doctor.image.startsWith('http://') || doctor.image.startsWith('https://') || doctor.image.startsWith('/')) ? (
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-24 h-24 text-primary/30" />
                </div>
              )}
            </div>

            {/* Rating Card */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-shadow"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Star className="fill-yellow-400 text-yellow-400" size={28} />
                <span className="text-4xl font-bold text-primary">
                  {doctor.rating}
                </span>
              </div>
              <p className="text-sm text-slate-600 text-center font-medium">
                Patient Rating
              </p>
              <p className="text-xs text-slate-500 text-center mt-2">
                Based on patient reviews
              </p>
            </motion.div>

            {/* Quick Contact */}
            <motion.a
              href="tel:+919306710615"
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone size={18} />
              Call Now
            </motion.a>
          </div>
        </motion.div>

        {/* Right: Doctor Info */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="space-y-6">
            {/* Name & Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-3">
                {doctor.name}
              </h1>
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                {doctor.specialty}
              </p>
              <p className="text-lg text-slate-700 font-semibold mb-1">
                {doctor.qualification}
              </p>
              <p className="text-slate-600 flex items-center gap-2">
                <Briefcase size={18} className="text-emerald-600" />
                <span>{doctor.experience}</span>
              </p>
            </div>
            {/* Bio */}
            <p className="text-lg text-slate-700 leading-relaxed">
              {doctor.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <motion.div 
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl text-center border border-emerald-200 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <p className="text-3xl font-bold text-emerald-700">15+</p>
                <p className="text-sm text-slate-700 mt-2 font-semibold">Years Experience</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl text-center border border-blue-200 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <p className="text-3xl font-bold text-blue-700">5000+</p>
                <p className="text-sm text-slate-700 mt-2 font-semibold">Patients Treated</p>
              </motion.div>
              <motion.div 
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-2xl text-center border border-amber-200 hover:shadow-lg transition-all"
                whileHover={{ y: -4 }}
              >
                <p className="text-3xl font-bold text-amber-700">98%</p>
                <p className="text-sm text-slate-700 mt-2 font-semibold">Success Rate</p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/book-appointment" className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full group !text-black"
                >
                  <Calendar size={20} className="mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Ask a Question
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tab Section */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-bold rounded-xl transition-all border-b-3 ${
                selectedTab === tab.id
                  ? "bg-emerald-50 text-emerald-700 border-emerald-600"
                  : "text-slate-600 border-transparent hover:text-emerald-600 hover:bg-slate-50"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Education Tab */}
          {selectedTab === "education" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                Education & Qualifications
              </h3>
              <div className="space-y-4">
                {doctor.education.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    className="flex gap-4 p-6 bg-slate-50 rounded-2xl border-l-4 border-primary hover:shadow-lg transition-shadow"
                    variants={staggerItem}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-shrink-0 pt-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                        ✓
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900 text-lg">
                        {edu.degree}
                      </h4>
                      <p className="text-slate-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-slate-500 mt-1">{edu.year}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Awards & Certifications Tab */}
          {selectedTab === "awards" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Awards & Certifications
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-slate-900">
                    🏅 Certifications
                  </h4>
                  {doctor.certifications.map((cert, idx) => (
                    <motion.div
                      key={idx}
                      className="p-5 bg-blue-50 rounded-2xl border-2 border-blue-200 hover:shadow-lg transition-all"
                      variants={staggerItem}
                      whileHover={{ y: -2 }}
                    >
                      <p className="font-semibold text-slate-900">{cert.name}</p>
                      <p className="text-sm text-slate-600 mt-1">{cert.issuer}</p>
                      <p className="text-xs text-slate-500 mt-2">{cert.year}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-slate-900">
                    🏆 Awards
                  </h4>
                  {doctor.awards.map((award, idx) => (
                    <motion.div
                      key={idx}
                      className="p-5 bg-yellow-50 rounded-2xl border-2 border-yellow-200 hover:shadow-lg transition-all"
                      variants={staggerItem}
                      whileHover={{ y: -2 }}
                    >
                      <p className="font-semibold text-slate-900">{award.name}</p>
                      <p className="text-sm text-slate-600 mt-1">{award.issuer}</p>
                      <p className="text-xs text-slate-500 mt-2">{award.year}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {selectedTab === "reviews" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Patient Reviews
              </h3>
              <div className="space-y-4">
                {doctor.reviews.map((review, idx) => (
                  <motion.div
                    key={idx}
                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow"
                    variants={staggerItem}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">
                          {review.name}
                        </h4>
                        <p className="text-sm text-slate-500">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Tab */}
          {selectedTab === "slots" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Available Consultation Slots
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {doctor.availableSlots.map((slot, idx) => (
                  <motion.div
                    key={idx}
                    className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border-2 border-primary/20 hover:shadow-lg transition-all text-center"
                    variants={staggerItem}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <p className="font-bold text-slate-900 text-lg">{slot.day}</p>
                    <p className="text-primary font-semibold mt-2">{slot.time}</p>
                    <p className="text-xs text-slate-600 mt-2">Available</p>
                  </motion.div>
                ))}
              </div>
              <Link href="/book-appointment" className="block">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full group mt-4"
                >
                  <Calendar size={20} className="mr-2" />
                  Book Your Slot Now
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold text-slate-900">Services Offered</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Consultation", "Follow-up", "Surgery", "Diagnosis", "Treatment", "Prevention"].map(
            (service, idx) => (
              <motion.div
                key={idx}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center hover:bg-primary/5 hover:border-primary/20 transition-colors"
                whileHover={{ y: -2 }}
              >
                <p className="font-semibold text-slate-900">{service}</p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDetailClient;
