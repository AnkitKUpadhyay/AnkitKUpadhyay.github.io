import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { experience, honors, profile, projects, service } from "../data/site";

const TABS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "recognition", label: "Honors & Service" },
];

export default function BackgroundSection() {
  const [tab, setTab] = useState("experience");

  return (
    <section className="section background-section" id="background">
      <div className="section-head">
        <div>
          <p className="eyebrow">Background</p>
          <h2>Trajectory, builds &amp; community</h2>
        </div>

        <div className="filter-bar" role="tablist" aria-label="Background categories">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`filter-pill ${active ? "is-active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {active && (
                  <motion.span
                    layoutId="bg-tab-pill"
                    className="filter-pill-bg"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "experience" && (
          <motion.div
            key="experience"
            className="bg-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div className="exp-list">
              {experience.map((item) => (
                <article className="exp-row" key={item.role}>
                  <div className="exp-period">{item.period}</div>
                  <div className="exp-content">
                    <h3>{item.role}</h3>
                    <p className="exp-org">{item.org}</p>
                    <p className="exp-detail">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="funding-note">{profile.support}</p>
          </motion.div>
        )}

        {tab === "projects" && (
          <motion.div
            key="projects"
            className="bg-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div className="proj-grid">
              {projects.map((proj) => (
                <article className="proj-card" key={proj.title}>
                  <div className="proj-meta">
                    <span>{proj.context}</span>
                    <span>{proj.year}</span>
                  </div>
                  <h3>{proj.title}</h3>
                  <p>{proj.summary}</p>
                  <div className="proj-footer">
                    <div className="proj-tags">
                      {proj.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="proj-links">
                      {proj.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight size={14} />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "recognition" && (
          <motion.div
            key="recognition"
            className="bg-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <div className="honors-columns">
              <div className="editorial-list">
                <h3>Selected Honors</h3>
                <ul>
                  {honors.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="editorial-list">
                <h3>Service &amp; Leadership</h3>
                <ul>
                  {service.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
