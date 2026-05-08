"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ExternalLink, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import SectionHeader from "@/components/SectionHeader";

const links = [
  {
    label: "Email",
    value: "upadha2@rpi.edu",
    href: "mailto:upadha2@rpi.edu",
    icon: Mail,
    color: "var(--accent)",
  },
  {
    label: "GitHub",
    value: "AnkitKUpadhyay",
    href: "https://github.com/AnkitKUpadhyay",
    icon: GithubIcon,
    color: "var(--text-secondary)",
  },
  {
    label: "LinkedIn",
    value: "ankitkupadhyay",
    href: "https://linkedin.com/in/ankitkupadhyay",
    icon: LinkedinIcon,
    color: "#0ea5e9",
  },
  {
    label: "HuggingFace",
    value: "AnkitKUpadhyay",
    href: "https://huggingface.co/AnkitKUpadhyay",
    icon: ({ size }: { size: number }) => <span style={{ fontSize: size }}>🤗</span>,
    color: "var(--accent-3)",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="contact" ref={ref} className="py-24 px-6" style={{ background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Contact"
          title="Get In Touch"
          subtitle="Open to research collaborations, faculty/industry opportunities, and conversations about AI for conservation."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: message */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <div
              className="rounded-2xl p-8 card mb-6"
              style={{ border: "1px solid var(--border-accent)" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(96,165,250,0.1)" }}
              >
                <Mail size={24} style={{ color: "var(--accent)" }} />
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text)" }}
              >
                Let's Connect
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                Whether you're a fellow researcher, a potential collaborator, or someone curious about
                AI for biodiversity — I'd love to hear from you. The best way to reach me is via email.
              </p>
              <a
                href="mailto:upadha2@rpi.edu"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  color: "#fff",
                }}
              >
                <Mail size={15} /> Send me an email
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <MapPin size={14} />
              Department of Computer Science, RPI · Troy, NY 12180
            </div>
          </motion.div>

          {/* Right: links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" as const }}
            className="space-y-3"
          >
            {links.map(({ label, value, href, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl p-4 card group transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {value}
                  </p>
                </div>
                <ExternalLink
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  style={{ color: "var(--text-muted)" }}
                />
              </a>
            ))}

            {/* Google Scholar */}
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl p-4 card group transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: "var(--bg-secondary)", color: "#4285f4" }}
              >
                GS
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Google Scholar</p>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Ankit Upadhyay</p>
              </div>
              <ExternalLink
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: "var(--text-muted)" }}
              />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
