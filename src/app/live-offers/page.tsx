"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SearchDrawer } from '@/components/layout/header/search-drawer';
import PageHero from "@/components/cream-grade/PageHero";
import { motion } from "framer-motion";
import {
  Instagram,
  Video,
  ExternalLink,
  ShoppingBag,
  Zap,
  Users,
} from "lucide-react";
import Image from "next/image";

const socialSales = [
  {
    platform: "Instagram",
    icon: <Instagram className="w-6 h-6" />,
    handle: "@juststocktrading",
    description:
      "Catch our daily story drops and view premium stock before it ships.",
    link: "https://instagram.com",
    color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
  },
  {
    platform: "TikTok",
    icon: <Video className="w-6 h-6" />,
    handle: "@juststocktrading",
    description:
      "Join our warehouse walkthroughs and see our quality stock in action.",
    link: "https://tiktok.com",
    color: "bg-[#000000]",
  },
];

export default function LiveOffers() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />

      <PageHero
        title="Live Stock Availability & Exclusive Offers"
        subtitle="Live Offers"
        description="Stay updated with our latest stock arrivals, exclusive wholesale offers, and real-time availability. Follow us on social media for live warehouse updates."
        breadcrumb={[{ label: "Live Offers" }]}
      />

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  How It Works
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Real-time Stock.{" "}
                <span className="text-primary">Direct Access.</span>
              </h2>
              <p className="text-foreground/60 leading-relaxed text-lg">
                Our social channels give international buyers direct visibility
                into our current stock levels, new arrivals, and exclusive
                wholesale pricing — all in real-time.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="text-primary" />,
                    title: "Instant Updates",
                    text: "Be the first to know about new stock arrivals and exclusive pricing.",
                  },
                  {
                    icon: <ShoppingBag className="text-primary" />,
                    title: "Live-Only Offers",
                    text: "Special wholesale pricing available exclusively through our live sessions.",
                  },
                  {
                    icon: <Users className="text-primary" />,
                    title: "Direct Communication",
                    text: "Connect directly with our sourcing team for immediate stock inquiries.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-sm text-foreground/50">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialSales.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl p-8 h-[400px] flex flex-col justify-end text-white"
                >
                  <div
                    className={`absolute inset-0 ${social.color} opacity-90 group-hover:scale-110 transition-transform duration-700`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      {social.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold">
                        {social.platform}
                      </h3>
                      <p className="text-sm text-white/70 font-mono">
                        {social.handle}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-white/80">
                      {social.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                      Follow Us <ExternalLink size={14} />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
      <SearchDrawer />
    </main>
  );
}
