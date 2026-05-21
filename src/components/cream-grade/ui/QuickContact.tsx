"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail } from "lucide-react";

interface QuickContactProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function QuickContact({
  variant = "light",
  className = "",
}: QuickContactProps) {
  const isLight = variant === "light";

  return (
    <div className={`mt-12 flex justify-center gap-6 ${className}`}>
      <motion.a
        href="tel:+447344056285"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, scale: 1.1 }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
          isLight
            ? "bg-white text-premium-charcoal border border-premium-gold/10 hover:shadow-premium-gold/20"
            : "bg-white/5 text-white border border-white/10 hover:bg-white hover:text-premium-charcoal"
        }`}
      >
        <Phone size={22} strokeWidth={1.5} />
      </motion.a>

      <motion.a
        href="https://wa.me/447344056285?text=Hello%2C%20I%27m%20interested%20in%20your%20wholesale%20clothing%20supply."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -5, scale: 1.1 }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
          isLight
            ? "bg-[#25D366] text-white hover:shadow-[#25D366]/40"
            : "bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white"
        }`}
      >
        <MessageCircle size={26} />
      </motion.a>

      <motion.a
        href="mailto:info@juststocktrading.co.uk"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -5, scale: 1.1 }}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
          isLight
            ? "bg-[#E15858] text-white hover:shadow-[#E15858]/40"
            : "bg-[#E15858]/20 text-[#E15858] hover:bg-[#E15858] hover:text-white"
        }`}
      >
        <Mail size={26} />
      </motion.a>
    </div>
  );
}
