// components/common/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutTemplate, Menu, X } from "lucide-react";
import { inter, dmSans } from "@/lib/fonts";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/marketplaces", label: "Marketplaces" },
    { href: "/seller-files", label: "Seller Files" },
    { href: "/mappings", label: "Mappings" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-1 group">
            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors"
            >
              <LayoutTemplate className="w-6 h-6 text-indigo-600" />
            </motion.div> */}

            {/* <div className="relative inline-flex items-center justify-center h-12 w-12">

              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full text-slate-900"
              >
                <path
                  fill="currentColor"
                  d="M43.5,-70.3C55.2,-63.9,63.8,-55,70.4,-44.1C77,-33.2,81.7,-20.3,82.4,-7.1C83.1,6.2,79.9,19.6,73.8,32.1C67.7,44.6,58.8,56.1,47.2,64.2C35.7,72.4,21.6,77.2,6.4,78.9C-8.8,80.5,-17.6,72.2,-29.3,65.9C-41,59.6,-55.6,55.4,-64.5,46.4C-73.4,37.3,-76.5,23.4,-79.2,8.6C-81.9,-6.1,-84.2,-21.7,-79.1,-35.2C-74.1,-48.6,-61.8,-60,-47.7,-67.2C-33.7,-74.3,-16.8,-77.3,-1,-75.7C14.9,-74.1,29.8,-67.8,43.5,-70.3Z"
                  transform="translate(100 100)"
                />
              </svg>


              <span
                className={`${dmSans.className} relative text-xs font-bold leading-none text-white`}
              >
                MM
              </span>
            </div> */}

            <div className="relative inline-flex items-center justify-center h-12 w-12">
              {/* Animated blob layer */}
              <div className="absolute inset-0 animate-blob">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full text-indigo-700"
                >
                  <path
                    fill="currentColor"
                    d="M43.5,-70.3C55.2,-63.9,63.8,-55,70.4,-44.1C77,-33.2,81.7,-20.3,82.4,-7.1C83.1,6.2,79.9,19.6,73.8,32.1C67.7,44.6,58.8,56.1,47.2,64.2C35.7,72.4,21.6,77.2,6.4,78.9C-8.8,80.5,-17.6,72.2,-29.3,65.9C-41,59.6,-55.6,55.4,-64.5,46.4C-73.4,37.3,-76.5,23.4,-79.2,8.6C-81.9,-6.1,-84.2,-21.7,-79.1,-35.2C-74.1,-48.6,-61.8,-60,-47.7,-67.2C-33.7,-74.3,-16.8,-77.3,-1,-75.7C14.9,-74.1,29.8,-67.8,43.5,-70.3Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>

              {/* Static MM text */}
              <span
                className={`${dmSans.className} relative text-xs font-bold leading-none text-white`}
              >
                MM
              </span>
            </div>


            {/* <MMLogo /> */}

            <span
              className={`${dmSans.className} text-xl font-bold text-slate-900`}
            >
              Market&nbsp;Mapper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`relative px-3 py-2 rounded-md font-medium transition-all duration-200 ${isActive(item.href)
                    ? "text-indigo-600"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                  // whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-50 rounded-xl border border-indigo-100"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className={`${inter.className} relative z-10 text-sm`}>{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <nav className="py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  className={`${dmSans.className
                    } block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive(item.href)
                      ? "text-indigo-600 bg-indigo-50 border border-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <span className={inter.className}>{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}

const MMLogo = () => (
  <svg
    viewBox="0 0 100 60"
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-16 text-white"
  >
    {/* Background (optional, for dark mode cards etc.) */}
    {/* <rect width="100" height="60" fill="black" /> */}

    {/* Left angled stroke */}
    <path
      d="M5 55 L5 10 L25 40 L45 10 L45 55"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />

    {/* Right angled stroke */}
    <path
      d="M55 55 L55 10 L75 40 L95 10 L95 55"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);
