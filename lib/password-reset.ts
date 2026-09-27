import bcrypt from "bcrypt";
import crypto from "crypto";

const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const RESET_TOKEN_TTL_SECONDS = 10 * 60;
const OTP_ROUNDS = 10;
const PASSWORD_ROUNDS = 12;

type ResetTokenPayload = {
  email: string;
  otpId: string;
  exp: number;
};

export const PASSWORD_RESET_SUCCESS_MESSAGE =
  "If an account exists for this email, a verification code has been sent.";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidOtp(value: string) {
  return /^\d{6}$/.test(value);
}

export function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function getOtpExpiryDate(now = new Date()) {
  return new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function getResendAfterDate(now = new Date()) {
  return new Date(now.getTime() + RESEND_COOLDOWN_SECONDS * 1000);
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, OTP_ROUNDS);
}

export async function verifyOtpHash(otp: string, otpHash: string) {
  return bcrypt.compare(otp, otpHash);
}

export async function hashPasswordWithBcrypt(password: string) {
  return bcrypt.hash(password, PASSWORD_ROUNDS);
}

function getResetTokenSecret() {
  return process.env.JWT_SECRET || "local-dev-secret-change-before-production";
}

function signTokenBody(body: string, otpHash: string) {
  return crypto
    .createHmac("sha256", getResetTokenSecret())
    .update(`${body}.${otpHash}`)
    .digest("base64url");
}

export function createResetToken(payload: Omit<ResetTokenPayload, "exp">, otpHash: string) {
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + RESET_TOKEN_TTL_SECONDS,
    }),
    "utf8"
  ).toString("base64url");

  return `${body}.${signTokenBody(body, otpHash)}`;
}

export function verifyResetToken(token: string, email: string, otpId: string, otpHash: string) {
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  const expected = signTokenBody(body, otpHash);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ResetTokenPayload;
    return (
      payload.email === email &&
      payload.otpId === otpId &&
      Number.isInteger(payload.exp) &&
      payload.exp >= Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
