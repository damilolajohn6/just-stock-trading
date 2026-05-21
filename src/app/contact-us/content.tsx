"use client";

import PageHero from "@/components/cream-grade/PageHero";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

export default function ContactUsContent() {
  return (
    <>
      <PageHero
        title="Partner With Us for Reliable UK Sourcing"
        subtitle="Contact Us"
        description="Have a question about our products, procurement services, or wholesale exports? Our dedicated team is ready to assist international buyers."
        breadcrumb={[{ label: "Contact Us" }]}
      />

      <section className="py-24 px-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  Get in <span className="text-primary">Touch.</span>
                </h2>
                <p className="text-foreground/50 text-lg leading-relaxed">
                  Whether you&apos;re an established importer or exploring new
                  supply partnerships, we value every inquiry. Reach out via the
                  form or our direct channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Mail />,
                    title: "Email Us",
                    detail: "info@juststocktrading.co.uk",
                    label: "Inquiries",
                  },
                  {
                    icon: <Phone />,
                    title: "Call Us",
                    detail: "+44 (0) 7344056285",
                    label: "Direct Line",
                  },
                  {
                    icon: <MessageSquare />,
                    title: "WhatsApp",
                    detail: "+44 (0) 7344056285",
                    label: "Quick Chat",
                  },
                  {
                    icon: <Clock />,
                    title: "Visit Us",
                    detail: "Mon-Fri: 9am - 5pm",
                    label: "Operating Hours",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group p-8 rounded-3xl bg-muted/30 border border-primary/5 hover:border-primary/20 transition-all"
                  >
                    <div className="text-primary mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">
                      {item.label}
                    </div>
                    <h4 className="font-bold text-foreground text-lg mb-2">
                      {item.title}
                    </h4>
                    <p className="text-foreground/60 font-mono text-sm">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-3xl border border-primary/10 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin />
                </div>
                <div>
                  <div className="font-bold text-foreground">
                    Just Stock Trading Limited
                  </div>
                  <div className="text-sm text-foreground/40">
                    Accent business centre BD3 9BD, England, United Kingdom
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-primary/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-primary outline-none transition-colors"
                      placeholder="Damilola A."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-primary outline-none transition-colors"
                      placeholder="damilola@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    Subject
                  </label>
                  <select className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-primary outline-none transition-colors appearance-none cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Wholesale Order</option>
                    <option>Procurement Request</option>
                    <option>Export Quote</option>
                    <option>Shipping Question</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-primary outline-none transition-colors resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                <button className="w-full py-5 bg-foreground text-white font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl shadow-primary/10">
                  Send Your Message <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
