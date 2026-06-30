"use client";

import { toast as sonnerToast } from "sonner";
import { useMemo } from "react";

interface ToastFunction {
  (options: {
    title?: string;
    description?: string;
    type?: "success" | "error" | "info" | "loading";
    duration?: number;
  }): string | number;
  error(message: string): string | number;
  success(message: string): string | number;
  info(message: string): string | number;
  loading(message: string): string | number;
}

export function useToast() {
  const toast = useMemo(() => {
    const t = ((options: {
      title?: string;
      description?: string;
      type?: "success" | "error" | "info" | "loading";
      duration?: number;
    }) => {
      const message = options.description || options.title || "Notification";
      switch (options.type) {
        case "success":
          return sonnerToast.success(message);
        case "error":
          return sonnerToast.error(message);
        case "info":
          return sonnerToast.info(message);
        case "loading":
          return sonnerToast.loading(message);
        default:
          return sonnerToast(message);
      }
    }) as ToastFunction;

    // Add methods to the function itself
    t.error = (message: string) => sonnerToast.error(message);
    t.success = (message: string) => sonnerToast.success(message);
    t.info = (message: string) => sonnerToast.info(message);
    t.loading = (message: string) => sonnerToast.loading(message);

    return t;
  }, []);

  return { toast };
}

