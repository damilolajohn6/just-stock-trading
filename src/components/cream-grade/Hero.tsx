"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Aurora from "./ui/Aurora";
import QuickContact from "./ui/QuickContact";
import Link from 'next/link';
import { Button } from '@/components/ui/button';


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
          </motion.div>

           <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className="h-14 rounded-full bg-white px-10 text-lg font-semibold text-black shadow-2xl shadow-white/20 hover:bg-white/90"
                    >
                      <Link href="/products">
                        Start Shopping
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-14 rounded-full border-white/30 px-10 text-lg text-white backdrop-blur-sm hover:bg-white/10"
                    >
                      <Link href="/products?sort=newest">New Arrivals</Link>
                    </Button>
                  </div>

          <div className="hidden lg:block">
            <QuickContact variant="dark" />
          </div>
        </div>
      </div>

      {/* Stats/Quick Info */}
      {/* <motion.div
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
      </motion.div> */}
    </section>
  );
}
