"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { researchAreas } from "@/data";

export default function Research() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="research" ref={ref} className="py-24 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Research"
          title="What I Work On"
          subtitle="My research develops scalable AI pipelines for ecological monitoring and NLP for underrepresented communities — built for real-world deployment, not just benchmark performance."
        />

        <div className="grid sm:grid-cols-2 gap-5">
          {researchAreas.map((area, i) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" as const }}
              className="group rounded-2xl p-6 card cursor-default"
            >
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${area.gradient.replace("from-", "").replace("to-", "")})` }}
                >
                  {area.icon}
                </div>
                <div>
                  <h3
                    className="font-bold text-lg leading-tight mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
                  >
                    {area.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                {area.description}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5">
                {area.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(96, 165, 250, 0.08)",
                      color: "var(--accent)",
                      border: "1px solid rgba(96, 165, 250, 0.15)",
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
