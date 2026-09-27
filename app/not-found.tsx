import Link from "next/link";
import Button from "@/components/ui/Button";

// 404 — framed as a missing page torn from the book, not a system error.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
      <span className="font-serif text-7xl font-semibold text-vintage">404</span>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-ink">
        This page has fallen out of the book
      </h1>
      <p className="mt-2 max-w-sm font-sans text-sm text-ink/70">
        We looked between the covers but couldn't find it. Let's get you back
        to the shelf.
      </p>
      <Link href="/" className="mt-6">
        <Button variant="primary">Back to BookBazar</Button>
      </Link>
    </main>
  );
}
