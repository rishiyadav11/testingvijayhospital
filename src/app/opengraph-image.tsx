import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "Vijay Hospital Narnaul — Best Multispeciality Hospital in Narnaul, Haryana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  // Read the hero image from public folder
  const heroImagePath = path.join(process.cwd(), "public", "hero_consultation.jpg");
  const heroImageData = fs.readFileSync(heroImagePath);
  const heroBase64 = `data:image/jpeg;base64,${heroImageData.toString("base64")}`;

  // Read logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Hero background image */}
        <img
          src={heroBase64}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dark overlay for text legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, rgba(0,106,103,0.85) 0%, rgba(0,40,38,0.75) 100%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            width: "100%",
            height: "100%",
            gap: "20px",
          }}
        >
          {/* Logo + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={logoBase64}
              alt=""
              style={{ width: "80px", height: "80px", borderRadius: "16px" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "36px", fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>
                Vijay Hospital
              </span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#76d6d1", letterSpacing: "4px", textTransform: "uppercase" as const }}>
                Narnaul
              </span>
            </div>
          </div>

          {/* Tagline */}
          <span style={{ fontSize: "28px", fontWeight: 600, color: "#ffffff", opacity: 0.95, maxWidth: "700px", lineHeight: 1.3 }}>
            Best Multispeciality Hospital in Narnaul, Haryana
          </span>

          {/* Features strip */}
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            {["24/7 Emergency", "NABH Standards", "PM-JAY Empanelled", "20+ Specialists"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Phone */}
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#76d6d1", marginTop: "12px" }}>
            📞 +91 93067 10615 · Opposite Bus Stand, Narnaul
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
