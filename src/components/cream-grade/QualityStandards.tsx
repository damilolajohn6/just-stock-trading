"use client";

import { ShieldCheck, ClipboardCheck, Eye, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import QuickContact from "./ui/QuickContact";

const standards = [
  {
    title: "Visual Inspection",
    description:
      "Every garment undergoes thorough visual inspection to ensure it meets cream grade quality standards before export.",
    icon: Eye,
  },
  {
    title: "Order Verification",
    description:
      "We verify every order against your specifications — grade, volume, and packaging — before dispatch.",
    icon: ClipboardCheck,
  },
  {
    title: "Sorting Confirmation",
    description:
      "Our sorting process ensures proper categorisation and grade separation, maximising your resale value.",
    icon: ShieldCheck,
  },
  {
    title: "Supplier Verification",
    description:
      "We vet and verify all UK suppliers to ensure consistent quality and reliable supply chains for our partners.",
    icon: UserCheck,
  },
];

export default function QualityStandards() {
  return (
    <section
      id="quality"
      className="py-32 bg-transparent relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-12 left-12 w-64 h-64 border border-premium-gold rounded-full" />
        <div className="absolute bottom-12 right-12 w-96 h-96 border border-premium-gold rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
              Quality Assurance
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-premium-charcoal mb-10 leading-tight">
              Built on Trust <br /> & Precision
            </h2>
            <div className="space-y-10">
              {standards.map((standard, index) => (
                <motion.div
                  key={standard.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex gap-8 group"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-premium-gold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <standard.icon size={28} />
                  </div>
                  <div className="pt-2">
                    <h3 className="text-2xl font-bold text-premium-charcoal mb-3">
                      {standard.title}
                    </h3>
                    <p className="text-premium-charcoal/50 leading-relaxed text-lg font-light">
                      {standard.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-3xl border-8 border-white">
              <img
                src="/images/aa.jpeg"
                alt="Quality Inspection"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-premium-charcoal/5" />
            </div>

            {/* Elegant Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-12 -left-12 bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl max-w-[300px] hidden md:block border border-premium-gold/10"
            >
              <p className="text-premium-charcoal font-display text-xl leading-relaxed italic mb-6">
                &quot;Precision, professionalism, and trust define our
                approach.&quot;
              </p>
              <div className="flex items-center gap-2 text-premium-gold">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <QuickContact />
      </div>
    </section>
  );
}
