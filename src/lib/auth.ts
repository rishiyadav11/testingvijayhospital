import jwt from "jsonwebtoken";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

interface JWTPayload {
  email: string;
  iat: number;
  exp: number;
}

export async function generateJWT(email: string, expiresIn = "24h"): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (expiresIn === "24h" ? 86400 : 3600); // 24 hours or 1 hour

  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400, // 24 hours
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}

export async function getAdminSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value || null;
}

export async function getAdminEmail(): Promise<string | null> {
  const token = await getAdminSession();
  if (!token) return null;

  const payload = await verifyJWT(token);
  return payload?.email || null;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const email = await getAdminEmail();
  return email === "admin@vijayhospital.com";
}

export async function renewSessionIfNeeded(): Promise<void> {
  const token = await getAdminSession();
  if (!token) return;

  const payload = await verifyJWT(token);
  if (!payload) return;

  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - now;

  // Renew if less than 1 hour remaining
  if (timeUntilExpiry < 3600 && timeUntilExpiry > 0) {
    const newToken = await generateJWT(payload.email, "24h");
    await setAuthCookie(newToken);
  }
}

/**
 * Synchronous token verification (for route handlers)
 */
export function verifyAdminToken(token: string): boolean {
  try {
    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
    return true;
  } catch {
    return false;
  }
}
