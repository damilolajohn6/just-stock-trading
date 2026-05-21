"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Box, Layers, Container } from "lucide-react";

const packagingOptions = [
  {
    title: "Bags",
    subtitle: "Sorted & Bagged",
    description:
      "Carefully sorted garments in transparent bags for easy inspection and handling.",
    image: "/images/bags-of-clothing.png",
    icon: Package,
    stat: "20–40kg",
    statLabel: "Per Bag",
  },
  {
    title: "Bales",
    subtitle: "Compressed & Wrapped",
    description:
      "Export-ready compressed bales, professionally wrapped for secure international shipping.",
    image: "/images/bales-of-clothes.png",
    icon: Box,
    stat: "45–55kg",
    statLabel: "Per Bale",
  },
  {
    title: "Pallets",
    subtitle: "Consolidated & Wrapped",
    description:
      "Palletised loads of bales and bags, stretch-wrapped and ready for warehouse or container loading.",
    image: "/images/pallet-of-clothing.png",
    icon: Layers,
    stat: "500kg+",
    statLabel: "Per Pallet",
  },
  {
    title: "Containers",
    subtitle: "Full Container Loads",
    description:
      "Complete container loading for large-scale international distribution to global markets.",
    image: "/images/shipping-container.png",
    icon: Container,
    stat: "20–40ft",
    statLabel: "FCL Available",
  },
];

export default function PackagingShowcase() {
  return (
    <section className="py-32 bg-premium-cream overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-premium-gold blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Packaging & Distribution
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-display font-bold text-premium-charcoal mb-6"
          >
            From Bag to{" "}
            <span className="text-premium-gold italic font-cormorant font-normal">
              Container
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-premium-charcoal/50 text-xl font-light max-w-2xl mx-auto"
          >
            We supply at every scale — from individual bags to full container
            loads, prepared for efficient international distribution.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packagingOptions.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.15,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-premium-gold/5">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Floating Stat Badge */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-premium-gold/10"
                  >
                    <span className="text-premium-gold font-display font-bold text-lg">
                      {item.stat}
                    </span>
                    <span className="text-premium-charcoal/40 text-[9px] font-bold uppercase tracking-wider ml-1">
                      {item.statLabel}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-premium-gold/90 transition-colors duration-500">
                      <item.icon size={20} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-premium-gold">
                      {item.subtitle}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-premium-charcoal mt-1">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-premium-charcoal/50 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 text-center"
        >
          <p className="text-premium-charcoal/50 text-lg font-light">
            Need a custom packaging arrangement?
          </p>
          <a
            href="/contact-us"
            className="px-8 py-4 bg-premium-charcoal text-white rounded-full font-bold hover:bg-premium-gold hover:text-premium-charcoal transition-all duration-300 shadow-xl shadow-premium-gold/10"
          >
            Request a Quote
          </a>
        </motion.div>
      </div>
    </section>
  );
}
