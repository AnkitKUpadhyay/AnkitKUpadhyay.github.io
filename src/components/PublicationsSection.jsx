import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { publicationFilters, publications } from "../data/publications";

function formatAuthors(authors) {
  return authors.map((name, idx) => {
    const isMe = name.startsWith("Ankit");
    return (
      <React.Fragment key={name}>
        {idx > 0 && ", "}
        {isMe ? <strong className="author-self">{name}</strong> : name}
      </React.Fragment>
    );
  });
}

export default function PublicationsSection({ filter, setFilter, highlightId }) {
  const [openAbstracts, setOpenAbstracts] = useState({});

  const filtered = useMemo(() => {
    if (filter === "all") return publications;
    if (filter === "preprints") return publications.filter((p) => p.status === "preprint");
    return publications.filter((p) => p.area === filter);
  }, [filter]);

  function toggleAbstract(id) {
    setOpenAbstracts((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className="section publications-section" id="publications">
      <div className="section-head">
        <div>
          <p className="eyebrow">Publications</p>
          <h2>Selected papers &amp; preprints</h2>
        </div>

        <div className="filter-bar" role="tablist" aria-label="Filter publications">
          {publicationFilters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`filter-pill ${active ? "is-active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {active && (
                  <motion.span
                    layoutId="pub-filter-bg"
                    className="filter-pill-bg"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pub-list">
        <AnimatePresence mode="popLayout">
          {filtered.map((paper) => {
            const isOpen = !!openAbstracts[paper.id];
            const isHighlighted = highlightId === paper.id;
            const isOralOrAccepted =
              paper.badge === "Oral" || paper.badge === "Accepted";

            return (
              <motion.article
                key={paper.id}
                id={`paper-${paper.id}`}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className={`pub-row ${isHighlighted ? "is-highlighted" : ""}`}
              >
                <div className="pub-left">
                  <span className="pub-year">{paper.year}</span>
                  <span className="pub-venue">{paper.venue}</span>
                  <span
                    className={`pub-badge ${
                      isOralOrAccepted
                        ? "is-accent"
                        : paper.status === "preprint"
                        ? "is-muted"
                        : ""
                    }`}
                  >
                    {paper.badge}
                  </span>
                </div>

                <div className="pub-body">
                  <h3>{paper.title}</h3>
                  <p className="pub-authors">{formatAuthors(paper.authors)}</p>
                  <p className="pub-takeaway">{paper.takeaway}</p>

                  <div className="pub-actions">
                    {paper.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="pub-link"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    ))}
                    <button
                      type="button"
                      className={`pub-abstract-btn ${isOpen ? "is-open" : ""}`}
                      onClick={() => toggleAbstract(paper.id)}
                      aria-expanded={isOpen}
                    >
                      <span>Abstract</span>
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="pub-abstract"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p>{paper.abstract}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
