"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronDown, ChevronUp, Mic, Image } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { publications, type Publication } from "@/data";

const venueColors: Record<Publication["venueType"], string> = {
  workshop: "rgba(45, 212, 191, 0.15)",
  conference: "rgba(96, 165, 250, 0.15)",
  journal: "rgba(167, 139, 250, 0.15)",
  preprint: "rgba(251, 191, 36, 0.15)",
};
const venueTextColors: Record<Publication["venueType"], string> = {
  workshop: "#2dd4bf",
  conference: "#60a5fa",
  journal: "#a78bfa",
  preprint: "#fbbf24",
};

function PublicationCard({ pub, delay }: { pub: Publication; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" as const }}
      className="rounded-2xl p-6 card"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3 mb-3">
        {/* Venue badge */}
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0"
          style={{
            background: venueColors[pub.venueType],
            color: venueTextColors[pub.venueType],
          }}
        >
          {pub.venueShort}
        </span>

        {/* Type badge */}
        {pub.type !== "journal" && pub.type !== "preprint" && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(96,165,250,0.08)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            {pub.type === "oral" ? <Mic size={11} /> : <Image size={11} />}
            {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
          </span>
        )}

        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {pub.year}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-base leading-snug mb-3"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
      >
        {pub.title}
      </h3>

      {/* Abstract toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium mb-3 transition-opacity hover:opacity-70"
        style={{ color: "var(--accent)" }}
      >
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {expanded ? "Hide abstract" : "Show abstract"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm leading-relaxed mb-4 overflow-hidden"
            style={{ color: "var(--text-secondary)" }}
          >
            {pub.abstract}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Links */}
      {pub.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {pub.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-70"
              style={{
                background: "var(--card-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <ExternalLink size={11} /> {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const filters = ["All", "2026", "2025", "2023", "Workshop", "Conference", "Journal"];

export default function Publications() {
  const [active, setActive] = useState("All");

  const filtered = publications.filter((p) => {
    if (active === "All") return true;
    if (["2026", "2025", "2023"].includes(active)) return String(p.year) === active;
    if (active === "Workshop") return p.venueType === "workshop";
    if (active === "Conference") return p.venueType === "conference";
    if (active === "Journal") return p.venueType === "journal";
    return true;
  });

  return (
    <section id="publications" className="py-24 px-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Publications"
          title="Research Output"
          subtitle="Peer-reviewed papers at top computer vision and NLP venues, covering wildlife re-identification, knowledge graph verification, and cross-lingual NLU."
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: active === f ? "var(--accent)" : "var(--card)",
                color: active === f ? "#fff" : "var(--text-secondary)",
                border: `1px solid ${active === f ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((pub, i) => (
            <PublicationCard key={pub.id} pub={pub} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
