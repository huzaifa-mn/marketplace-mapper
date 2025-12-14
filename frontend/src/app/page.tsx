"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutTemplate,
  FileSpreadsheet,
  GitMerge,
  Store,
  Link2,
  ArrowRight,
  Shield,
  Zap,
  Database,
} from "lucide-react";
import { inter, dmSans } from "@/lib/fonts";
import { useState, useEffect } from "react";

import React from "react";
import Header from "@/components/common/Header";

/**
 * FloatingCard Component
 * Wraps content in a nice glass-morphism card with hover effects.
 * We use framer-motion here for that smooth entry animation.
 */
const FloatingCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    whileHover={{
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.2 },
    }}
    // The backdrop-blur-sm gives it that modern "glass" feel
    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    {children}
  </motion.div>
);

type StatKey = "templates" | "sellerFiles" | "mappings";

const AnimatedStats = () => {
  const [counts, setCounts] = useState<{
    templates: number;
    sellerFiles: number;
    mappings: number;
  }>({ templates: 0, sellerFiles: 0, mappings: 0 });

  useEffect(() => {
    const targets: Record<StatKey, number> = {
      templates: 35,
      sellerFiles: 120,
      mappings: 420,
    };
    const duration = 2000;
    const increment = 50;

    (Object.keys(targets) as StatKey[]).forEach((key) => {
      let current = 0;
      const target = targets[key];
      const step = target / (duration / increment);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, increment);
    });
  }, []);

  const items: { key: StatKey; label: string; icon: React.ElementType }[] = [
    { key: "templates", label: "Marketplace Templates", icon: LayoutTemplate },
    { key: "sellerFiles", label: "Seller Files Parsed", icon: FileSpreadsheet },
    { key: "mappings", label: "Mappings Created", icon: GitMerge },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-16">
      {items.map(({ key, label, icon: Icon }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
          className="text-center"
        >
          <Icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <motion.div
            className={`${dmSans.className} text-3xl font-bold text-slate-900`}
            key={counts[key]}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {counts[key].toLocaleString()}+
          </motion.div>
          <p className={`${inter.className} text-slate-600`}>{label}</p>
        </motion.div>
      ))}
    </div>
  );
};

const FeatureGrid = () => {
  const features = [
    {
      icon: LayoutTemplate,
      title: "Reusable Marketplace Templates",
      desc: "Upload and manage marketplace-specific attribute templates in one place.",
    },
    {
      icon: FileSpreadsheet,
      title: "Smart Seller File Parsing",
      desc: "Automatically detect headers and sample rows from CSV/Excel uploads.",
    },
    {
      icon: Link2,
      title: "Visual Column Mapping",
      desc: "Map seller columns to marketplace attributes with a clean 2-column UI.",
    },
    {
      icon: Shield,
      title: "Consistent, Valid Data",
      desc: "Enforce 1-to-1 mappings and avoid broken product feeds before upload.",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-16">
      {features.map((feature, index) => (
        <FloatingCard key={feature.title} delay={0.8 + index * 0.1}>
          <div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3
                className={`${dmSans.className} font-semibold text-slate-900 mb-2 line-clamp-2`}
              >
                {feature.title}
              </h3>
            </div>
            <p className={`${inter.className} text-slate-600 line-clamp-3`}>
              {feature.desc}
            </p>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
};

const MappingPreview = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1, duration: 0.8 }}
    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto mt-16 border border-slate-100"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <GitMerge className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className={`${dmSans.className} font-semibold text-slate-900`}>
            Myntra Product Mapping
          </h3>
          <p className={`${inter.className} text-sm text-slate-500`}>
            seller_products_jan.csv
          </p>
        </div>
      </div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 ml-6 bg-gray-100 rounded-lg"
      >
        <Zap className="w-5 h-5 text-indigo-600" />
      </motion.div>
    </div>

    <div className="space-y-3 text-sm">
      <div className="flex items-center space-x-3 text-slate-600">
        <Store className="w-4 h-4" />
        <span className={`${inter.className}`}>
          Marketplace: <span className="font-medium">Myntra</span>
        </span>
      </div>
      <div className="flex items-center space-x-3 text-slate-600">
        <Database className="w-4 h-4" />
        <span className={`${inter.className}`}>
          Seller file:{" "}
          <span className="font-medium">seller_products_jan.csv</span>
        </span>
      </div>
    </div>

    <div className="mt-6 border rounded-xl overflow-hidden">
      <div className="grid grid-cols-[1.4fr_0.4fr_1.4fr] bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
        <span>Marketplace Attribute</span>
        <span className="flex items-center justify-center">
          <Link2 className="w-3 h-3 mr-1" /> Map
        </span>
        <span>Seller Column</span>
      </div>
      <div className="divide-y">
        {[
          { left: "productName", right: "Name" },
          { left: "brand", right: "BrandName" },
          { left: "price", right: "Price" },
          { left: "images", right: "Image1" },
        ].map((row) => (
          <div
            key={row.left}
            className="grid grid-cols-[1.4fr_0.4fr_1.4fr] px-3 py-2 text-xs md:text-sm"
          >
            <span className="font-mono text-slate-800">{row.left}</span>
            <span className="flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-indigo-500" />
            </span>
            <span className="font-mono text-slate-700">{row.right}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const PulsatingDots = () => {
  type Dot = {
    left: number;
    top: number;
    duration: number;
    delay: number;
  };

  // Generate random positions ONCE, as initial state
  const [dots] = useState<Dot[]>(() =>
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-indigo-200 rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
          }}
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <PulsatingDots />

      <Header />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="p-6 bg-indigo-100 rounded-full">
              <LayoutTemplate className="w-16 h-16 text-indigo-600" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`${dmSans.className} text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900`}
          >
            Marketplace Listings
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
              }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="block text-indigo-600"
            >
              Mapped Once, Used Everywhere
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className={`${inter.className} text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto`}
          >
            Upload marketplace templates, parse seller product files, and map
            columns visually. Save clean, reusable mappings that power product
            uploads across Amazon, Flipkart, Myntra and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/mappings/new"
              className="group relative overflow-hidden"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${inter.className} px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <span>Start Mapping</span>
                <motion.div
                  className="overflow-hidden"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>

            <Link href="/marketplaces">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${inter.className} px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                Manage Templates
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <AnimatedStats />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2
              className={`${dmSans.className} text-3xl font-bold text-slate-900 mb-4`}
            >
              Built for Marketplace Operators & Sellers
            </h2>
            <p className={`${inter.className} text-slate-600 text-lg`}>
              Standardize product data, fix messy CSVs, and ship listings faster
              with a single mapping workflow.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 items-center">
            <FeatureGrid />
            <MappingPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
