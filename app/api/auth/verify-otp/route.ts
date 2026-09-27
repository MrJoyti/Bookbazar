import { Prisma } from "@prisma/client";
import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { db } from "@/lib/db";
import {
  createResetToken,
  isValidEmail,
  isValidOtp,
  normalizeEmail,
  verifyOtpHash,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const email = isNonEmptyString(body.email) ? normalizeEmail(body.email) : "";
  const otp = isNonEmptyString(body.otp) ? body.otp.trim() : "";

  if (!email || !isValidEmail(email)) return fail("Invalid email.", 422);
  if (!otp || !isValidOtp(otp)) return fail("Invalid OTP.", 422);

  try {
    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return fail("Invalid OTP.", 401);

    const otpRecord = await db.passwordResetOtp.findUnique({ where: { email } });
    if (!otpRecord) return fail("Invalid OTP.", 401);
    if (otpRecord.verified) return fail("OTP is already used.", 409);
    if (otpRecord.expiresAt <= new Date()) return fail("OTP has expired.", 410);

    const matches = await verifyOtpHash(otp, otpRecord.otpHash);
    if (!matches) return fail("Invalid OTP.", 401);

    await db.passwordResetOtp.update({
      where: { email },
      data: { verified: true },
    });

    const resetToken = createResetToken({ email, otpId: otpRecord.id }, otpRecord.otpHash);
    return ok({ resetToken });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return fail("Database failure.", 500);
    }
    return fail("Could not verify OTP.", 500);
  }
}
