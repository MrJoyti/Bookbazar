"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";

export default function VerifyOtpPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEmail(sessionStorage.getItem("passwordResetEmail") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please request a new OTP first.");
      return;
    }
    if (code.length !== 6) {
      setError("Authorization code must be 6 digits.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    });
    const result = (await response.json()) as {
      success: boolean;
      data?: { resetToken: string };
      error?: string;
    };
    setSubmitting(false);

    if (!result.success || !result.data?.resetToken) {
      setError(result.error || "Could not verify OTP.");
      return;
    }

    sessionStorage.setItem("passwordResetToken", result.data.resetToken);
    setSuccess(true);
    setTimeout(() => {
      router.push("/reset-password");
    }, 1500);
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please request a new OTP first.");
      return;
    }

    setResending(true);
    setError("");
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = (await response.json()) as { success: boolean; error?: string };
    setResending(false);

    if (!result.success) {
      setError(result.error || "Could not resend OTP.");
      return;
    }

    setCode("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper p-5">
      <div className="w-full max-w-md border-4 border-double border-vintage bg-card p-8 shadow-stack">
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-3">
            <BookOpen className="h-6 w-6 text-vintage" strokeWidth={2} />
            <span className="font-serif text-2xl font-bold tracking-tight text-ink uppercase">BookBazar</span>
          </a>
          <h2 className="font-serif text-2xl font-extrabold uppercase tracking-tight text-ink border-b border-vintage pb-2">
            Verify OTP Dispatch
          </h2>
        </div>

        {error && (
          <div className="mt-4 border border-dashed border-vintage bg-beige/30 p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
            Error: {error}
          </div>
        )}

        {success ? (
          <div className="mt-6 space-y-4 text-center font-serif text-sm">
            <div className="border-2 border-vintage bg-card p-4 text-center font-bold uppercase text-vintage">
              Access Authorized!
            </div>
            <p className="text-ink/80">
              Passphrase validated. Redirecting to password reset desk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="font-serif text-xs text-ink/70 leading-relaxed text-center">
              Please enter the 6-digit code dispatched to your terminal below.
            </p>

            <div className="flex justify-center">
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                placeholder="000000"
                className="w-40 text-center rounded-none border-2 border-vintage bg-paper p-3 font-serif text-2xl font-extrabold tracking-[0.4em] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-vintage"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full border-2 border-vintage bg-vintage text-paper py-2.5 font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        )}

        <div className="my-5 border-t border-vintage border-dashed" />

        <p className="text-center font-serif text-xs text-ink/75">
          Did not receive code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-bold uppercase tracking-wide hover:underline text-vintage"
          >
            {resending ? "Resending..." : "Resend Bulletin"}
          </button>
        </p>
      </div>
    </main>
  );
}
