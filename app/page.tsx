import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import FeaturedBooks from "@/components/sections/FeaturedBooks";
import HowItWorks from "@/components/sections/HowItWorks";

// Landing Page — first impression before login/signup.
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedBooks />
      <HowItWorks />
      <Footer />
    </main>
  );
}
