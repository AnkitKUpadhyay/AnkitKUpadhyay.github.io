"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { experience, awards } from "@/data";
import { MapPin, Calendar, BookOpen, GraduationCap, Beaker } from "lucide-react";

const typeIcon = {
  research: Beaker,
  teaching: BookOpen,
  industry: GraduationCap,
};

const typeColor = {
  research: "var(--accent)",
  teaching: "var(--accent-3)",
  industry: "var(--accent-2)",
};

function TimelineEntry({ exp, delay }: { exp: typeof experience[0]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = typeIcon[exp.type];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" as const }}
      className="relative flex gap-6"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center z-10"
          style={{ background: "var(--card)", border: "2px solid var(--border-accent)" }}
        >
          <Icon size={16} style={{ color: typeColor[exp.type] }} />
        </div>
        <div className="flex-1 w-px mt-2" style={{ background: "var(--border)" }} />
      </div>

      {/* Card */}
      <div className="rounded-2xl p-6 mb-6 card flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3
              className="font-bold text-base leading-snug"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
            >
              {exp.role}
            </h3>
            <p className="text-sm font-medium mt-0.5" style={{ color: typeColor[exp.type] }}>
              {exp.orgFull}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <Calendar size={11} />
              {exp.start} – {exp.end}
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <MapPin size={11} />
              {exp.location}
            </div>
          </div>
        </div>

        <ul className="space-y-2">
          {exp.bullets.map((b, i) => (
            <li key={i} className="text-sm leading-relaxed flex gap-2" style={{ color: "var(--text-secondary)" }}>
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);

  return (
    <section id="experience" ref={ref} className="py-24 px-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Experience"
          title="Academic Journey"
          subtitle="Research, teaching, and service spanning two continents and multiple domains."
        />

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
              Research & Teaching
            </p>
            <div>
              {experience.map((exp, i) => (
                <TimelineEntry key={exp.id} exp={exp} delay={i * 0.15} />
              ))}
            </div>

            {/* Education */}
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--accent-3)" }}>
                Education
              </p>
              <div className="space-y-4">
                {[
                  {
                    degree: "PhD in Computer Science",
                    note: "MS Awarded Dec 2024 · GPA 4.0/4.0",
                    school: "Rensselaer Polytechnic Institute",
                    dates: "Aug 2023 – May 2028 (Expected)",
                    location: "Troy, NY",
                  },
                  {
                    degree: "B.E. in Computer Science & Engineering",
                    note: "GPA 9.39/10",
                    school: "Visvesvaraya Technological University",
                    dates: "Aug 2019 – Jun 2023",
                    location: "Bengaluru, India",
                  },
                ].map((edu) => (
                  <div key={edu.school} className="rounded-2xl p-5 card">
                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}>
                      {edu.degree}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>{edu.note}</p>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{edu.school}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Calendar size={10} /> {edu.dates}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                        <MapPin size={10} /> {edu.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Awards */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "var(--accent-2)" }}>
              Honors & Awards
            </p>
            <div className="space-y-3">
              {awards.map((a, i) => (
                <motion.div
                  key={`${a.year}-${a.title}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl p-4 card"
                >
                  <span
                    className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg text-center"
                    style={{ background: "rgba(167,139,250,0.1)", color: "var(--accent-2)" }}
                  >
                    {a.year}
                  </span>
                  <div>
                    <p className="text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>{a.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
