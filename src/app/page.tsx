import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Personas from "@/components/Personas";
import Roadmap from "@/components/Roadmap";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Personas />
      <Roadmap />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  );
}
