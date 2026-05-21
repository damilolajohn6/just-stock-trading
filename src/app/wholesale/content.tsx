"use client";

import PageHero from "@/components/cream-grade/PageHero";
import { motion } from "framer-motion";
import { Package, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import Image from "next/image";
import QuickContact from "@/components/cream-grade/ui/QuickContact";
import PackagingShowcase from "@/components/cream-grade/PackagingShowcase";
import CTABanner from "@/components/cream-grade/CTABanner";

const wholesaleFeatures = [
  {
    icon: <Package className="w-8 h-8 text-premium-gold" />,
    title: "Cream Grade Clothing",
    description:
      "Carefully selected high-quality garments — minimal wear, brand-rich, and prepared for profitable resale markets.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-premium-gold" />,
    title: "New With Tags & Liquidation",
    description:
      "Retail overstock, surplus, and clearance goods supplied in pallet and container volumes at competitive wholesale pricing.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-premium-gold" />,
    title: "Export-Ready Bales",
    description:
      "45kg, 50kg, and 55kg bale packaging prepared for efficient container loading and international distribution.",
  },
];

export default function WholesaleContent() {
  return (
    <main className="min-h-screen bg-white ">
      <PageHero
        title="Premium Wholesale Clothing Supply"
        subtitle="Wholesale Solutions"
        description="Reliable, quality-assured wholesale clothing sourced from trusted UK suppliers. Cream grade clothing, liquidation stock, and export-ready bales for international buyers."
        breadcrumb={[{ label: "Wholesale" }]}
      />

      <section className="py-24">
        <div className="container mx-auto px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-premium-charcoal/5 flex items-center justify-center">
                <Package size={100} className="text-premium-gold/20" />
              </div>
              <Image
                src="/images/aaa.jpeg"
                alt="Wholesale Clothing Bale"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm font-bold uppercase tracking-widest mb-2 text-premium-gold">
                  Export Ready
                </p>
                <h3 className="text-2xl font-display font-bold">
                  Quality-Assured Wholesale Stock
                </h3>
              </div>
            </motion.div>

            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-premium-charcoal">
                Sourced & Supplied{" "}
                <span className="text-premium-gold">with Confidence.</span>
              </h2>
              <p className="text-premium-charcoal/60 leading-relaxed text-lg">
                We source directly from trusted UK suppliers, negotiate
                competitive wholesale pricing, conduct quality checks, and
                consolidate shipments — providing everything you need for
                profitable international resale.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {wholesaleFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-3"
                  >
                    {feature.icon}
                    <h4 className="font-bold text-premium-charcoal">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-premium-charcoal/50 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 px-8 py-4 bg-premium-charcoal text-white rounded-full font-bold flex items-center gap-3 hover:bg-premium-gold transition-colors shadow-xl"
              >
                Inquire for Pricing <QuickContact />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Volume Tiers */}
      <section className="py-24 bg-premium-cream">
        <div className="container mx-auto px-14 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-premium-charcoal">
              Flexible Volume for Every Buyer
            </h2>
            <p className="text-premium-charcoal/50">
              Whether you&apos;re an established importer or expanding into new
              markets, we have supply capacity to match your requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                tier: "Bale Orders",
                weight: "45–55kg Bales",
                desc: "Export-ready bale packaging for efficient container loading and distribution.",
              },
              {
                tier: "Pallet Quantities",
                weight: "Pallet Loads",
                desc: "Consolidated pallet orders for established wholesale distributors.",
              },
              {
                tier: "Container Volumes",
                weight: "Full Containers",
                desc: "Bulk container supply for large-scale importers and distribution networks.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-3xl border border-premium-gold/10 hover:border-premium-gold/30 transition-all shadow-sm"
              >
                <span className="text-[10px] uppercase tracking-widest font-bold text-premium-gold mb-2 block">
                  {card.tier}
                </span>
                <h3 className="text-2xl font-display font-bold text-premium-charcoal mb-4">
                  {card.weight}
                </h3>
                <p className="text-sm text-premium-charcoal/40 mb-8">
                  {card.desc}
                </p>
                <div className="h-[1px] bg-premium-gold/10 w-full mb-8" />
                <button className="text-xs font-bold uppercase tracking-widest text-premium-charcoal hover:text-premium-gold transition-colors">
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PackagingShowcase />

      <CTABanner />
    </main>
  );
}
