"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Aurora from "./ui/Aurora";
import QuickContact from "./ui/QuickContact";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center pt-32 pb-16 lg:pt-24 lg:pb-0 overflow-hidden bg-transparent">
      {/* Aurora Background */}
      <Aurora />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/images/a.jpeg"
          alt="Premium Wholesale Export Clothing"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-premium-cream/0 via-premium-cream/50 to-premium-cream" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-premium-charcoal leading-[1.1] md:leading-[1.05] mb-6 md:mb-8 tracking-tight px-2">
              Your Strategic{" "}
              <span className="text-premium-gold italic font-cormorant font-normal block sm:inline">
                Sourcing Partner
              </span>{" "}
              in the UK
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-premium-charcoal/70 leading-relaxed mb-8 md:mb-12 max-w-2xl mx-auto font-light px-4"
            >
              Supplying global markets with confidence. Premium cream grade
              clothing, used clothing, and liquidation stock — sourced,
              quality-checked, and export-ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4"
            >
              <a
                href="/contact-us"
                className="group relative px-8 py-4 md:px-10 md:py-5 bg-premium-charcoal text-white rounded-full font-bold text-base md:text-lg overflow-hidden transition-all duration-500 hover:pr-12 md:hover:pr-14 w-full sm:w-auto"
              >
                <span className="relative z-10">Request a Quote</span>
                <span className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <ArrowRight size={18} />
                </span>
                <div className="absolute inset-0 bg-premium-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>
              <a
                href="/services"
                className="px-8 py-4 md:px-10 md:py-5 border border-premium-charcoal/20 text-premium-charcoal rounded-full font-bold text-base md:text-lg hover:bg-premium-charcoal/5 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
              >
                View Our Services
              </a>
            </motion.div>
          </motion.div>

          <div className="mt-12 md:mt-16 block lg:hidden w-full max-w-sm mx-auto">
            <QuickContact variant="dark" />
          </div>

          <div className="hidden lg:block">
            <QuickContact variant="dark" />
          </div>
        </div>
      </div>

      {/* Stats/Quick Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full mt-12 lg:mt-0 lg:absolute lg:bottom-12 lg:left-0 lg:right-0 px-4"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:flex lg:justify-between items-center max-w-4xl mx-auto px-4 py-6 md:px-12 md:py-8 bg-white/40 lg:bg-white/30 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl shadow-premium-gold/5 gap-y-6 lg:gap-y-0 text-center">
            {[
              { label: "Markets Served", val: "Africa • ME" },
              { label: "Bale Sizes", val: "45–55kg" },
              { label: "Quality", val: "Cream Grade" },
              { label: "Origin", val: "UK-Sourced" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center"
              >
                <span className="block text-premium-gold font-display text-2xl md:text-3xl font-bold mb-1">
                  {stat.val}
                </span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-premium-charcoal/50 font-bold px-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
