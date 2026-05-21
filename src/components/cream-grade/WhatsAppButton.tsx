"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { CONTACT, COMPANY } from "@/lib/constants";

export default function WhatsAppButton() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-5 max-w-[280px] border border-gray-100"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-premium-charcoal">
                    {COMPANY.shortName}
                  </p>
                  <p className="text-[10px] text-green-600 font-medium">
                    Online now
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTooltipOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-premium-charcoal/70 mb-4 leading-relaxed">
              Hello! 👋 How can we help with your wholesale clothing needs?
            </p>
            <a
              href={CONTACT.whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-center rounded-xl font-bold text-sm transition-colors"
            >
              Start Chat
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
        className="w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl shadow-green-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} fill="white" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.button>
    </div>
  );
}
