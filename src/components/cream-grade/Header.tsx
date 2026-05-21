"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  Menu,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { CONTACT } from "@/lib/constants";

interface DropdownItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  children?: DropdownItem[];
}

function NavDropdown({
  item,
  isActive,
  onToggle,
}: {
  item: NavItem;
  isActive: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (isActive) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="text-xs font-bold uppercase tracking-widest text-premium-charcoal/80 hover:text-premium-gold transition-colors flex items-center gap-1"
      >
        {item.name}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
        />
      </button>
      {isActive && item.children && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-premium-gold/10 py-3 overflow-hidden z-50"
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onToggle}
              className="block px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-premium-charcoal/70 hover:text-premium-gold hover:bg-premium-cream/50 transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    {
      name: "Products",
      children: [
        { name: "Specialisations", href: "/specialisations" },
        { name: "Wholesale", href: "/wholesale" },
        { name: "Live Offers", href: "/live-offers" },
      ],
    },
    {
      name: "Services",
      children: [
        { name: "Our Services", href: "/services" },
        { name: "We Buy", href: "/we-buy" },
        { name: "Exports", href: "/exports" },
        { name: "Shipping", href: "/shipping" },
      ],
    },
    { name: "About", href: "/about-us" },
  ];

  // Flat list for mobile menu
  const mobileLinks = [
    { name: "Home", href: "/" },
    { name: "Specialisations", href: "/specialisations" },
    { name: "Wholesale", href: "/wholesale" },
    { name: "Live Offers", href: "/live-offers" },
    { name: "Our Services", href: "/services" },
    { name: "We Buy", href: "/we-buy" },
    { name: "Exports", href: "/exports" },
    { name: "Shipping", href: "/shipping" },
    { name: "About", href: "/about-us" },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-premium-cream/80 backdrop-blur-md border-b border-premium-gold/10 px-4">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex flex-col relative z-[60]">
          <span className="text-2xl font-display font-bold tracking-tight text-premium-charcoal">
            JUST STOCK TRADING
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-premium-gold font-medium -mt-1">
            Strategic Sourcing & Export
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown
                key={item.name}
                item={item}
                isActive={activeDropdown === item.name}
                onToggle={() =>
                  setActiveDropdown(
                    activeDropdown === item.name ? null : item.name,
                  )
                }
              />
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className="text-xs font-bold uppercase tracking-widest text-premium-charcoal/80 hover:text-premium-gold transition-colors"
              >
                {item.name}
              </Link>
            ),
          )}
          <Link
            href="/contact-us"
            className="px-6 py-2 bg-premium-charcoal text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-premium-gold hover:text-premium-charcoal transition-all duration-300 shadow-lg shadow-premium-gold/10"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center space-x-4">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-premium-charcoal hover:text-premium-gold"
          >
            <MessageCircle size={24} />
          </a>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="text-premium-charcoal focus:outline-none"
                aria-label="Toggle Menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full p-4 md:p-6 sm:max-w-md">
              <div className="flex flex-col h-full overflow-y-auto pr-2 pb-2">
                {/* Logo in Overlay */}
                <div className="mb-8 mt-4 flex-shrink-0">
                  <span className="text-xl font-display font-bold tracking-tight text-premium-charcoal leading-none">
                    JUST STOCK TRADING
                  </span>
                  <div className="text-[8px] uppercase tracking-widest text-premium-gold font-bold mt-1">
                    Strategic Sourcing & Export
                  </div>
                </div>

                <nav className="flex flex-col space-y-4 flex-grow">
                  {mobileLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <SheetClose asChild>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-xl md:text-2xl font-display font-bold text-premium-charcoal active:text-premium-gold transition-colors flex items-center justify-between group py-1"
                        >
                          {link.name}
                          <ArrowRight
                            className="opacity-0 group-active:opacity-100 transition-opacity text-premium-gold"
                            size={18}
                          />
                        </Link>
                      </SheetClose>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4"
                  >
                    <SheetClose asChild>
                      <Link
                        href="/contact-us"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-4 bg-premium-charcoal text-white font-bold rounded-xl shadow-xl shadow-premium-gold/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Get a Free Quote
                      </Link>
                    </SheetClose>
                  </motion.div>
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 pb-2 border-t border-premium-gold/10 pt-6 flex-shrink-0"
                >
                  <div className="text-[10px] uppercase tracking-[0.3em] text-premium-charcoal/40 font-bold mb-4 text-center">
                    Contact our Experts
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <a
                      href={`tel:${CONTACT.phoneRaw}`}
                      className="bg-white p-3 rounded-xl flex flex-col items-center gap-2 border border-premium-gold/5 shadow-sm"
                    >
                      <Phone size={18} className="text-premium-gold" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-premium-charcoal/60">
                        Call
                      </span>
                    </a>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="bg-white p-3 rounded-xl flex flex-col items-center gap-2 border border-premium-gold/5 shadow-sm"
                    >
                      <Mail size={18} className="text-premium-gold" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-premium-charcoal/60">
                        Email
                      </span>
                    </a>
                    <a
                      href={CONTACT.whatsapp}
                      className="bg-white p-3 rounded-xl flex flex-col items-center gap-2 border border-premium-gold/5 shadow-sm"
                    >
                      <MessageCircle size={18} className="text-premium-gold" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-premium-charcoal/60 text-center">
                        WhatsApp
                      </span>
                    </a>
                  </div>
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
