"use client";

import { motion } from "framer-motion";
import { Shield, Globe, Award, TrendingUp, Star, Quote } from "lucide-react";

const stats = [
  { icon: Globe, value: "3+", label: "Regions Served" },
  { icon: TrendingUp, value: "500+", label: "Containers Shipped" },
  { icon: Shield, value: "100%", label: "Quality Assured" },
  { icon: Award, value: "UK", label: "Registered Company" },
];

const testimonials = [
  {
    quote:
      "Just Stock Trading has been our reliable UK sourcing partner for over a year. Consistent quality and professional communication every time.",
    author: "Wholesale Distributor",
    location: "Lagos, Nigeria",
    rating: 5,
  },
  {
    quote:
      "The cream grade quality is exactly as described. Their bale packaging is excellent for our container shipments. Highly recommended.",
    author: "Clothing Importer",
    location: "Dubai, UAE",
    rating: 5,
  },
  {
    quote:
      "What sets them apart is their transparency. We always know exactly what we're getting. Professional export documentation every time.",
    author: "Wholesale Buyer",
    location: "Warsaw, Poland",
    rating: 5,
  },
];

export default function TrustSignals() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Stats Counter Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-3xl bg-premium-cream/50 border border-premium-gold/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-premium-gold mx-auto mb-4 shadow-sm">
                <stat.icon size={24} />
              </div>
              <span className="block text-4xl font-display font-bold text-premium-charcoal mb-1">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-premium-charcoal/40">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Trusted by Buyers Worldwide
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-display font-bold text-premium-charcoal"
          >
            What Our{" "}
            <span className="text-premium-gold italic font-cormorant font-normal">
              Partners Say
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="relative p-8 rounded-3xl bg-premium-cream/40 border border-premium-gold/5 hover:border-premium-gold/20 transition-all group"
            >
              <Quote
                size={32}
                className="text-premium-gold/20 mb-4 group-hover:text-premium-gold/40 transition-colors"
              />
              <p className="text-premium-charcoal/70 leading-relaxed mb-6 font-light italic text-lg">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-premium-gold fill-premium-gold"
                  />
                ))}
              </div>
              <div>
                <p className="font-bold text-premium-charcoal text-sm">
                  {testimonial.author}
                </p>
                <p className="text-xs text-premium-charcoal/40">
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
