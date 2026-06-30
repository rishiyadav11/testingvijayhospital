"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  /* ---------- Mouse-driven 3D parallax tilt ---------- */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const stage = sceneRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotY = px * 16;
    const rotX = -py * 16;
    tilt.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    // depth layers respond at different strengths
    stage.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "0");
      el.style.transform = `translate3d(${px * depth * 40}px, ${py * depth * 40}px, ${depth * 60}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const tilt = tiltRef.current;
    if (tilt) tilt.style.transform = "rotateX(0deg) rotateY(0deg)";
    sceneRef.current?.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
      el.style.transform = "translate3d(0,0,0)";
    });
  }, []);

  /* ---------- Particle / orbital canvas ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    interface P {
      angle: number;
      radius: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      hue: 0 | 1; // 0 teal, 1 rose
    }

    const N = 60;
    const particles: P[] = Array.from({ length: N }, (_, i) => ({
      angle: (i / N) * Math.PI * 2,
      radius: 90 + Math.random() * 170,
      y: (Math.random() - 0.5) * 160,
      speed: 0.0015 + Math.random() * 0.004,
      size: Math.random() * 2.2 + 0.8,
      opacity: Math.random() * 0.5 + 0.25,
      hue: Math.random() > 0.7 ? 1 : 0,
    }));

    const project = (x: number, y: number, z: number) => {
      const fov = 520;
      const scale = Math.max(0.1, fov / (fov + z));
      return { x: width / 2 + x * scale, y: height / 2 + y * scale, scale };
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const angleY = t * 0.0004;
      const angleX = 0.32 + Math.sin(t * 0.0002) * 0.12;

      // sort by depth for proper layering
      const pts = particles
        .map((p) => {
          p.angle += p.speed;
          const px = Math.cos(p.angle) * p.radius;
          const pz = Math.sin(p.angle) * p.radius;
          const py = p.y + Math.sin(t * 0.001 + p.radius) * 24;
          const rx = px * Math.cos(angleY) - pz * Math.sin(angleY);
          const rz = px * Math.sin(angleY) + pz * Math.cos(angleY);
          const ry = py * Math.cos(angleX) - rz * Math.sin(angleX);
          const fz = py * Math.sin(angleX) + rz * Math.cos(angleX);
          const proj = project(rx, ry, fz);
          return { proj, p, fz };
        })
        .sort((a, b) => b.fz - a.fz);

      // faint connecting threads (constellation)
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i]!.proj;
          const b = pts[j]!.proj;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 90 * 90) {
            const o = (1 - d2 / (90 * 90)) * 0.12 * a.scale;
            ctx.strokeStyle = `rgba(0, 106, 103, ${o})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // particles with glow
      for (const { proj, p } of pts) {
        const o = Math.min(1, Math.max(0, p.opacity * proj.scale));
        const color = p.hue === 0 ? `0, 106, 103` : `196, 86, 110`;
        const r = Math.max(0.4, p.size * proj.scale);
        ctx.beginPath();
        const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r * 4);
        grad.addColorStop(0, `rgba(${color}, ${o})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(proj.x, proj.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${o})`;
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduce) {
      draw(0);
    } else {
      const run = (time: number) => {
        draw(time);
        raf = requestAnimationFrame(run);
      };
      raf = requestAnimationFrame(run);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const { tr } = useLanguage();
  const h = tr.hero;

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-primary/5">
      {/* Aurora mesh background */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
      </div>

      {/* Orbital particle canvas */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* 3D stage */}
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="scene-3d max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col lg:flex-row items-center gap-12 w-full"
      >
        {/* Hero Text */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="reveal reveal-1 inline-flex items-center gap-2 glass-morphism text-primary px-4 py-1.5 rounded-full font-semibold text-xs border border-primary/20 relative pulse-ring">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {h.badge}
          </div>
          <h1 className="reveal reveal-2 text-4xl sm:text-5xl lg:text-7xl font-bold font-display leading-[1.05]">
            <span className="text-shimmer">{h.headline1}</span>
            <br className="hidden lg:block" />
            <span className="text-primary"> {h.headline2}</span>
          </h1>
          <p className="reveal reveal-2 text-xl sm:text-2xl text-on-surface-variant italic font-medium">
            {h.tagline}
          </p>
          <p className="reveal reveal-3 text-base sm:text-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0">
            {h.sub}
          </p>
          <div className="reveal reveal-4 flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <button
              onClick={() => scrollTo("specialities")}
              className="pill-button bg-primary text-black px-8 py-3.5 font-semibold shadow-xl shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/95 hover:scale-[1.03]"
            >
              <span className="material-symbols-outlined text-sm">medical_information</span>
              {h.exploreServices}
            </button>
            <button
              onClick={() => scrollTo("booking-section")}
              className="pill-button glass-morphism border-2 border-outline-variant text-black px-8 py-3.5 font-semibold hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              {h.bookAppointment}
            </button>
          </div>

          {/* Trust stats */}
          <div className="reveal reveal-5 flex flex-wrap gap-8 pt-6 justify-center lg:justify-start">
            {h.stats.map((s) => (
              <div key={s.l} className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-primary font-display">{s.n}</div>
                <div className="text-xs sm:text-sm text-on-surface-variant">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero 3D Image stack */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div ref={tiltRef} className="tilt-3d relative">
            <div className="absolute inset-0 bg-primary/25 rounded-[80px] blur-3xl -z-10 translate-x-10 translate-y-12 opacity-40"></div>

            {/* Main card */}
            <div
              data-depth="0.4"
              className="w-full aspect-[5/4] bg-white rounded-[40px] overflow-hidden nutro-shadow border-8 border-white group relative"
            >
              <Image
                alt="Vijay Hospital Consultation and Patient Care"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="/hero_consultation.jpg"
              />
            </div>

            {/* Floating glass badge - top */}
            <div
              data-depth="1.1"
              className="float-slow absolute -top-5 -left-5 glass-morphism rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-primary">favorite</span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-on-surface">{h.badgeCardiology}</div>
                <div className="text-[10px] text-on-surface-variant">{h.badgeCardiologySub}</div>
              </div>
            </div>

            {/* Floating glass badge - bottom */}
            <div
              data-depth="0.8"
              className="float-med absolute -bottom-6 -right-4 glass-morphism rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-secondary">verified</span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-on-surface">{h.badgeNabh}</div>
                <div className="text-[10px] text-on-surface-variant">{h.badgeNabhSub}</div>
              </div>
            </div>

            {/* Floating pill - mid right */}
            <div
              data-depth="1.4"
              className="float-fast absolute top-1/3 -right-8 glass-morphism rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-xs font-semibold text-on-surface">{h.badgeEmergency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        onClick={() => scrollTo("specialities")}
        aria-label="Scroll to services"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-primary/70 hover:text-primary transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
        <span className="material-symbols-outlined animate-bounce">expand_more</span>
      </button>
    </section>
  );
}
