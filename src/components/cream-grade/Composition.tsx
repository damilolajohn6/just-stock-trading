"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import QuickContact from "./ui/QuickContact";

const specialisations = [
  {
    label: "Used Clothing",
    percentage: "Premium",
    description:
      "Carefully selected high-quality garments from UK suppliers, prepared for profitable resale markets worldwide.",
    image: "/images/b.jpeg",
    color: "bg-[#EADDC9]",
  },
  {
    label: "Cream Grade Clothing",
    percentage: "Top Tier",
    description:
      "The highest quality grade — minimal wear, brand-rich, and resale-ready. The pinnacle of second-hand garments.",
    image: "/images/c.jpeg",
    color: "bg-[#D6C4AD]",
  },
  {
    label: "Liquidation & NWT Stock",
    percentage: "Surplus",
    description:
      "Retail overstock, surplus, and clearance goods supplied in pallet and container volumes. New with tags.",
    image: "/images/d.jpeg",
    color: "bg-[#C2AB8E]",
  },
];

export default function Composition() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      id="composition"
      ref={containerRef}
      className="py-32 bg-transparent overflow-hidden relative"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            What We Supply
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-display font-bold text-premium-charcoal mb-8"
          >
            Our Specialisation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-premium-charcoal/50 text-xl font-light italic max-w-2xl mx-auto"
          >
            Delivering quality wholesale goods to international buyers — from
            premium cream grade clothing to liquidation stock.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {specialisations.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: index * 0.2,
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-premium-cream shadow-2xl transition-all duration-700 group-hover:shadow-premium-gold/20 group-hover:-translate-y-4">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal via-premium-charcoal/20 to-transparent opacity-80" />

                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    <span className="text-premium-gold font-display text-3xl font-bold mb-4 block">
                      {item.percentage}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {item.label}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed max-w-[240px]">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ y }}
          className="mt-32 p-16 rounded-[3.5rem] premium-gradient text-white shadow-3xl overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-premium-gold/10 rounded-full blur-[120px] -mr-64 -mt-64 transition-transform duration-1000 group-hover:scale-125" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <span className="text-premium-gold font-bold uppercase tracking-widest text-xs mb-4 block">
                Export-Ready Packaging
              </span>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-6 italic">
                45kg, 50kg & 55kg Bales
              </h3>
              <p className="text-white/60 text-lg max-w-xl font-light">
                Prepared for efficient container loading and international
                distribution. Every bale is quality-checked and export-ready,
                ensuring your shipment meets the highest standards.
              </p>

              <QuickContact variant="dark" className="!justify-start mt-8" />
            </div>
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full border border-premium-gold/30 flex items-center justify-center p-4 text-center backdrop-blur-sm relative group cursor-default">
                <div className="absolute inset-2 border border-premium-gold/10 rounded-full animate-pulse-slow" />
                <span className="text-premium-gold text-xs font-bold uppercase tracking-widest">
                  Export Ready
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
