"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import SectionHeader from "@/components/SectionHeader";
import { projects, type Project } from "@/data";

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" as const }}
      className="group rounded-2xl overflow-hidden card flex flex-col"
    >
      {/* Gradient header */}
      <div
        className={`h-28 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0%, transparent 60%)",
          }}
        />
        <div className="text-center z-10 px-4">
          <p
            className="text-white font-bold text-lg leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            {project.title}
          </p>
        </div>
        {/* Area badge */}
        <span
          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(0,0,0,0.35)", color: "rgba(255,255,255,0.9)" }}
        >
          {project.area}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>
          {project.subtitle}
        </p>
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "var(--text-secondary)" }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 5).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                background: "rgba(96,165,250,0.07)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="flex gap-2">
            {project.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-70"
                style={{
                  background: "var(--card-hover)",
                  border: "1px solid var(--border-accent)",
                  color: "var(--accent)",
                }}
              >
                {l.label === "Code" ? <GithubIcon size={11} /> : <ExternalLink size={11} />}
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const areas = ["All", "Animal Re-ID", "Foundation Models", "Generative AI", "Distributed ML", "NLP"];

export default function Projects() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.area === active);

  return (
    <section id="projects" className="py-24 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Projects"
          title="Built & Shipped"
          subtitle="From hackathon prototypes to research systems deployed on real ecological data."
        />

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => setActive(a)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: active === a ? "var(--accent-2)" : "var(--card)",
                color: active === a ? "#fff" : "var(--text-secondary)",
                border: `1px solid ${active === a ? "var(--accent-2)" : "var(--border)"}`,
              }}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}
