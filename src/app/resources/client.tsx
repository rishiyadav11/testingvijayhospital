"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHoverAnimation,
} from "@/lib/animations";
import { generateResourcePDF } from "@/lib/generateResourcePDF";

interface Resource {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: "health-tips" | "patient-education" | "insurance";
  type: "PDF";
  size: string;
  downloads: number;
  image?: string;
  featured?: boolean;
}

const ResourcesPageClient = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Enhanced resources with download counters and categories
  const resources: Resource[] = [
    {
      id: "admission-checklist",
      icon: "📋",
      title: "Patient Admission Checklist",
      description: "Complete list of documents and preparations needed for hospital admission",
      category: "patient-education",
      type: "PDF",
      size: "2.4 MB",
      downloads: 1245,
      image: "/opd_suite.png",
      featured: true,
    },
    {
      id: "medication-guide",
      icon: "💊",
      title: "Medication Guide",
      description: "Understanding your medications and proper usage guidelines",
      category: "patient-education",
      type: "PDF",
      size: "1.8 MB",
      downloads: 892,
      image: "/pharmacy.png",
      featured: true,
    },
    {
      id: "post-surgery",
      icon: "🏃",
      title: "Post-Surgery Recovery Guide",
      description: "Step-by-step recovery instructions after surgical procedures",
      category: "patient-education",
      type: "PDF",
      size: "3.2 MB",
      downloads: 567,
      image: "/emergency_room.png",
    },
    {
      id: "heart-health",
      icon: "❤️",
      title: "Heart Health Guide",
      description: "Comprehensive guide to maintaining cardiovascular health",
      category: "health-tips",
      type: "PDF",
      size: "2.6 MB",
      downloads: 1654,
      image: "/diagnostic_lab.png",
      featured: true,
    },
    {
      id: "wellness",
      icon: "🧘",
      title: "Wellness & Exercise",
      description: "Safe exercises and wellness practices for all age groups",
      category: "health-tips",
      type: "PDF",
      size: "2.1 MB",
      downloads: 2103,
      image: "/opd_suite.png",
    },
    {
      id: "nutrition",
      icon: "🥗",
      title: "Nutrition Guidelines",
      description: "Dietary recommendations for various health conditions",
      category: "health-tips",
      type: "PDF",
      size: "1.9 MB",
      downloads: 1876,
      image: "/pharmacy.png",
    },
    {
      id: "childcare",
      icon: "👶",
      title: "Childcare Handbook",
      description: "Baby care tips, vaccination schedule, and parenting guidance",
      category: "patient-education",
      type: "PDF",
      size: "2.8 MB",
      downloads: 945,
      image: "/diagnostic_lab.png",
    },
    {
      id: "sleep-health",
      icon: "🌙",
      title: "Sleep Health Guide",
      description: "Tips for better sleep and managing sleep disorders",
      category: "health-tips",
      type: "PDF",
      size: "1.6 MB",
      downloads: 1423,
      image: "/emergency_room.png",
    },
    {
      id: "mental-wellness",
      icon: "🧠",
      title: "Mental Wellness Resource",
      description: "Mental health information and stress management techniques",
      category: "health-tips",
      type: "PDF",
      size: "2.3 MB",
      downloads: 1087,
      image: "/opd_suite.png",
    },
    {
      id: "insurance-guide",
      icon: "🛡️",
      title: "Insurance Coverage Guide",
      description: "Understanding insurance claims, coverage, and reimbursement procedures",
      category: "insurance",
      type: "PDF",
      size: "2.2 MB",
      downloads: 756,
      image: "/pharmacy.png",
      featured: true,
    },
    {
      id: "ayushman-bharat",
      icon: "🏥",
      title: "Ayushman Bharat Benefits",
      description: "Complete guide to government health insurance benefits and eligibility",
      category: "insurance",
      type: "PDF",
      size: "2.9 MB",
      downloads: 2341,
      image: "/diagnostic_lab.png",
    },
    {
      id: "corporate-wellness",
      icon: "💼",
      title: "Corporate Wellness Program",
      description: "Employee health packages and corporate wellness benefits",
      category: "insurance",
      type: "PDF",
      size: "2.5 MB",
      downloads: 634,
      image: "/emergency_room.png",
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % featuredResources.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter resources based on active category
  const filteredResources =
    activeCategory === null
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  const featuredResources = resources.filter((r) => r.featured);

  const categories = [
    { id: "health-tips", label: "Health Tips", icon: "💡" },
    { id: "patient-education", label: "Patient Education", icon: "📚" },
    { id: "insurance", label: "Insurance", icon: "🛡️" },
  ];

  // Additional resources cards
  const additionalResources = [
    {
      title: "Video Tutorials",
      description: "Watch our expert doctors explain health topics, treatment procedures, and wellness tips.",
      icon: "📹",
      cta: "Browse Videos",
      href: "/patient-care",
    },
    {
      title: "Expert Consultation",
      description: "Schedule a one-on-one consultation with our healthcare professionals for personalized advice.",
      icon: "👨‍⚕️",
      cta: "Book Consultation",
      href: "/book-appointment",
    },
    {
      title: "Health Checkup Packages",
      description: "Preventive health checkup packages designed for different age groups and conditions.",
      icon: "📊",
      cta: "View Packages",
      href: "/health-packages",
    },
    {
      title: "Health Forum",
      description: "Join our community forum to discuss health topics and learn from other patients.",
      icon: "💬",
      cta: "Visit Forum",
      href: "/help-faqs",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          className="relative bg-gradient-to-r from-primary/90 to-primary py-20 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          </div>

          <Container>
            <motion.div
              className="relative z-10 text-center text-white py-12"
              variants={fadeInUp}
              initial="initial"
              animate="whileInView"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Health Resources & Guides
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
                Free downloadable guides and educational materials to help you understand your health better
              </p>
            </motion.div>
          </Container>
        </motion.section>

        {/* Featured Resources Carousel */}
        {featuredResources.length > 0 && (
          <section className="py-16 px-6 bg-slate-50">
            <Container>
              <SectionHeading
                subtitle="FEATURED"
                title="Popular Resources"
                description="Our most downloaded guides and educational materials"
              />

              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                {/* Carousel Items */}
                <div className="relative h-96 overflow-hidden">
                  {featuredResources.map((resource, idx) => (
                    <motion.div
                      key={resource.id}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        idx === carouselIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="h-full grid grid-cols-1 md:grid-cols-2">
                        {/* Image */}
                        <div className="relative h-full bg-gradient-to-br from-primary/10 to-accent/10">
                          {resource.image && (
                            <img
                              src={resource.image}
                              alt={resource.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <div className="text-5xl mb-4">{resource.icon}</div>
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            {resource.title}
                          </h3>
                          <p className="text-slate-600 mb-6 text-lg">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-6 mb-6">
                            <span className="text-sm bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                              {resource.type} • {resource.size}
                            </span>
                            <span className="text-sm text-slate-500 font-semibold">
                              ↓ {resource.downloads.toLocaleString()} downloads
                            </span>
                          </div>
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() => generateResourcePDF(resource.id)}
                          >
                            Download Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setCarouselIndex(
                      (prev) => (prev - 1 + featuredResources.length) % featuredResources.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-all shadow-lg"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCarouselIndex((prev) => (prev + 1) % featuredResources.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition-all shadow-lg"
                  aria-label="Next"
                >
                  →
                </button>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {featuredResources.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`rounded-full transition-all ${
                        idx === carouselIndex
                          ? "bg-primary w-8 h-2"
                          : "bg-white/50 w-2 h-2 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Category Filter Section */}
        <section className="py-12 px-6 bg-slate-50 border-b border-slate-200">
          <Container>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.button
                variants={staggerItem}
                onClick={() => setActiveCategory(null)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeCategory === null
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                All Resources
              </motion.button>
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat.id}
                  variants={staggerItem}
                  custom={idx + 1}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Resources Grid Section */}
        <section className="py-20 px-6 bg-white">
          <Container>
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, idx) => (
                  <motion.div key={resource.id} variants={staggerItem} custom={idx}>
                    <Card className="h-full overflow-hidden flex flex-col group" {...cardHoverAnimation}>
                      {/* Image Container */}
                      {resource.image && (
                        <div className="relative h-40 w-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                          <img
                            src={resource.image}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <CardBody className="flex-grow">
                        <div className="text-4xl mb-3">{resource.icon}</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                          {resource.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                            {resource.type} • {resource.size}
                          </span>
                          <span>↓ {resource.downloads.toLocaleString()}</span>
                        </div>
                      </CardBody>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full bg-primary text-white hover:bg-primary/90"
                          onClick={() => generateResourcePDF(resource.id)}
                        >
                          Download PDF
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Additional Resources Section */}
        <section className="py-20 px-6 bg-slate-50">
          <Container>
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <SectionHeading
                subtitle="EXPLORE MORE"
                title="Additional Resources"
                description="Beyond downloadable guides, we offer comprehensive resources and services"
              />

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {additionalResources.map((resource, idx) => (
                  <motion.div key={idx} variants={staggerItem} custom={idx}>
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow" {...cardHoverAnimation}>
                      <CardBody className="flex-grow flex flex-col">
                        <div className="text-5xl mb-4">{resource.icon}</div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-6 flex-grow">
                          {resource.description}
                        </p>
                        <Link href={resource.href}>
                          <Button variant="primary" size="sm" className="w-full">
                            {resource.cta}
                          </Button>
                        </Link>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>

        {/* CTA Section - Request Custom Guide */}
        <motion.section
          className="py-20 px-6 bg-gradient-to-r from-accent/90 to-accent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Container>
            <div className="text-center text-white space-y-6 max-w-3xl mx-auto">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Need a Custom Guide?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Can't find the resource you're looking for? Request a custom health guide tailored to your specific needs and conditions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-accent hover:bg-white/90"
                    onClick={() => setShowModal(true)}
                  >
                    Request Custom Guide
                  </Button>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </Container>
        </motion.section>

        {/* CTA Section - Book Consultation */}
        <motion.section
          className="py-20 px-6 bg-gradient-to-r from-primary/90 to-primary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Container>
            <div className="text-center text-white space-y-6">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Want Expert Guidance?
                </h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                  Personalized consultations with our expert doctors for your health questions and concerns
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-accent text-white hover:bg-accent/90"
                  >
                    Book Consultation
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Call Us Now
                  </Button>
                </div>
              </motion.div>
            </div>
          </Container>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPageClient;
