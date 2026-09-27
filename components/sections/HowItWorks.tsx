const steps = [
  { n: "1", title: "List", body: "Photograph your book, set a fair price, and publish it to your campus shelf in minutes." },
  { n: "2", title: "Connect", body: "Buyers message you directly — ask questions, negotiate, agree on a meeting spot." },
  { n: "3", title: "Trade", body: "Hand off the book, confirm the order, and leave a rating that builds campus trust." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-b border-vintage bg-beige/10 py-16">
      <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
        <span className="inline-block border border-vintage bg-card px-2 py-0.5 font-serif text-[10px] font-bold uppercase tracking-wider text-vintage mb-3">
          HOW IT WORKS
        </span>
        <h2 className="font-serif text-3xl font-extrabold text-ink uppercase tracking-tight">Three steps, one shelf</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-none border border-vintage bg-card p-6 shadow-stack">
              <span className="font-serif text-sm font-bold text-vintage">— {s.n} —</span>
              <h3 className="mt-2 font-serif text-xl font-bold text-ink uppercase">{s.title}</h3>
              <p className="mt-2 font-serif text-sm text-ink/75 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
