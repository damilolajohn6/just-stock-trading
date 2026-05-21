"use client";

import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Squares from "./ui/Squares";
import { useState } from "react";
import { CONTACT } from "@/lib/constants";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      details: formData.get("details"),
      type: "Bulk/Export Inquiry",
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
    <section
      id="contact"
      className="py-32 bg-transparent flex items-center justify-center"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto bg-premium-charcoal rounded-[4rem] overflow-hidden shadow-3xl flex flex-col lg:row relative"
        >
          {/* Squares Background for the entire card */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Squares
              speed={0.3}
              squareSize={50}
              borderColor="rgba(255, 255, 255, 0.1)"
            />
          </div>

          <div className="flex flex-col lg:flex-row relative z-10 w-full">
            {/* Contact Info */}
            <div className="lg:w-2/5 p-16 premium-gradient text-white flex flex-col justify-between border-right border-white/5">
              <div>
                <span className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
                  Direct Inquiry
                </span>
                <h2 className="text-5xl font-display font-bold mb-8 italic text-white tracking-tight">
                  Connect <br /> with Us
                </h2>
                <p className="text-white/50 mb-16 leading-relaxed font-light text-lg">
                  Your strategic UK sourcing partner. Available for wholesale
                  supply and international export.
                </p>

                <div className="space-y-12">
                  <a
                    href={`tel:${CONTACT.phoneRaw}`}
                    className="flex items-center gap-8 group"
                  >
                    <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-premium-gold group-hover:border-premium-gold transition-all duration-500 transform group-hover:-rotate-6">
                      <Phone
                        size={24}
                        className="group-hover:text-premium-charcoal transition-colors"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">
                        Call Our Office
                      </span>
                      <span className="text-xl font-bold group-hover:text-premium-gold transition-colors">
                        {CONTACT.phone}
                      </span>
                    </div>
                  </a>

                  <a
                    href={CONTACT.whatsappMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-8 group"
                  >
                    <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-[#25D366] group-hover:border-[#25D366] transition-all duration-500 transform group-hover:rotate-6">
                      <MessageCircle
                        size={24}
                        className="group-hover:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">
                        WhatsApp Chat
                      </span>
                      <span className="text-xl font-bold group-hover:text-premium-gold transition-colors">
                        Message Us Now
                      </span>
                    </div>
                  </a>

                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 block mb-1">
                        Our Base
                      </span>
                      <span className="text-xl font-bold"> Accent business centre BD3 9BD, England, United Kingdom</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-10 border-t border-white/5">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
                  Just Stock Trading Limited
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-3/5 p-16 bg-white flex flex-col justify-center">
              <h3 className="text-4xl font-display font-bold text-premium-charcoal mb-4">
                Scale Your Business
              </h3>
              <p className="text-premium-charcoal/40 mb-12 leading-relaxed text-lg font-light">
                Request a quote for export or wholesale bulk orders.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-premium-charcoal/30 mb-3 group-focus-within:text-premium-gold transition-colors">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-8 py-5 bg-premium-cream/50 border-b-2 border-transparent focus:border-premium-gold outline-none transition-all duration-300 font-medium"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-premium-charcoal/30 mb-3 group-focus-within:text-premium-gold transition-colors">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-8 py-5 bg-premium-cream/50 border-b-2 border-transparent focus:border-premium-gold outline-none transition-all duration-300 font-medium"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-premium-charcoal/30 mb-3 group-focus-within:text-premium-gold transition-colors">
                    Inquiry Details
                  </label>
                  <textarea
                    name="details"
                    required
                    rows={4}
                    className="w-full px-8 py-5 bg-premium-cream/50 border-b-2 border-transparent focus:border-premium-gold outline-none transition-all duration-300 font-medium resize-none"
                    placeholder="How can we help your business?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-6 bg-premium-charcoal text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-premium-gold/20 disabled:opacity-70"
                >
                  <span className="relative z-10">
                    {isSubmitting
                      ? "Sending..."
                      : isSuccess
                        ? "Message Sent!"
                        : "Send Direct Inquiry"}
                  </span>
                  <div className="absolute inset-0 bg-premium-gold scale-x-0 transition-transform duration-500 origin-left" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
