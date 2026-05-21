import Hero from "@/components/cream-grade/Hero";
import Composition from "@/components/cream-grade/Composition";
import Offers from "@/components/cream-grade/Offers";
import PackagingShowcase from "@/components/cream-grade/PackagingShowcase";
import PricingTable from "@/components/cream-grade/PricingTable";
import QualityStandards from "@/components/cream-grade/QualityStandards";
import About from "@/components/cream-grade/About";
import TrustSignals from "@/components/cream-grade/TrustSignals";
import FAQ from "@/components/cream-grade/FAQ";
import CTABanner from "@/components/cream-grade/CTABanner";
import Contact from "@/components/cream-grade/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-white/80 transition-colors duration-500">
      <Hero />
      <Composition />
      <Offers />
      <PackagingShowcase />
      <About />
      <TrustSignals />
      <QualityStandards />
      <FAQ />
      <Contact />
      <CTABanner />
    </main>
  );
}
