"use client";

import PageHero from "@/components/cream-grade/PageHero";
import { motion } from "framer-motion";
import CTABanner from "@/components/cream-grade/CTABanner";
import { Target, Users2, ShieldCheck, Handshake, MapPin } from "lucide-react";
import Image from "next/image";

export default function AboutUsContent() {
  return (
    <main className="min-h-screen bg-white ">
      <PageHero
        title="Strategic Sourcing & Wholesale Export Specialists"
        subtitle="About Us"
        description="Just Stock Trading Limited was established to bridge the gap between UK suppliers and international buyers seeking reliable wholesale goods."
        breadcrumb={[{ label: "About Us" }]}
      />

      {/* Story Section */}
      <section className="py-24 overflow-hidden px-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-block p-2 px-4 rounded-full bg-premium-gold/10 text-premium-gold text-xs font-bold uppercase tracking-widest">
                Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-premium-charcoal">
                Built for{" "}
                <span className="text-premium-gold">Long-Term Trade.</span>
              </h2>
              <div className="space-y-4 text-premium-charcoal/60 leading-relaxed text-lg">
                <p>
                  As a UK-based procurement and export agency, we specialise in
                  sourcing quality cream grade clothing and liquidation stock
                  for resale markets worldwide. We work with established
                  importers and wholesale distributors across Africa, the Middle
                  East, and Eastern Europe.
                </p>
                <p>
                  We understand the challenges faced by importers — inconsistent
                  quality, unreliable suppliers, and lack of transparency. Our
                  mission is to remove these risks by offering structured
                  sourcing, professional communication, and dependable export
                  coordination.
                </p>
                <p>
                  Our focus is sustainable trade partnerships, not one-off
                  transactions. Precision, professionalism, and trust define our
                  approach.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <div className="absolute inset-4 border border-premium-gold/30 rounded-[40px] z-0" />
              <div className="absolute inset-0 overflow-hidden rounded-[40px] shadow-2xl z-10">
                <Image
                  src="/images/aa.jpeg"
                  alt="Our Operations"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-premium-cream px-14">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl font-display font-bold text-premium-charcoal">
              What Sets Us Apart
            </h2>
            <p className="text-premium-charcoal/50">
              International buyers rely on us because we deliver on four key
              pillars that define every partnership we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Target />,
                title: "Precision",
                desc: "Every order is meticulously sourced, inspected, and prepared to your exact specifications.",
              },
              {
                icon: <ShieldCheck />,
                title: "Professionalism",
                desc: "Structured communication, clear documentation, and reliable timelines at every stage.",
              },
              {
                icon: <Handshake />,
                title: "Trust",
                desc: "We represent your interests locally — ensuring transparency, efficiency, and accountability.",
              },
              {
                icon: <Users2 />,
                title: "Long-Term Partnerships",
                desc: "Our focus is sustainable trade relationships, not one-off transactions.",
              },
            ].map((value, i) => (
              <div key={i} className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-premium-gold shadow-sm">
                  {value.icon}
                </div>
                <h4 className="text-xl font-display font-bold text-premium-charcoal">
                  {value.title}
                </h4>
                <p className="text-sm text-premium-charcoal/50 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locate Us */}
      <section className="py-24 bg-white ">
        <div className="container mx-auto px-4">
          <div className="rounded-[40px] bg-premium-charcoal p-12 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-premium-gold opacity-5 blur-[120px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-display font-bold">
                  United Kingdom
                </h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  Just Stock Trading Limited operates from the United Kingdom,
                  providing dependable sourcing, professional coordination, and
                  export-ready supply to international buyers worldwide.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-premium-gold flex-shrink-0" />
                    <div>
                      <div className="font-bold">Headquarters</div>
                      <div className="text-white/40 text-sm">
                        Accent business centre BD3 9BD, England, United Kingdom
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[300px] md:h-[400px] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-white/20 italic">
                {/* Map Placeholder */}[ Interactive Map View ]
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
