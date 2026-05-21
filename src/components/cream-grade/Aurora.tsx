"use client";

import { motion } from "framer-motion";

export default function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-40 mix-blend-soft-light">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-premium-gold/30 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-premium-gold/20 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-premium-gold/25 blur-[110px]"
        />
      </div>
    </div>
  );
}
