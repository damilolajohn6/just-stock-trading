"use client";

import PageHero from "@/components/cream-grade/PageHero";
import PackagingShowcase from "@/components/cream-grade/PackagingShowcase";
import CTABanner from "@/components/cream-grade/CTABanner";
import { motion } from "framer-motion";
import {
  Shirt,
  Sparkles,
  Tag,
  Package,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

const specialisations = [
  {
    title: "Used Clothing",
    icon: <Shirt className="w-8 h-8" />,
    description:
      "Quality second-hand garments sourced from established UK suppliers. Sorted, graded, and prepared for profitable international resale.",
    features: [
      "Sourced from trusted UK channels",
      "Sorted by category and grade",
      "Ladies, mens, and kids wear",
      "Consistent supply volumes",
    ],
    image: "/images/b.jpeg",
  },
  {
    title: "Cream Grade Clothing",
    icon: <Sparkles className="w-8 h-8" />,
    description:
      "The highest quality tier. Carefully selected garments with minimal to no signs of wear, including many brand-name and designer pieces.",
    features: [
      "Premium quality selection",
      "Minimal defect rate (2-5%)",
      "Brand-rich assortment",
      "Resale-ready presentation",
    ],
    image: "/images/c.jpeg",
  },
  {
    title: "Liquidation & New With Tags",
    icon: <Tag className="w-8 h-8" />,
    description:
      "Retail overstock, surplus, and clearance goods from UK retailers. Many items still carry original retail tags and packaging.",
    features: [
      "Retail overstock & surplus",
      "New with tags available",
      "High-street and brand-name labels",
      "Pallet and container volumes",
    ],
    image: "/images/d.jpeg",
  },
  {
    title: "Export-Ready Bales",
    icon: <Package className="w-8 h-8" />,
    description:
      "Professionally prepared 45kg, 50kg, and 55kg bales designed for efficient container loading and international distribution.",
    features: [
      "45kg, 50kg & 55kg options",
      "Optimised for container loading",
      "Quality-checked before packing",
      "Export documentation included",
    ],
    image: "/images/a.jpeg",
  },
];

export default function SpecialisationsContent() {
  return (
    <>
      <PageHero
        title="Quality Wholesale Goods for Global Markets"
        subtitle="Our Specialisations"
        description="From premium cream grade clothing to liquidation stock and export-ready bales — we source and supply quality wholesale goods for international buyers."
        breadcrumb={[{ label: "Specialisations" }]}
      />

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-14">
          <div className="space-y-24">
            {specialisations.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  i % 2 !== 0 ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div
                  className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ${
                    i % 2 !== 0 ? "lg:[direction:ltr]" : ""
                  }`}
                >
                  <Image
                    src={spec.image}
                    alt={spec.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      {spec.icon}
                    </div>
                  </div>
                </div>

                <div
                  className={`space-y-6 ${
                    i % 2 !== 0 ? "lg:[direction:ltr]" : ""
                  }`}
                >
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                      Specialisation {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                    {spec.title}
                  </h2>
                  <p className="text-foreground/60 leading-relaxed text-lg">
                    {spec.description}
                  </p>
                  <ul className="space-y-3">
                    {spec.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground/70 font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact-us"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors group"
                  >
                    Inquire About {spec.title}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PackagingShowcase />

      <CTABanner />
    </>
  );
}
