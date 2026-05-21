"use client";

import PageHero from "@/components/cream-grade/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import CTABanner from "@/components/cream-grade/CTABanner";
import {
  Truck,
  MapPinned,
  ShieldAlert,
  History,
  Anchor,
  PhoneCall,
} from "lucide-react";

export default function ShippingContent() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Reliable Export Logistics & Freight Coordination"
        subtitle="Shipping & Logistics"
        description="We coordinate the complexity of international logistics. From bale orders to full containers, we ensure your wholesale stock arrives safely and on time."
        breadcrumb={[{ label: "Shipping" }]}
      />

      {/* Shipping Methods */}
      <section className="py-24">
        <div className="container mx-auto px-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Truck className="w-10 h-10" />,
                title: "UK Domestic",
                desc: "Consolidation and coordination within the UK. We manage goods from multiple suppliers to streamline your international shipment.",
              },
              {
                icon: <Anchor className="w-10 h-10" />,
                title: "International Sea Freight",
                desc: "Cost-effective container shipping for large volume bale and pallet orders. Full customs documentation and port coordination.",
              },
              {
                icon: <MapPinned className="w-10 h-10" />,
                title: "Express Air Cargo",
                desc: "Fast-track freight for priority shipments. Ideal for time-sensitive wholesale orders requiring rapid international delivery.",
              },
            ].map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] bg-premium-cream border border-premium-gold/10 hover:border-premium-gold/30 transition-all shadow-sm group"
              >
                <div className="text-premium-gold mb-8 group-hover:scale-110 transition-transform duration-500">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-premium-charcoal mb-4">
                  {method.title}
                </h3>
                <p className="text-premium-charcoal/50 leading-relaxed">
                  {method.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-premium-charcoal text-white">
        <div className="container mx-auto px-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 text-center">
              Shipping <span className="text-premium-gold">FAQs</span>
            </h2>

            <div className="space-y-12">
              {[
                {
                  q: "How are shipping costs calculated?",
                  a: "Shipping is calculated based on total weight, volume, and destination. We work with multiple freight partners to secure competitive rates for your order.",
                },
                {
                  q: "Do you handle customs documentation?",
                  a: "Yes, we provide all necessary commercial invoices, packing lists, and export documentation. Import duties and taxes are typically the responsibility of the buyer.",
                },
                {
                  q: "Can I track my shipment?",
                  a: "Every shipment — from bale orders to full containers — comes with professional tracking details sent directly to your email or WhatsApp.",
                },
                {
                  q: "What if goods are damaged in transit?",
                  a: "We coordinate shipping insurance for all orders. If your goods arrive compromised, we assist with the claim process immediately.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12 pb-12 border-b border-white/10"
                >
                  <h4 className="font-bold text-premium-gold text-lg">
                    {faq.q}
                  </h4>
                  <p className="text-white/60 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-4 rounded-full bg-premium-gold/5 mb-8">
            <PhoneCall className="text-premium-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-premium-charcoal mb-8">
            Need a Custom Freight Quote?
          </h2>
          <p className="text-premium-charcoal/50 max-w-2xl mx-auto mb-12">
            Container and large volume orders qualify for competitive freight
            rates. Contact our logistics coordination team today.
          </p>
          <button className="px-10 py-5 bg-premium-charcoal text-white font-bold rounded-full hover:bg-premium-gold transition-all shadow-xl shadow-premium-gold/10">
            Contact Logistics Team
          </button>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
