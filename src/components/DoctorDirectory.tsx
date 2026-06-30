"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { inferRouterOutputs } from "@trpc/server";
import { api } from "@/trpc/react";
import type { AppRouter } from "@/server/api/root";
import { User } from "lucide-react";

type Doctor = inferRouterOutputs<AppRouter>["doctor"]["search"][number];

export default function DoctorDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Fetch unique specialties
  const { data: specialties } = api.doctor.getSpecialties.useQuery();

  // Search doctors based on query and specialty
  const { data: doctors, isLoading } = api.doctor.search.useQuery(
    {
      query: searchQuery || undefined,
      specialty: selectedSpecialty === "All" ? undefined : selectedSpecialty,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="px-6 py-20 bg-surface" id="doctors">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary">
              Our Expert Consultants
            </h2>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl">
              Meet our world-class medical team dedicated to your recovery and wellness.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search doctors or specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-full text-sm font-body bg-white outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary/20"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
              search
            </span>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedSpecialty("All")}
            className={`pill-button px-5 py-2 text-xs font-semibold border ${
              selectedSpecialty === "All"
                ? "bg-primary border-primary text-white"
                : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-low"
            } cursor-pointer`}
          >
            All Departments
          </button>
          {specialties?.map((spec: string) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`pill-button px-5 py-2 text-xs font-semibold border ${
                selectedSpecialty === spec
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-outline-variant text-on-surface hover:bg-surface-container-low"
              } cursor-pointer`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-[32px] animate-pulse h-80"
              />
            ))}
          </div>
        ) : doctors?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[32px] nutro-shadow w-full">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-4">
              person_search
            </span>
            <p className="text-on-surface-variant font-medium">
              No doctors found matching your criteria. Try another search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors?.map((doc: Doctor) => (
              <div
                key={doc.id}
                className="bg-white p-3 rounded-[32px] nutro-shadow group border border-transparent hover:border-primary/15 transition-all flex flex-col justify-between h-full"
              >
                {/* Doctor Photo */}
                <div className="aspect-square bg-surface-container rounded-[24px] overflow-hidden mb-6 relative">
                  {doc.image && (doc.image.startsWith('http://') || doc.image.startsWith('https://') || doc.image.startsWith('/')) ? (
                    <Image
                      alt={doc.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      src={doc.image}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 flex items-center justify-center">
                      <User className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs fill-primary text-yellow-500">
                      star
                    </span>
                    {doc.rating.toFixed(1)}
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="px-3 pb-3 text-center flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-primary">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-semibold">
                      {doc.specialty}
                    </p>
                    <p className="text-[11px] text-on-surface-variant/70 italic px-2 line-clamp-2">
                      {doc.about}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-surface-variant/50 flex justify-center items-center gap-2 text-xs font-medium text-primary">
                    <span className="material-symbols-outlined text-sm">
                      workspace_premium
                    </span>
                    {doc.experience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
