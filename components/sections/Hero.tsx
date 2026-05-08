"use client";

import { motion } from "framer-motion";
import { Mail, Download, ArrowRight, ChevronDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import NeuralCanvas from "@/components/NeuralCanvas";

const keywords = [
  "Animal Re-ID",
  "Foundation Models",
  "Conservation AI",
  "Multilingual NLP",
  "CV4Animals",
];

const socials = [
  { label: "GitHub", icon: GithubIcon, href: "https://github.com/AnkitKUpadhyay" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com/in/ankitkupadhyay" },
  { label: "Email", icon: Mail, href: "mailto:upadha2@rpi.edu" },
];

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Neural network background */}
      <NeuralCanvas />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Status badge */}
        <motion.div variants={item} className="mb-8 flex justify-center">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border"
            style={{
              background: "rgba(96, 165, 250, 0.08)",
              borderColor: "var(--border-accent)",
              color: "var(--accent)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--accent-3)" }}
            />
            PhD Candidate · Rensselaer Polytechnic Institute · GPA 4.0/4.0
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-7xl font-bold tracking-tight mb-4 leading-none"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span style={{ color: "var(--text)" }}>Ankit </span>
          <span className="gradient-text">Upadhyay</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={item}
          className="text-lg sm:text-xl font-medium mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Computer Science PhD · AI for Biodiversity &amp; Social Good
        </motion.p>

        {/* Research description */}
        <motion.p
          variants={item}
          className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Building foundation-model pipelines for{" "}
          <span style={{ color: "var(--accent-3)" }}>animal re-identification</span>,{" "}
          <span style={{ color: "var(--accent)" }}>label-efficient ecology</span>, and{" "}
          <span style={{ color: "var(--accent-2)" }}>low-resource NLP</span> — with an
          emphasis on cross-species generalization and field deployment.
        </motion.p>

        {/* Keyword pills */}
        <motion.div variants={item} className="flex flex-wrap justify-center gap-2 mb-10">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              {kw}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => document.getElementById("research")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
              color: "#fff",
              boxShadow: "0 4px 24px var(--glow)",
            }}
          >
            View Research <ArrowRight size={16} />
          </button>
          <a
            href="/cv.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border-accent)",
              color: "var(--text)",
            }}
          >
            <Download size={16} /> Download CV
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div variants={item} className="flex justify-center gap-4">
          {socials.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <Icon size={17} />
            </a>
          ))}
          <a
            href="https://huggingface.co/AnkitKUpadhyay"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HuggingFace"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 hover:scale-110"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            🤗
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{ color: "var(--text-muted)" }}
        aria-label="Scroll down"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
