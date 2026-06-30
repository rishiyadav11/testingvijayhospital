import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { services } from "@/server/data";
import { prisma } from "@/lib/prisma";
import { Doctor as PrismaDoctor } from "@prisma/client";

const mapDbDoctor = (d: PrismaDoctor) => {
  let education = [];
  try {
    education = d.education ? JSON.parse(d.education) : [];
  } catch (e) {
    console.error("Error parsing education", e);
  }
  
  let certifications = [];
  try {
    certifications = d.certifications ? JSON.parse(d.certifications) : [];
  } catch (e) {
    console.error("Error parsing certifications", e);
  }
  
  let awards = [];
  try {
    awards = d.awards ? JSON.parse(d.awards) : [];
  } catch (e) {
    console.error("Error parsing awards", e);
  }

  let reviews = [];
  try {
    reviews = d.reviews ? JSON.parse(d.reviews) : [];
  } catch (e) {
    console.error("Error parsing reviews", e);
  }

  return {
    id: d.id,
    name: d.name,
    specialty: d.specialty || d.department || "General",
    qualification: d.qualifications || "",
    experience: d.experience || "0 years",
    image: d.photoUrl || d.photo || "",
    rating: d.rating,
    about: d.bio || "",
    bio: d.bio || "",
    education,
    certifications,
    awards,
    availableSlots: d.availableDays ? d.availableDays.split(',').map((day: string, idx: number) => {
      const slots = d.timeSlots ? d.timeSlots.split(',') : [];
      return {
        day: day.trim(),
        time: (slots[idx] || slots[0] || "10:00 AM - 1:00 PM").trim()
      };
    }) : [],
    reviews,
  };
};

export const doctorRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const dbDoctors = await prisma.doctor.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    });
    return dbDoctors.map(mapDbDoctor).sort((a, b) => a.name.localeCompare(b.name));
  }),

  getSpecialties: publicProcedure.query(async () => {
    const dbDoctors = await prisma.doctor.findMany({
      where: { status: "PUBLISHED" },
      select: { specialty: true, department: true }
    });
    const specs = dbDoctors.map(d => d.specialty || d.department || "General");
    return Array.from(new Set(specs)).sort();
  }),

  getServices: publicProcedure.query(() => {
    return [...services].sort((a, b) => a.name.localeCompare(b.name));
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        specialty: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { query, specialty } = input;
      const q = query?.trim().toLowerCase();

      const dbDoctors = await prisma.doctor.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      });

      return dbDoctors
        .map(mapDbDoctor)
        .filter((d) => {
          if (specialty && specialty !== "All" && d.specialty !== specialty) {
            return false;
          }
          if (q) {
            return (
              d.name.toLowerCase().includes(q) ||
              d.specialty.toLowerCase().includes(q) ||
              d.about.toLowerCase().includes(q)
            );
          }
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    }),
});

