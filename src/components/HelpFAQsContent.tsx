"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ChevronDown, Search, Mail, Phone, MapPin, Send } from "lucide-react";

const HelpFAQsContent = () => {
  const faqsData: Record<
    string,
    Array<{ question: string; answer: string }>
  > = {
    Appointments: [
      {
        question: "How do I book an appointment?",
        answer:
          "Visit the 'Book Appointment' page on our website, select your department and preferred doctor, choose your convenient date and time slot, and confirm. You'll receive a confirmation SMS and email immediately.",
      },
      {
        question: "Can I reschedule my appointment?",
        answer:
          "Yes, you can reschedule your appointment up to 24 hours before the scheduled time. Contact our appointment desk at +91 93067 10615 or use the reschedule option in your confirmation email.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Appointments can be cancelled free of charge up to 24 hours before the scheduled time. Cancellations within 24 hours may be subject to a nominal fee as per hospital policy.",
      },
      {
        question: "Do you offer online consultations?",
        answer:
          "Yes, we offer telemedicine consultations for non-emergency cases. You can book a video consultation with our doctors through the online appointment system.",
      },
    ],
    Insurance: [
      {
        question: "What insurance plans do you accept?",
        answer:
          "We accept PM-JAY (Ayushman Bharat), ICICI Lombard, Bajaj Allianz, Star Health, HDFC ERGO, Aditya Birla, and many other major insurance companies. Please contact our billing desk for the complete list.",
      },
      {
        question: "Do you provide cashless treatment?",
        answer:
          "Yes, we provide cashless treatment for eligible insurance policies. Our billing team will verify your coverage and arrange the necessary paperwork at admission.",
      },
      {
        question: "What documents are required for insurance claims?",
        answer:
          "You'll need your insurance card, doctor's referral, valid ID proof, medical reports, and discharge summary. Our billing department will assist you in filing the complete documentation.",
      },
      {
        question: "How long does insurance claim processing take?",
        answer:
          "Insurance claims are typically processed within 2-4 weeks after submission. Our billing team will keep you updated on the claim status throughout the process.",
      },
    ],
    Emergency: [
      {
        question: "What are your emergency operating hours?",
        answer:
          "Our Emergency Department is open 24/7 throughout the year. Call +91 93067 10615 for immediate assistance at any time.",
      },
      {
        question: "Do you provide ambulance services?",
        answer:
          "Yes, we provide emergency ambulance services with trained paramedics. Call our emergency hotline and we'll dispatch an ambulance to your location immediately.",
      },
      {
        question: "What should I do in case of a medical emergency?",
        answer:
          "Call our emergency number +91 93067 10615 immediately. Provide your location, patient details, and symptoms. Stay calm and follow the paramedic's instructions until they arrive.",
      },
      {
        question: "Is there a trauma center available?",
        answer:
          "Yes, our hospital has a fully equipped trauma center with experienced trauma surgeons and ICU facilities to handle critical trauma cases.",
      },
    ],
    "Medical Records": [
      {
        question: "How can I access my medical records?",
        answer:
          "Contact our Medical Records Department with a valid ID. We provide medical records within 2-3 business days. You can request copies of your reports, discharge summaries, and other documents.",
      },
      {
        question: "Can I get my medical records digitally?",
        answer:
          "Yes, we can provide digital copies of your medical records via email. Request this at our records department and provide your email address for secure delivery.",
      },
      {
        question: "Is there a fee for medical records?",
        answer:
          "A nominal administrative fee applies for medical records. Physical copies: ₹50 per page. Digital copies: ₹100 per request. Exact charges will be informed at the time of request.",
      },
    ],
    "Admission & Documents": [
      {
        question: "What documents do I need for admission?",
        answer:
          "Bring a valid ID (Aadhaar/PAN/Passport), insurance card, medical reports, doctor's referral letter (if applicable), and a list of current medications.",
      },
      {
        question: "Can I choose my hospital room type?",
        answer:
          "Yes, we offer various room options: General Wards, Semi-Private, Private, and Deluxe rooms. Availability depends on your medical condition and hospital occupancy.",
      },
      {
        question: "What are the visiting hours?",
        answer:
          "General visiting hours are 10:00 AM - 1:00 PM and 5:00 PM - 8:00 PM. ICU and critical care units have restricted visiting hours. Only one attendant is allowed during non-visiting hours.",
      },
      {
        question: "Do you have a patient ombudsman?",
        answer:
          "Yes, we have a patient ombudsman available to address patient grievances and concerns. Contact our administration office for assistance.",
      },
    ],
    "Special Services": [
      {
        question: "Do you offer home healthcare services?",
        answer:
          "Yes, we provide comprehensive home healthcare services including post-operative care, elderly care, chronic disease management, and physiotherapy at your home.",
      },
      {
        question: "What is your labor and delivery process?",
        answer:
          "We provide family-centered maternity care with modern labor rooms, experienced obstetricians, neonatal support, and post-natal care. Husbands can accompany during labor with our LDRP (Labor, Delivery, Recovery, Postpartum) rooms.",
      },
      {
        question: "Do you have specialized pediatric services?",
        answer:
          "Yes, our Pediatrics Department offers comprehensive child healthcare, neonatal ICU, vaccination programs, and child nutrition counseling with experienced pediatricians.",
      },
      {
        question: "Can I get physiotherapy appointments?",
        answer:
          "Yes, we offer in-hospital and outpatient physiotherapy services. Our skilled physiotherapists provide rehabilitation after surgery and treatment for musculoskeletal conditions.",
      },
    ],
  };

  const categories = Object.keys(faqsData);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredFAQs = useMemo(() => {
    const categoryFAQs = faqsData[selectedCategory] || [];
    if (!searchTerm.trim()) return categoryFAQs;
    return categoryFAQs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCategory, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Help & FAQs
        </h1>
        <p className="text-lg text-slate-600">
          Find answers to common questions about our hospital, services, and procedures.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setExpandedIndex(0);
            }}
            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-700 placeholder-slate-400"
          />
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex flex-wrap gap-2 md:gap-3 justify-start md:justify-center"
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            onClick={() => {
              setSelectedCategory(category);
              setSearchTerm("");
              setExpandedIndex(0);
            }}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === category
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                : "bg-white text-slate-700 border border-slate-200 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* FAQs Accordion */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 md:space-y-4"
      >
        <AnimatePresence mode="wait">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, idx) => (
              <motion.div
                key={`${selectedCategory}-${idx}`}
                variants={itemVariants}
                layout
              >
                <Card
                  className={`overflow-hidden border transition-all duration-300 ${
                    expandedIndex === idx
                      ? "border-primary shadow-lg"
                      : "border-slate-200"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === idx ? -1 : idx)
                    }
                    className="w-full text-left p-4 md:p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 flex-1">
                        {faq.question}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: expandedIndex === idx ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {expandedIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 py-4 md:py-5 bg-gradient-to-br from-primary/5 to-accent/5 border-t border-slate-200">
                          <p className="text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-slate-600 text-lg">
                No FAQs found. Try a different search term or category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Can't Find Answer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <CardBody className="text-center py-8 md:py-12">
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-3"
            >
              Can't Find Your Answer?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              className="text-slate-600 mb-6"
            >
              We're here to help! Get in touch with our support team or submit
              a question.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => setShowContactForm(!showContactForm)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Send us a Message
            </motion.button>
          </CardBody>
        </Card>
      </motion.div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Send us a Message
              </h3>
              <p className="text-slate-600 mb-6">
                Our team will get back to you within 24 hours.
              </p>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Question
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe your question or concern"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowContactForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl p-6 md:p-10"
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-6">
          Still Need Help? Reach Out
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="flex gap-4 items-start"
          >
            <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Emergency</p>
              <a
                href="tel:+919306710615"
                className="hover:underline text-white/90"
              >
                +91 93067 10615
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="flex gap-4 items-start"
          >
            <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Email</p>
              <a
                href="mailto:support@vijayhospitalnarnaul.com"
                className="hover:underline text-white/90"
              >
                support@vijayhospitalnarnaul.com
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex gap-4 items-start"
          >
            <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Address</p>
              <p className="text-white/90">
                Opposite Bus Stand, Narnaul, Haryana
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpFAQsContent;
