"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { 
  Heart, 
  Baby, 
  Activity, 
  Shield, 
  Ambulance, 
  Brain, 
  Hospital, 
  HeartHandshake, 
  Users, 
  CheckCircle2, 
  Star, 
  ChevronRight 
} from "lucide-react";

const getStoryIcon = (iconName: string) => {
  switch (iconName) {
    case "heart":
      return <Heart className="w-12 h-12 text-rose-500 fill-rose-500/10" />;
    case "baby":
      return <Baby className="w-12 h-12 text-blue-500" />;
    case "run":
      return <Activity className="w-12 h-12 text-emerald-500" />;
    case "ribbon":
      return <Shield className="w-12 h-12 text-purple-500 fill-purple-500/10" />;
    case "ambulance":
      return <Ambulance className="w-12 h-12 text-red-500" />;
    case "brain":
      return <Brain className="w-12 h-12 text-indigo-500" />;
    case "hospital":
      return <Hospital className="w-12 h-12 text-sky-500" />;
    case "heart-gift":
      return <HeartHandshake className="w-12 h-12 text-pink-500" />;
    default:
      return <Hospital className="w-12 h-12 text-slate-500" />;
  }
};

const getStatIcon = (iconName: string) => {
  switch (iconName) {
    case "users":
      return <Users className="w-8 h-8 text-primary" />;
    case "check":
      return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
    case "star":
      return <Star className="w-8 h-8 text-amber-500 fill-amber-500" />;
    case "hospital":
      return <Hospital className="w-8 h-8 text-sky-500" />;
    default:
      return <Hospital className="w-8 h-8 text-slate-500" />;
  }
};

import Link from "next/link";

const PatientStoriesContent = ({ initialStories = [] }: { initialStories?: any[] }) => {
  const stories = initialStories;

  const specialties = [
    "All",
    ...Array.from(new Set(stories.map((s) => s.specialty))),
  ];
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const filteredStories = useMemo(() => {
    return selectedSpecialty === "All"
      ? stories
      : stories.filter((story) => story.specialty === selectedSpecialty);
  }, [selectedSpecialty]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const successStats = [
    {
      label: "Patients Treated",
      value: "50,000+",
      icon: "users",
    },
    {
      label: "Success Rate",
      value: "98.5%",
      icon: "check",
    },
    {
      label: "Years of Excellence",
      value: "15+",
      icon: "star",
    },
    {
      label: "Specialties",
      value: "10+",
      icon: "hospital",
    },
  ];

  return (
    <div className="space-y-16 mt-12">
      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-2 md:gap-3 justify-center"
      >
        {specialties.map((specialty) => (
          <motion.button
            key={specialty}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            onClick={() => setSelectedSpecialty(specialty)}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 ${
              selectedSpecialty === specialty
                ? "bg-gradient-to-r from-primary to-accent text-black shadow-lg"
                : "bg-white text-slate-700 border border-slate-200 hover:border-primary hover:text-primary"
            }`}
          >
            {specialty}
          </motion.button>
        ))}
      </motion.div>

      {/* Patient Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="wait">
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              layout
              className="h-full"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100">
                <CardBody className="space-y-4">
                  {/* Profile Section */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-4">
                        {getStoryIcon(story.image)}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {story.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Age: {story.age} years
                      </p>
                    </div>
                  </div>

                  {/* Specialty & Condition */}
                  <div className="space-y-2">
                    <div className="inline-block">
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        {story.specialty}
                      </span>
                    </div>
                    <p className="text-sm text-accent font-semibold">
                      {story.condition}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-yellow-400 text-lg"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>

                  {/* Story Quote */}
                  <p className="text-slate-600 leading-relaxed line-clamp-3 italic">
                    "{story.story}"
                  </p>

                  {/* Recovery Time */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Recovery Time: <span className="font-semibold text-slate-700">{story.recoveryTime}</span>
                    </p>
                  </div>

                  {/* Read More Link */}
                  <Link href={`/patient-stories/${story.id}`}>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors mt-2 cursor-pointer"
                    >
                      Read Full Story <ChevronRight size={18} />
                    </motion.span>
                  </Link>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Success Timeline Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {successStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 text-center border border-primary/20 flex flex-col items-center justify-center"
            >
              <div className="mb-3">{getStatIcon(stat.icon)}</div>
              <p className="text-2xl md:text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Share Your Story CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary via-accent to-warm text-white rounded-2xl p-8 md:p-12 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4 !text-black"
        >
          Your Story Matters
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-lg mb-8 !text-slate-900 max-w-2xl mx-auto font-medium"
        >
          Have you been treated at Vijay Hospital? We'd love to hear about your
          journey and how we helped you. Your story can inspire others and help
          them make informed healthcare decisions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-black hover:bg-slate-100 border-white !text-black"
            onClick={() => {
              window.location.href = "/contact";
            }}
          >
            Share Your Story
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PatientStoriesContent;
