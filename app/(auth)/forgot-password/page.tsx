"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = (await response.json()) as { success: boolean; error?: string };

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Could not request OTP.");
      return;
    }

    sessionStorage.setItem("passwordResetEmail", email.trim().toLowerCase());
    setSubmitted(true);
    setTimeout(() => {
      router.push("/verify-otp");
    }, 1500);
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
            Recover Account
          </h2>
        </div>

        {error && (
          <div className="mt-4 border border-dashed border-vintage bg-beige/30 p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
            Error: {error}
          </div>
        )}

        {submitted ? (
          <div className="mt-6 space-y-4 text-center font-serif text-sm">
            <div className="border border-dashed border-vintage bg-beige/30 p-4 text-center font-bold uppercase text-vintage">
              Verification Dispatched!
            </div>
            <p className="text-ink/80">
              An editorial OTP code has been dispatched to <strong>{email}</strong>.
            </p>
            <p className="text-xs text-ink/50 italic animate-pulse">
              Redirecting to OTP entry desk...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="font-serif text-xs text-ink/70 leading-relaxed">
              Enter your registered email address below. We will dispatch an OTP bulletin to authorize access.
            </p>

            <div>
              <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="student@university.edu"
                className="mt-1 w-full rounded-none border-2 border-vintage bg-paper p-2.5 font-serif text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-vintage"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full border-2 border-vintage bg-vintage text-paper py-2.5 font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Dispatching..." : "Request OTP Bulletin"}
            </Button>
          </form>
        )}

        <div className="my-5 border-t border-vintage border-dashed" />

        <p className="text-center font-serif text-xs text-ink/75">
          <a href="/login" className="font-bold uppercase tracking-wide hover:underline text-vintage">
            Return to Log In
          </a>
        </p>
      </div>
    </main>
  );
}
