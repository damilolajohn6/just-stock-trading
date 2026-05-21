"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-premium-cream/20 backdrop-blur-sm border-t border-premium-gold/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <Link href="/" className="inline-block mb-8">
          <span className="text-3xl font-display font-bold tracking-tight text-premium-charcoal">
            JUST STOCK TRADING
          </span>
          <br />
          <span className="text-[10px] uppercase tracking-[0.4em] text-premium-gold font-medium">
            Strategic Sourcing & Wholesale Export
          </span>
        </Link>

        <p className="text-premium-charcoal/40 text-sm max-w-xl mx-auto mb-12">
          UK-based procurement and wholesale export specialists delivering used
          clothing, cream grade clothing, and liquidation stock to international
          buyers worldwide.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-left max-w-4xl mx-auto">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold">
              Products
            </h4>
            <div className="flex flex-col space-y-2">
              <Link
                href="/specialisations"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Specialisations
              </Link>
              <Link
                href="/wholesale"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Wholesale
              </Link>
              <Link
                href="/live-offers"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Live Offers
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold">
              Services
            </h4>
            <div className="flex flex-col space-y-2">
              <Link
                href="/services"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Our Services
              </Link>
              <Link
                href="/we-buy"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                We Buy
              </Link>
              <Link
                href="/exports"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Export Coordination
              </Link>
              <Link
                href="/shipping"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Shipping & Logistics
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold">
              Company
            </h4>
            <div className="flex flex-col space-y-2">
              <Link
                href="/about-us"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="/contact-us"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-premium-gold">
              Support
            </h4>
            <div className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-premium-charcoal/60 hover:text-premium-gold transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-premium-gold/5 flex flex-col md:flex-row items-center justify-between text-[11px] uppercase tracking-widest text-premium-charcoal/30">
          <p>© 2026 Just Stock Trading Limited. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="hover:text-premium-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-premium-gold transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
