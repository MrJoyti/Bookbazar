import nodemailer from "nodemailer";

type ResetOtpEmailInput = {
  to: string;
  otp: string;
};

function getSmtpPort() {
  const port = Number(process.env.SMTP_PORT);
  return Number.isInteger(port) && port > 0 ? port : 587;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || !process.env.EMAIL_FROM) {
    throw new Error("SMTP environment variables are not configured.");
  }

  const port = getSmtpPort();
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function buildPasswordResetOtpEmail(otp: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f1e3;font-family:Georgia,'Times New Roman',serif;color:#2b2118;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f1e3;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fffaf0;border:2px solid #7c4a22;padding:28px;">
            <tr>
              <td align="center" style="font-size:28px;font-weight:bold;letter-spacing:.04em;color:#7c4a22;">BookBazar</td>
            </tr>
            <tr>
              <td align="center" style="padding-top:24px;font-size:16px;">Your verification code is:</td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 0;font-size:36px;font-weight:bold;letter-spacing:.2em;color:#2b2118;">${otp}</td>
            </tr>
            <tr>
              <td align="center" style="font-size:15px;">This code expires in 5 minutes.</td>
            </tr>
            <tr>
              <td align="center" style="padding-top:24px;font-size:13px;color:#6f6258;">If you did not request this, ignore this email.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendPasswordResetOtpEmail({ to, otp }: ResetOtpEmailInput) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your BookBazar verification code",
    html: buildPasswordResetOtpEmail(otp),
    text: `BookBazar\n\nYour verification code is: ${otp}\n\nThis code expires in 5 minutes.\n\nIf you did not request this, ignore this email.`,
  });
}
