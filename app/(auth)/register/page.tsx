"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import { useApp } from "@/lib/context/AppContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("BUET");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useApp();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !university || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, university, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Could not create account.");
      return;
    }

    router.push("/home");
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
            Create Press Account
          </h2>
        </div>

        {error && (
          <div className="mt-4 border border-dashed border-vintage bg-beige/30 p-3 text-center font-serif text-xs font-bold uppercase text-vintage">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Tahmid Hasan"
              className="mt-1 w-full rounded-none border-2 border-vintage bg-paper p-2.5 font-serif text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-vintage"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
              University Email Address
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

          <div>
            <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
              University / Campus Shelf
            </label>
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1 w-full rounded-none border-2 border-vintage bg-paper p-2.5 font-serif text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-vintage"
              required
            >
              <option value="BUET">BUET</option>
              <option value="NSU">North South University (NSU)</option>
              <option value="DU">Dhaka University (DU)</option>
              <option value="IUT">IUT</option>
              <option value="BRAC U">BRAC University</option>
            </select>
          </div>

          <div>
            <label className="block font-serif text-xs font-bold uppercase tracking-wider text-ink">
              Password
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

          <Button
            type="submit"
            disabled={submitting}
            className="w-full border-2 border-vintage bg-vintage text-paper py-2.5 font-bold uppercase tracking-wider hover:bg-paper hover:text-vintage transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="my-5 border-t border-vintage border-dashed" />

        <p className="text-center font-serif text-xs text-ink/75">
          Already registered?{" "}
          <a href="/login" className="font-bold uppercase tracking-wide hover:underline text-vintage">
            Log In Here
          </a>
        </p>
      </div>
    </main>
  );
}
