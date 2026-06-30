import { createTRPCRouter } from "@/server/api/trpc";
import { doctorRouter } from "@/server/api/routers/doctor";
import { appointmentRouter } from "@/server/api/routers/appointment";

export const appRouter = createTRPCRouter({
  doctor: doctorRouter,
  appointment: appointmentRouter,
});

export type AppRouter = typeof appRouter;
