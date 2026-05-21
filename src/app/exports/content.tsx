"use client";

import PageHero from "@/components/cream-grade/PageHero";
import CTABanner from "@/components/cream-grade/CTABanner";
import { motion } from "framer-motion";
import {
  Globe2,
  Ship,
  Plane,
  LayoutGrid,
  MapPin,
} from "lucide-react";

const exportStats = [
  { label: "Countries Served", value: "40+" },
  { label: "Annual Shipments", value: "5000+" },
  { label: "Transit Partners", value: "12" },
  { label: "Success Rate", value: "99.9%" },
];

export default function ExportsContent() {
  return (
    <>
      <PageHero
        title="Global Export Coordination &amp; Logistics"
        subtitle="International Exports"
        description="From our UK sourcing network to your doorstep, anywhere in the world. We coordinate seamless international distribution of quality wholesale clothing and liquidation stock."
        breadcrumb={[{ label: "Exports" }]}
      />

      {/* Global Reach Section */}
      <section className="py-24 relative overflow-hidden px-14">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
          <Globe2 size={800} strokeWidth={0.5} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Across Oceans. <br />
                <span className="text-primary">Across Borders.</span>
              </h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                Just Stock Trading isn&apos;t limited to the UK market. We have
                built a robust network of freight forwarders and logistics
                experts to ensure your stock reaches you safely, whether
                you&apos;re in Lagos, Dubai, or Warsaw.
              </p>

              <div className="grid grid-cols-2 gap-8">
                {exportStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-3xl font-display font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-foreground/40 font-bold">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  icon: <Ship />,
                  title: "Sea Freight",
                  desc: "Cost-effective solutions for large volume container orders.",
                },
                {
                  icon: <Plane />,
                  title: "Air Cargo",
                  desc: "Rapid delivery for high-priority premium cream grade drops.",
                },
                {
                  icon: <LayoutGrid />,
                  title: "Customs Handling",
                  desc: "We provide all necessary documentation for smooth clearance.",
                },
                {
                  icon: <MapPin />,
                  title: "Door-to-Door",
                  desc: "Full tracking from our UK suppliers to your international destination.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-muted/30 border border-primary/10 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary mb-6 group-hover:bg-foreground group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
