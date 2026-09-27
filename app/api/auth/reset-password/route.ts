import { Prisma } from "@prisma/client";
import { fail, isNonEmptyString, ok, readJson } from "@/lib/api";
import { db } from "@/lib/db";
import {
  hashPasswordWithBcrypt,
  isValidEmail,
  normalizeEmail,
  verifyResetToken,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return fail("Invalid JSON body.");

  const email = isNonEmptyString(body.email) ? normalizeEmail(body.email) : "";
  const resetToken = isNonEmptyString(body.resetToken) ? body.resetToken.trim() : "";
  const newPassword = isNonEmptyString(body.newPassword) ? body.newPassword : "";

  if (!email || !isValidEmail(email)) return fail("Invalid email.", 422);
  if (!resetToken || !newPassword) return fail("Invalid request.", 400);
  if (newPassword.length < 6) return fail("Password must be at least 6 characters.", 422);

  try {
    const otpRecord = await db.passwordResetOtp.findUnique({ where: { email } });
    if (!otpRecord || !otpRecord.verified) return fail("Invalid reset token.", 401);
    if (otpRecord.expiresAt <= new Date()) return fail("OTP has expired.", 410);
    if (!verifyResetToken(resetToken, email, otpRecord.id, otpRecord.otpHash)) {
      return fail("Invalid reset token.", 401);
    }

    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return fail("Invalid reset token.", 401);

    await db.$transaction([
      db.user.update({
        where: { email },
        data: { passwordHash: await hashPasswordWithBcrypt(newPassword) },
      }),
      db.passwordResetOtp.delete({ where: { email } }),
    ]);

    return ok({ message: "Password reset successfully." });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return fail("Database failure.", 500);
    }
    return fail("Could not reset password.", 500);
  }
}
