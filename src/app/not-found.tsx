import React from "react";

// NOTE: This is a Server Component on purpose. Next.js statically prerenders
// the internal `/_not-found` page at build time, and on some runtimes that
// prerender pass crashes ("Cannot read properties of null") if the tree uses
// client hooks (useState/useRouter/usePathname). So this page intentionally
// avoids Navbar/Footer/RedirectCountdown and any hooks. The auto-redirect is
// done with a no-JS <meta http-equiv="refresh"> instead of a router push.
export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* No-JS redirect to home after a short delay (hook-free, prerender-safe) */}
      <meta httpEquiv="refresh" content="6; url=/" />

      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-10 sm:p-12 rounded-[40px] border border-outline-variant/30 shadow-xl shadow-primary/5">
          {/* Animated icon (pure CSS, no JS) */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center bg-primary/10 rounded-full text-primary">
            <span className="material-symbols-outlined text-5xl animate-pulse">
              construction
            </span>
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold font-display text-primary">
              Section Coming Soon
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              We are currently crafting this page to bring you the best healthcare resources and patient experience.
            </p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
            <p className="text-xs text-on-surface-variant font-medium">
              Redirecting you to the home page shortly...
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/"
              className="pill-button bg-primary text-white px-8 py-3.5 font-semibold hover:bg-primary/95 transition-all inline-flex items-center gap-2 shadow-md shadow-primary/10"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Back to Home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
