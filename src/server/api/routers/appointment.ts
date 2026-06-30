import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/lib/prisma";

export const appointmentRouter = createTRPCRouter({
  book: publicProcedure
    .input(
      z.object({
        patientName: z.string().min(2, "Name must be at least 2 characters"),
        patientEmail: z.string().email("Invalid email address"),
        patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
        doctorId: z.string().min(1, "Please select a doctor"),
        date: z.string().min(1, "Please select a date"),
        time: z.string().min(1, "Please select a time slot"),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const doctor = await prisma.doctor.findUnique({
        where: { id: input.doctorId },
      });
      if (!doctor) {
        throw new Error("Selected doctor is not available. Please choose another.");
      }

      const appointment = await prisma.appointment.create({
        data: {
          patientName: input.patientName,
          patientEmail: input.patientEmail,
          patientPhone: input.patientPhone,
          doctorId: input.doctorId,
          date: input.date,
          time: input.time,
          notes: input.notes,
          status: "Pending",
        },
      });

      return appointment;
    }),
});
