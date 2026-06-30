"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardBody } from "@/components/ui/Card";
import { staggerContainer, staggerItem, cardHoverAnimation, fadeInUp } from "@/lib/animations";
import { FACILITIES } from "@/lib/constants";
import { Eye, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  mediaUrl: string;
  category: string;
  order: number;
}

interface FacilitiesPageClientProps {
  galleryItems?: GalleryItem[];  // all published — used for Photo Tour (max 5)
  infraItems?: GalleryItem[];    // Infrastructure only — used for card thumbnails
  // legacy prop kept for compatibility
  initialItems?: GalleryItem[];
}

const FacilitiesPageClient = ({ galleryItems = [], infraItems, initialItems = [] }: FacilitiesPageClientProps) => {
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Infrastructure images for facility card thumbnails
  const thumbItems = infraItems ?? initialItems;

  // Assign DB images to facility cards by index (cycle if fewer images than facilities)
  const facilities = FACILITIES.map((fac, idx) => {
    const dbImage = thumbItems.length > 0 ? thumbItems[idx % thumbItems.length] : null;
    return { ...fac, image: dbImage ? dbImage.mediaUrl : fac.image };
  });

  // Photo tour uses the all-gallery items (already limited to 5 by server query)
  const photoTourItems = galleryItems.length > 0 ? galleryItems : initialItems.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">

        {/* Hero */}
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
              className="relative z-10 text-center !text-black py-12"
              variants={fadeInUp}
              initial="initial"
              animate="whileInView"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                State-of-the-Art Facilities
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 !text-black/90">
                Equipped with the latest medical technology to provide you with world-class healthcare
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">{FACILITIES.length}+</div>
                  <div className="!text-black/80">Medical Facilities</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">100+</div>
                  <div className="!text-black/80">Medical Equipments</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-1">24/7</div>
                  <div className="!text-black/80">Round-the-Clock Care</div>
                </div>
              </div>
            </motion.div>
          </Container>
        </motion.section>

        {/* Facilities Grid */}
        <section className="py-20 px-6 bg-slate-50">
          <Container>
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <SectionHeading
                subtitle="OUR SERVICES"
                title="Complete Healthcare Solutions"
                description="Comprehensive medical facilities designed to meet all your healthcare needs under one roof"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {facilities.map((facility, idx) => (
                  <motion.div key={facility.id} variants={staggerItem} custom={idx}>
                    <Link href={`/facilities/${facility.id}`} className="block h-full">
                      <Card className="h-full overflow-hidden flex flex-col group cursor-pointer" {...cardHoverAnimation}>
                        <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                          {facility.image ? (
                            <Image
                              src={facility.image}
                              alt={facility.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized={facility.image.startsWith('http')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200">
                              <span className="text-slate-400 text-sm">No Image</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>

                        <CardBody className="flex-grow">
                          <h3 className="text-xl font-bold text-slate-900 mb-3">{facility.name}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{facility.description}</p>
                        </CardBody>

                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                          <span className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors inline-flex items-center">
                            Learn More →
                          </span>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Photo Tour — only show if DB images exist */}
        {photoTourItems.length > 0 && (
          <section className="py-20 px-6 bg-white">
            <Container>
              <SectionHeading
                subtitle="PHOTO TOUR"
                title="Inside Our Hospital"
                description="A look at the infrastructure and environment at Vijay Hospital"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {photoTourItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer"
                    onClick={() => setLightboxImage(item)}
                  >
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-semibold text-xs truncate">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/gallery"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg">
                  View Full Gallery →
                </Link>
              </div>
            </Container>
          </section>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImage && (
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
              >
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black text-white rounded-full border border-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative max-h-[70vh] flex items-center justify-center bg-black overflow-hidden">
                  <img
                    src={lightboxImage.mediaUrl}
                    alt={lightboxImage.title}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
                <div className="p-6 bg-slate-900/90 text-white">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{lightboxImage.category}</span>
                  <h3 className="text-xl font-bold mt-1">{lightboxImage.title}</h3>
                  {lightboxImage.description && (
                    <p className="text-slate-400 text-sm mt-1">{lightboxImage.description}</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </div>
  );
};

export default FacilitiesPageClient;
