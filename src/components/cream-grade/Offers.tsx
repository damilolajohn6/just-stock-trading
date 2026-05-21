"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Search, ShieldCheck, Ship } from "lucide-react";
import QuickContact from "./ui/QuickContact";

const services = [
  {
    title: "Wholesale Supply",
    description:
      "Cream grade clothing, NWT liquidation stock, and export-ready bales in pallet and container quantities.",
    icon: Package,
    image: "/images/b.jpeg",
  },
  {
    title: "Procurement Services",
    description:
      "Direct sourcing from trusted UK suppliers with competitive price negotiation and bulk order management.",
    icon: Search,
    image: "/images/d.jpeg",
  },
  {
    title: "Quality Control",
    description:
      "Visual inspection, order verification, and sorting confirmation to ensure every shipment meets your standards.",
    icon: ShieldCheck,
    image: "/images/c.jpeg",
  },
  {
    title: "Export Coordination",
    description:
      "Consolidation of goods, export documentation support, freight forwarding, and container loading arrangements.",
    icon: Ship,
    image: "/images/a.jpeg",
  },
];

export default function Offers() {
  return (
    <section id="offers" className="py-24 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-display font-bold text-[#8CAF8C] mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-premium-gold font-bold uppercase tracking-[0.2em] text-sm"
          >
            Your Trusted UK Sourcing Representative
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group relative aspect-square overflow-hidden rounded-xl shadow-2xl"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                  <service.icon className="w-7 h-7 text-premium-gold" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm font-medium max-w-[200px] leading-tight opacity-80">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-premium-gold font-bold uppercase tracking-[0.2em] text-sm mb-10"
          >
            We Represent Your Interests Locally
          </motion.h3>

          <QuickContact />
        </div>
      </div>
    </section>
  );
}
