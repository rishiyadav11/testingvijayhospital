import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  description,
  className,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12")}>
      {subtitle && (
        <p className="text-primary font-semibold uppercase text-sm tracking-widest mb-2">
          {subtitle}
        </p>
      )}
      <h2 className={cn(
        "text-4xl md:text-5xl font-bold text-slate-900 mb-4",
        className
      )}>
        {title}
      </h2>
      {description && (
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
