"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="mb-14"
    >
      <span
        className="text-xs font-semibold uppercase tracking-widest mb-3 block"
        style={{ color: "var(--accent)" }}
      >
        {label}
      </span>
      <h2
        className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--text)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-base max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {subtitle}
        </p>
      )}
      <div
        className="mt-6 h-px w-16"
        style={{
          background: "linear-gradient(to right, var(--accent), var(--accent-2))",
        }}
      />
    </motion.div>
  );
}
