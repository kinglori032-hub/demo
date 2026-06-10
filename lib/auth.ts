import { cookies } from "next/headers";
import crypto from "crypto";
import {
  createSession,
  getSession,
  deleteSession,
  clearExpiredSessions,
} from "./session-store";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function createAdminSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");

  // Store in persistent session store
  createSession(token);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TIMEOUT,
    path: "/",
  });

  return token;
}

export async function getAdminSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    // Validate session exists in persistent store
    const sessionData = getSession(token);
    if (!sessionData) {
      console.debug(`Session token ${token} not found in store or expired`);
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error getting admin session:", error);
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return !!session;
}

export async function logoutAdmin(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      deleteSession(token);
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error logging out admin:", error);
  }
}

// Cleanup expired sessions periodically
export async function cleanupExpiredSessions(): Promise<void> {
  clearExpiredSessions();
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function sanitizeInput(input: string): Promise<string> {
  return input.trim().replace(/[<>]/g, "");
}

