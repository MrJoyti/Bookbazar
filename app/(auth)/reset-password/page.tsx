"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEmail(sessionStorage.getItem("passwordResetEmail") || "");
    setResetToken(sessionStorage.getItem("passwordResetToken") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !resetToken) {
      setError("Please verify your OTP first.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, resetToken, newPassword: password }),
    });
    const result = (await response.json()) as { success: boolean; error?: string };
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Could not reset password.");
      return;
    }

    sessionStorage.removeItem("passwordResetEmail");
    sessionStorage.removeItem("passwordResetToken");
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
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
            Reset Passphrase
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
              Password Updated!
            </div>
            <p className="text-ink/80">Please sign in with your new password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Minimum 6 characters"
                className="mt-1 w-full rounded-none border-2 border-vintage bg-paper p-2.5 font-serif text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-vintage"
                required
              />
            </div>

            <div>
              <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Repeat new password"
                className="mt-1 w-full rounded-none border-2 border-vintage bg-paper p-2.5 font-serif text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-vintage"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full border-2 border-vintage bg-vintage text-paper py-2.5 font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update Password"}
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
