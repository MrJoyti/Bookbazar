import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

const SESSION_COOKIE = "bb_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  university: true,
  role: true,
  status: true,
  balance: true,
  createdAt: true,
  updatedAt: true,
} as const;

type SessionPayload = {
  userId: string;
  role: string;
  exp: number;
};

function getSecret() {
  return process.env.JWT_SECRET || "local-dev-secret-change-before-production";
}

function signPayload(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${signPayload(body)}`;
}

function decodeSession(token?: string): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = signPayload(body);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.userId || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("base64url");
  return `pbkdf2_sha256$100000$${salt}$${hash}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    return bcrypt.compare(password, storedHash);
  }

  const [algorithm, iterationsRaw, salt, hash] = storedHash.split("$");
  const iterations = Number(iterationsRaw);
  if (algorithm !== "pbkdf2_sha256" || !iterations || !salt || !hash) return false;

  const candidate = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");
  const candidateBuffer = Buffer.from(candidate);
  const hashBuffer = Buffer.from(hash);
  return candidateBuffer.length === hashBuffer.length && crypto.timingSafeEqual(candidateBuffer, hashBuffer);
}

export function setSessionCookie(user: { id: string; role: string }) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = encodeSession({ userId: user.id, role: user.role, exp });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const session = decodeSession(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: publicUserSelect,
  });

  if (!user || user.status === "BLOCKED") return null;
  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
