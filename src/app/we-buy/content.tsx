"use client";

import PageHero from "@/components/cream-grade/PageHero";
import { motion } from "framer-motion";
import { DollarSign, Recycle, Clock, Sparkles, Send } from "lucide-react";
import { useState } from "react";

export default function WeBuyContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      type: `Supplier selling ${formData.get("type")} kg`,
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
        title="We Buy Quality Stock from UK Suppliers"
        subtitle="Sell to Us"
        description="Got high-quality clothing or surplus stock? We buy in bulk. We're always sourcing premium second-hand clothing, cream grade stock, and liquidation goods for our international buyers."
        breadcrumb={[{ label: "We Buy" }]}
      />

      {/* Buying Process */}
      <section className="py-24 ">
        <div className="container mx-auto px-14">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-premium-charcoal">
              Simple. Fair. <span className="text-premium-gold">Fast.</span>
            </h2>
            <p className="text-premium-charcoal/50">
              We&apos;ve streamlined our buying process to ensure you get paid
              quickly and your stock reaches international markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: <Clock />,
                title: "Contact Us",
                desc: "Send us details about the volume and type of clothing or stock you're selling.",
              },
              {
                step: "02",
                icon: <Sparkles />,
                title: "Assessment",
                desc: "Our experts review your stock through photos or a site visit to assess grade and quality.",
              },
              {
                step: "03",
                icon: <DollarSign />,
                title: "The Offer",
                desc: "Receive a competitive wholesale offer based on grade, condition, and quantity.",
              },
              {
                step: "04",
                icon: <Recycle />,
                title: "Pick Up",
                desc: "We arrange collection from your location. Zero hassle, fast payment.",
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

      {/* Buying Form */}
      <section className="py-24 bg-premium-charcoal text-white rounded-[40px] md:rounded-[80px] mx-4 md:mx-8 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-premium-gold opacity-10 blur-[100px] -rotate-12" />

        <div className="container mx-auto px-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Ready to sell? <br />
                <span className="text-premium-gold">
                  Let&apos;s talk business.
                </span>
              </h2>
              <div className="space-y-4">
                <p className="text-white/60 text-lg">
                  We are currently looking for:
                </p>
                <ul className="space-y-3">
                  {[
                    "Premium Cream Grade Stock",
                    "Retail Overstock & NWT Goods",
                    "High-Street Brand Surplus",
                    "Sorted Second-Hand Clothing",
                  ].map((tag, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-premium-gold" />
                      <span className="font-bold tracking-wide">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 space-y-6"
            >
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
                    placeholder="John Doe"
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
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  name="type"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-2 focus:border-premium-gold outline-none transition-colors"
                  placeholder="e.g. 100"
                />
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
                  placeholder="What type of stock are you selling?"
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
                    ? "Offer Sent!"
                    : "Send Inquiry"}{" "}
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
