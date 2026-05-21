"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import QuickContact from "./ui/QuickContact";

export default function About() {
  return (
    <section id="about" className="py-32 bg-transparent overflow-hidden">
      <div className="container mx-auto px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual Grid - Left Side */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/b.jpeg"
                  alt="UK Sourcing Operations"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl translate-y-12"
              >
                <Image
                  src="/images/c.jpeg"
                  alt="Export-Ready Bales"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
            </div>

            {/* Floating Stats Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-10 -right-6 lg:right-10 bg-premium-charcoal text-white p-8 rounded-3xl shadow-3xl max-w-[240px] z-20 border border-white/10"
            >
              <h4 className="text-3xl font-display font-bold text-premium-gold mb-2">
                100%
              </h4>
              <p className="text-sm text-white/60 font-medium leading-relaxed uppercase tracking-wider">
                Quality-Assured & Export-Ready
              </p>
            </motion.div>
          </div>

          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
              About Just Stock Trading
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-premium-charcoal mb-8 leading-[1.1]">
              Your Strategic Partner in{" "}
              <span className="text-premium-gold italic font-cormorant font-normal">
                UK Sourcing
              </span>
            </h2>

            <div className="space-y-6 text-premium-charcoal/70 text-lg font-light leading-relaxed">
              <p>
                Based in the United Kingdom,{" "}
                <span className="font-bold text-premium-charcoal">
                  Just Stock Trading Limited
                </span>{" "}
                was established to bridge the gap between UK suppliers and
                international buyers seeking reliable wholesale goods. We
                specialise in sourcing quality cream grade clothing and
                liquidation stock for resale markets worldwide.
              </p>

              <p>
                We are not simply wholesalers. We are your strategic sourcing
                partner — ensuring transparency, efficiency, and reliability at
                every step of the procurement and export process.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-start gap-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-[1px] bg-premium-gold/30" />
                <p className="text-premium-charcoal font-display text-xl">
                  For Enquiries: +44 07344056285
                </p>
              </div>

              <QuickContact className="!justify-start mt-0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
