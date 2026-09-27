import { Prisma } from "@prisma/client";
import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { db } from "@/lib/db";
import { sendPasswordResetOtpEmail } from "@/lib/email";
import {
  PASSWORD_RESET_SUCCESS_MESSAGE,
  generateOtp,
  getOtpExpiryDate,
  getResendAfterDate,
  hashOtp,
  isValidEmail,
  normalizeEmail,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const email = isNonEmptyString(body.email) ? normalizeEmail(body.email) : "";
  if (!email || !isValidEmail(email)) return fail("Invalid email.", 422);

  try {
    const user = await db.user.findUnique({ where: { email }, select: { email: true } });
    if (!user) return ok({ message: PASSWORD_RESET_SUCCESS_MESSAGE });

    const existingOtp = await db.passwordResetOtp.findUnique({ where: { email } });
    if (existingOtp && existingOtp.resendAfter > new Date()) {
      return fail("Please wait before requesting another OTP.", 429);
    }

    const now = new Date();
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    await db.passwordResetOtp.deleteMany({ where: { email } });
    await db.passwordResetOtp.create({
      data: {
        email,
        otpHash,
        expiresAt: getOtpExpiryDate(now),
        resendAfter: getResendAfterDate(now),
      },
    });

    try {
      await sendPasswordResetOtpEmail({ to: email, otp });
    } catch {
      return ok({ message: PASSWORD_RESET_SUCCESS_MESSAGE });
    }

    return ok({ message: PASSWORD_RESET_SUCCESS_MESSAGE });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return fail("Database failure.", 500);
    }
    return fail("Could not resend OTP.", 500);
  }
}
