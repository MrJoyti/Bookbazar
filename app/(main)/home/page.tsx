import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Categories from "@/components/sections/Categories";
import FeaturedBooks from "@/components/sections/FeaturedBooks";

// Home — the logged-in browsing dashboard (recent / popular / featured).
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="border-b border-gold/30 bg-beige/30 py-10">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h1 className="font-serif text-3xl font-semibold text-ink">
            Welcome back — here's what's new on your shelf
          </h1>
        </div>
      </section>
      <Categories />
      <FeaturedBooks />
      <Footer />
    </main>
  );
}
