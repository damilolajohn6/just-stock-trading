"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHero({
  title,
  subtitle,
  description,
  breadcrumb,
}: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-premium-cream px-14">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-premium-gold/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-premium-charcoal/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumb && (
          <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-premium-charcoal/40 mb-8">
            <Link
              href="/"
              className="hover:text-premium-gold transition-colors"
            >
              Home
            </Link>
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight size={12} className="text-premium-gold/40" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-premium-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-premium-charcoal/60 font-bold">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="max-w-4xl">
          {subtitle && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-[10px] uppercase tracking-[0.4em] text-premium-gold font-bold mb-4"
            >
              {subtitle}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-premium-charcoal leading-tight mb-8"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-premium-charcoal/60 max-w-2xl leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
