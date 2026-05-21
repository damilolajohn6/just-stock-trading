"use client";

import PageHero from "@/components/cream-grade/PageHero";
import CTABanner from "@/components/cream-grade/CTABanner";
import { motion } from "framer-motion";
import {
  Search,
  HandshakeIcon,
  ShieldCheck,
  Ship,
  Send,
  PackageCheck,
  FileCheck,
} from "lucide-react";
import { useState } from "react";

export default function ServicesContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      type: formData.get("type"),
      details: formData.get("details"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Your Trusted UK Sourcing Representative"
        subtitle="Our Services"
        description="International buyers rely on us to source, inspect, consolidate, and coordinate export of quality wholesale goods from the United Kingdom."
        breadcrumb={[{ label: "Services" }]}
      />

      {/* Service Process */}
      <section className="py-24 ">
        <div className="container mx-auto px-14">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-premium-charcoal">
              How We <span className="text-premium-gold">Work for You.</span>
            </h2>
            <p className="text-premium-charcoal/50">
              We represent your interests locally — ensuring transparency,
              efficiency, and reliability at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: <Search />,
                title: "Source",
                desc: "We identify and source products directly from trusted UK suppliers that match your requirements.",
              },
              {
                step: "02",
                icon: <HandshakeIcon />,
                title: "Negotiate",
                desc: "We negotiate competitive wholesale pricing on your behalf, leveraging our established UK supplier relationships.",
              },
              {
                step: "03",
                icon: <ShieldCheck />,
                title: "Inspect",
                desc: "Our team conducts visual inspections and quality checks to verify grade, condition, and order accuracy.",
              },
              {
                step: "04",
                icon: <Ship />,
                title: "Ship",
                desc: "We consolidate goods, prepare export documentation, and coordinate freight forwarding to your destination.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group p-8 rounded-3xl bg-premium-cream border border-premium-gold/5"
              >
                <div className="absolute top-6 right-6 text-4xl font-display font-bold text-premium-gold/10 group-hover:text-premium-gold/20 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-premium-gold mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="text-xl font-display font-bold text-premium-charcoal mb-4">
                  {item.title}
                </h4>
                <p className="text-sm text-premium-charcoal/40 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-24 bg-premium-charcoal text-white rounded-[40px] md:rounded-[80px] mx-4 md:mx-8 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-premium-gold opacity-10 blur-[100px] -rotate-12" />

        <div className="container mx-auto px-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Comprehensive{" "}
                <span className="text-premium-gold">Service Portfolio.</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <PackageCheck className="w-5 h-5" />,
                    title: "Wholesale Clothing Supply",
                    items: [
                      "Cream grade clothing",
                      "New with tags liquidation stock",
                      "45kg, 50kg & 55kg bale packaging",
                      "Pallet and container quantities",
                    ],
                  },
                  {
                    icon: <Search className="w-5 h-5" />,
                    title: "Procurement Services",
                    items: [
                      "Product sourcing from UK suppliers",
                      "Price negotiation",
                      "Supplier verification",
                      "Bulk order management",
                    ],
                  },
                  {
                    icon: <FileCheck className="w-5 h-5" />,
                    title: "Quality Control",
                    items: [
                      "Visual inspection",
                      "Order verification",
                      "Sorting confirmation",
                    ],
                  },
                  {
                    icon: <Ship className="w-5 h-5" />,
                    title: "Export Coordination",
                    items: [
                      "Consolidation of goods",
                      "Export documentation support",
                      "Freight forwarding coordination",
                      "Container loading arrangements",
                    ],
                  },
                ].map((service, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-white/10 pb-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-premium-gold/20 flex items-center justify-center text-premium-gold">
                        {service.icon}
                      </div>
                      <h4 className="font-bold text-lg">{service.title}</h4>
                    </div>
                    <ul className="ml-11 space-y-1">
                      {service.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-2 text-white/60 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-premium-gold" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 space-y-6"
            >
              <h3 className="text-2xl font-display font-bold mb-4">
                Request Our Services
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-2 focus:border-premium-gold outline-none transition-colors"
                    placeholder="Company / Contact Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-white/20 py-2 focus:border-premium-gold outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Service Required
                </label>
                <select
                  name="type"
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-premium-gold outline-none transition-colors appearance-none"
                >
                  <option className="text-premium-charcoal">
                    Wholesale Supply
                  </option>
                  <option className="text-premium-charcoal">
                    Procurement & Sourcing
                  </option>
                  <option className="text-premium-charcoal">
                    Quality Control
                  </option>
                  <option className="text-premium-charcoal">
                    Export Coordination
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Brief Description
                </label>
                <textarea
                  name="details"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-premium-gold outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-premium-gold text-premium-charcoal font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-70"
              >
                {isSubmitting
                  ? "Sending..."
                  : isSuccess
                    ? "Inquiry Sent!"
                    : "Send Inquiry"}{" "}
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <CTABanner />

    </main>
  );
}
