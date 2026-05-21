"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: "Our minimum order is typically 100kg for bale orders. For pallet and container orders, we work with you to determine the best volume for your market needs.",
  },
  {
    q: "What payment terms do you offer?",
    a: "We accept bank transfer (TT), with payment terms discussed on a per-order basis. For new buyers, we typically require payment before dispatch. Established partners may qualify for flexible terms.",
  },
  {
    q: "How is the quality of cream grade clothing guaranteed?",
    a: "Every order undergoes visual inspection, sorting confirmation, and order verification before dispatch. Cream grade stock has a defect rate of 2-5% maximum, with brand-rich, resale-ready presentation.",
  },
  {
    q: "Which countries do you export to?",
    a: "We primarily serve buyers in Africa (Nigeria, Ghana, Kenya, Tanzania), the Middle East (UAE, Saudi Arabia), and Eastern Europe (Poland, Romania, Ukraine). However, we can arrange shipping to most international destinations.",
  },
  {
    q: "How long does shipping take?",
    a: "Sea freight typically takes 4-8 weeks depending on destination. Air cargo is available for priority orders with 5-7 day delivery. UK domestic orders are dispatched within 2-3 working days.",
  },
  {
    q: "Can I visit your warehouse or see samples?",
    a: "We welcome buyer visits by appointment. We can also arrange sample bales or photo/video documentation of your specific order before dispatch.",
  },
  {
    q: "Do you provide export documentation?",
    a: "Yes, we provide all necessary export documentation including commercial invoices, packing lists, and certificates of origin. We coordinate with freight forwarders to ensure smooth customs clearance.",
  },
  {
    q: "What bale sizes are available?",
    a: "We offer 45kg, 50kg, and 55kg bale options, all prepared for efficient container loading. Bales are compressed, wrapped, and labelled for easy identification and distribution.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-premium-cream/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
            >
              Common Questions
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-premium-charcoal"
            >
              Frequently Asked{" "}
              <span className="text-premium-gold italic font-cormorant font-normal">
                Questions
              </span>
            </motion.h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-premium-gold/5 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-bold text-premium-charcoal pr-4 group-hover:text-premium-gold transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-premium-gold flex-shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-premium-charcoal/60 leading-relaxed border-t border-premium-gold/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
