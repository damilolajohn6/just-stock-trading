"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export default function CTABanner() {
  return (
    <section className="py-20 bg-premium-charcoal relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-premium-gold opacity-5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[30%] h-full bg-premium-gold opacity-5 blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
            Start Today
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Ready to Partner{" "}
            <span className="text-premium-gold italic font-cormorant font-normal">
              with Us?
            </span>
          </h2>
          <p className="text-white/50 text-lg mb-12 max-w-2xl mx-auto font-light">
            Whether you need quality wholesale clothing, procurement support, or
            export coordination — we&apos;re here to help your business grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact-us"
              className="group px-10 py-5 bg-premium-gold text-premium-charcoal rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white transition-all duration-300 shadow-xl shadow-premium-gold/20"
            >
              Get a Quote
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href={CONTACT.whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border border-white/20 text-white rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="px-10 py-5 border border-white/20 text-white rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <Phone size={20} />
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
