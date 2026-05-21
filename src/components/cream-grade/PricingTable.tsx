"use client";

import { motion } from "framer-motion";
import QuickContact from "./ui/QuickContact";

const pricingData = [
  // Cream Grade Section
  {
    item: "Winter Mix",
    quality: "Cream Grade",
    gender: "Men & Women",
    price: "£ 6.00",
  },
  {
    item: "Summer Mix",
    quality: "Cream Grade",
    gender: "Men & Women",
    price: "£ 6.50",
  },
  {
    item: "Men Mix",
    quality: "Cream Grade",
    gender: "Men",
    price: "£ 7.00",
  },
  {
    item: "Children Summer Mix",
    quality: "Cream Grade",
    gender: "Children",
    price: "£ 7.50",
  },
  {
    item: "Children Winter Mix",
    quality: "Cream Grade",
    gender: "Children",
    price: "£ 7.00",
  },
  {
    item: "Ladies Dresses",
    quality: "Cream Grade",
    gender: "Women",
    price: "£ 7.50",
  },
  {
    item: "Big Size",
    quality: "Cream Grade",
    gender: "Men & Women",
    price: "£ 7.00",
  },
  {
    item: "Lady Jeans",
    quality: "Cream Grade",
    gender: "Women",
    price: "£ 6.00",
  },
  {
    item: "Men Jeans",
    quality: "Cream Grade",
    gender: "Men",
    price: "£ 6.00",
  },
  {
    item: "Shoes (Summer/Winter)",
    quality: "Cream Grade",
    gender: "Unisex",
    price: "£ 5.00",
  },
  {
    item: "Handbags",
    quality: "Cream Grade",
    gender: "Women",
    price: "£ 6.00",
  },
  {
    item: "Lingerie",
    quality: "Cream Grade",
    gender: "Women",
    price: "£ 7.25",
  },
  // New With Tags Section
  {
    item: "Winter Mix",
    quality: "New With Tags",
    gender: "Men & Women",
    price: "£ 10.00",
  },
  {
    item: "Summer Mix",
    quality: "New With Tags",
    gender: "Men & Women",
    price: "£ 10.00",
  },
  {
    item: "Men Mix",
    quality: "New With Tags",
    gender: "Men",
    price: "£ 10.00",
  },
  {
    item: "Children Mix (S/W)",
    quality: "New With Tags",
    gender: "Children",
    price: "£ 10.00",
  },
  {
    item: "Ladies Dresses",
    quality: "New With Tags",
    gender: "Women",
    price: "£ 10.00",
  },
  {
    item: "Ladies Mixed",
    quality: "New With Tags",
    gender: "Women",
    price: "£ 10.00",
  },
  {
    item: "Big Size Ladies",
    quality: "New With Tags",
    gender: "Women",
    price: "£ 10.00",
  },
  {
    item: "Lady Jeans",
    quality: "New With Tags",
    gender: "Women",
    price: "£ 10.00",
  },
  {
    item: "Men Jeans",
    quality: "New With Tags",
    gender: "Men",
    price: "£ 10.00",
  },
];

export default function PricingTable() {
  return (
    <section id="pricing" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-premium-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Wholesale Trade Prices
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-premium-charcoal mb-4"
          >
            Price List <span className="italic text-premium-gold">& Deals</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-premium-charcoal/50 text-sm max-w-lg mx-auto"
          >
            Prices are indicative wholesale trade rates per kilogram. Final
            pricing is subject to order volume, market conditions, and
            destination.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-3xl overflow-hidden border border-premium-gold/5"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-premium-charcoal text-white">
                  <th className="py-6 px-8 text-sm font-bold uppercase tracking-widest border-b border-white/10">
                    Item
                  </th>
                  <th className="py-6 px-8 text-sm font-bold uppercase tracking-widest border-b border-white/10">
                    Quality
                  </th>
                  <th className="py-6 px-8 text-sm font-bold uppercase tracking-widest border-b border-white/10">
                    Gender
                  </th>
                  <th className="py-6 px-8 text-sm font-bold uppercase tracking-widest border-b border-white/10 text-right">
                    £/Kg
                  </th>
                </tr>
              </thead>
              <tbody className="text-premium-charcoal">
                {pricingData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`group transition-colors duration-300 ${index % 2 === 0 ? "bg-premium-cream/30" : "bg-white"} hover:bg-premium-gold/5`}
                  >
                    <td className="py-5 px-8 font-medium border-b border-premium-gold/5 group-last:border-none">
                      {row.item}
                    </td>
                    <td className="py-5 px-8 border-b border-premium-gold/5 group-last:border-none">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          row.quality.includes("Cream")
                            ? "bg-premium-gold/10 text-premium-gold"
                            : "bg-premium-charcoal/5 text-premium-charcoal/60"
                        }`}
                      >
                        {row.quality}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-premium-charcoal/60 border-b border-premium-gold/5 group-last:border-none">
                      {row.gender}
                    </td>
                    <td className="py-5 px-8 font-bold text-right border-b border-premium-gold/5 group-last:border-none">
                      {row.price}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Action Contact Bar in Table */}
          <div className="p-10 bg-premium-charcoal flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 text-white">
            <div className="text-center md:text-left">
              <p className="text-premium-gold font-bold text-lg mb-1">
                Ready to Order?
              </p>
              <div className="space-y-1">
                <p className="text-white/60 text-xs">
                  • Cream grade items are packed mix new with tags.
                </p>
                <p className="text-white/60 text-xs">
                  • All other items are new without tags.
                </p>
                <p className="text-white/60 text-xs">
                  • All items are clean and of the highest quality.
                </p>
              </div>
            </div>

            <QuickContact variant="dark" className="mt-0" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
