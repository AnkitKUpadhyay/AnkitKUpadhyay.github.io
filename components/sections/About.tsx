"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { awards } from "@/data";
import { Trophy } from "lucide-react";

const stats = [
  { value: "5", label: "Publications" },
  { value: "4.0", label: "GPA" },
  { value: "3", label: "Species Studied" },
  { value: "14", label: "Evaluation Datasets" },
];

const skills = [
  "Python", "PyTorch", "TensorFlow", "HuggingFace", "OpenCV",
  "CUDA", "DDP", "Computer Vision", "NLP", "Diffusion Models",
  "Knowledge Graphs", "C++", "SQL", "Bash", "Linux/HPC",
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const vis = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  });

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 px-6"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="About Me"
          title="Researcher, Engineer, Educator"
          subtitle="I build AI systems that serve biodiversity conservation and social good — bridging rigorous computer vision research with real ecological impact."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <motion.div
            {...vis(0.1)}
            className="space-y-5"
          >
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              I am a PhD candidate in Computer Science at{" "}
              <span style={{ color: "var(--text)", fontWeight: 500 }}>
                Rensselaer Polytechnic Institute
              </span>{" "}
              (MS awarded Dec 2024, GPA 4.0/4.0), advised on AI for conservation. My work sits at
              the intersection of computer vision, foundation models, and ecology — building systems
              that scale wildlife monitoring without demanding large labeled datasets.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              My flagship project{" "}
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>MAVRIC</span> achieves
              near-perfect precision on drone-based animal re-identification across three species. My
              broader goal is to make robust re-identification and behavioral understanding accessible
              to field ecologists worldwide — even in low-resource settings.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Beyond vision, I am deeply invested in{" "}
              <span style={{ color: "var(--accent-2)", fontWeight: 500 }}>multilingual NLP</span> —
              building cross-lingual transfer systems that extend state-of-the-art capabilities to
              underrepresented linguistic communities, from Swahili to Indian low-resource languages.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              I also serve as a Teaching Assistant for the{" "}
              <em>AI for Conservation</em> course at RPI, mentoring 40+ undergraduate and graduate
              students on applying machine learning to real-world ecological challenges.
            </p>

            {/* Skills */}
            <div className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
                Technical Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      background: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats + Awards */}
          <div className="space-y-8">
            {/* Stats grid */}
            <motion.div
              {...vis(0.2)}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl p-5 text-center card"
                >
                  <p
                    className="text-3xl font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Selected awards */}
            <motion.div
              {...vis(0.3)}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                <Trophy size={13} /> Selected Honors
              </p>
              <div className="space-y-3">
                {awards.slice(0, 6).map((a) => (
                  <div
                    key={a.title}
                    className="flex items-start gap-3 rounded-lg p-3 card"
                  >
                    <span className="text-xs font-bold mt-0.5 shrink-0 w-10 text-center rounded px-1 py-0.5"
                      style={{ background: "rgba(96,165,250,0.1)", color: "var(--accent)" }}>
                      {a.year}
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>{a.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
