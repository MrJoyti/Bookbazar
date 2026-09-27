// Maintenance — shown while the shelf is being restocked behind the scenes.
export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
      <span className="font-serif text-3xl font-semibold text-ink">
        BookBazar is being re-shelved
      </span>
      <p className="mt-3 max-w-sm font-sans text-sm text-ink/70">
        We're tidying up behind the counter. Please check back shortly.
      </p>
    </main>
  );
}
