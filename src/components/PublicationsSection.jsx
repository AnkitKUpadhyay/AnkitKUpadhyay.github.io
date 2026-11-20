import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Plus } from "lucide-react";
import { publications } from "../data/publications";
import { Savanna } from "./Habitat";

const EASE = [0.22, 1, 0.36, 1];

function Paper({ paper, isOpen, onToggle }) {
  return (
    <article className={`paper ${isOpen ? "is-open" : ""}`} id={`paper-${paper.id}`}>
      <button
        type="button"
        className="paper-trigger"
        aria-expanded={isOpen}
        aria-controls={`paper-body-${paper.id}`}
        onClick={onToggle}
      >
        <span className="paper-heading">
          <span className="paper-meta">
            {paper.venue && (
              <>
                {paper.venue}
                <span className="meta-dot">·</span>
              </>
            )}
            {paper.badge}
          </span>
          <span className="paper-title">{paper.title}</span>
        </span>
        <span className="paper-plus" aria-hidden="true">
          <Plus size={17} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`paper-body-${paper.id}`}
            className="paper-collapse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            <div className="paper-info">
              {paper.authors?.length > 0 && (
                <p className="paper-authors">
                  {paper.authors.map((name, i) => (
                    <React.Fragment key={name}>
                      {i > 0 && ", "}
                      {name.startsWith("Ankit") ? <strong>{name}</strong> : name}
                    </React.Fragment>
                  ))}
                </p>
              )}
              {paper.takeaway && <p>{paper.takeaway}</p>}
              {paper.links.length > 0 && (
                <div className="paper-links">
                  {paper.links.map((link) => (
                    <a
                      href={link.href}
                      key={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function PublicationsSection({ paused }) {
  const [collection, setCollection] = useState("published");
  const [area, setArea] = useState("all");
  const [openIds, setOpenIds] = useState({});
  const [target, setTarget] = useState(null);

  useEffect(() => {
    function followHash() {
      const paper = publications.find((p) => window.location.hash === `#paper-${p.id}`);
      if (!paper) return;
      setArea("all");
      setCollection(paper.status === "published" ? "published" : "manuscripts");
      setOpenIds((prev) => ({ ...prev, [paper.id]: true }));
      setTarget(paper.id);
    }
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, []);

  useEffect(() => {
    if (!target) return;
    const row = document.getElementById(`paper-${target}`);
    if (row) {
      row.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    setTarget(null);
  }, [target]);

  const papers = publications.filter((paper) => {
    const group = paper.status === "published" ? "published" : "manuscripts";
    return group === collection && (area === "all" || paper.area === area);
  });
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => Number(b) - Number(a));

  function togglePaper(id) {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="publications" aria-labelledby="papers-title" className="publications">
      <Savanna paused={paused} />
      <motion.div
        className="wrap papers-inner"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: EASE }}
      >
        <div className="papers-tools">
          <div className="collection-switch" role="group" aria-label="Publication collection">
            {[
              ["published", "Published & accepted"],
              ["manuscripts", "Manuscripts"],
            ].map(([id, label]) => {
              const active = collection === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setCollection(id);
                    setArea("all");
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="collection-pill"
                      className="collection-pill-bg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="collection-pill-label">{label}</span>
                </button>
              );
            })}
          </div>

          <label className="area-select">
            <span className="sr-only">Filter by research area</span>
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="all">All research areas</option>
              <option value="Wildlife Vision">Wildlife vision</option>
              <option value="NLP & Knowledge">NLP &amp; knowledge</option>
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </label>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${collection}-${area}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {years.map((year) => (
              <section key={year} className="year-group" aria-label={`Work from ${year}`}>
                <h3>{year}</h3>
                <div>
                  {papers
                    .filter((paper) => paper.year === year)
                    .map((paper) => (
                      <Paper
                        key={paper.id}
                        paper={paper}
                        isOpen={!!openIds[paper.id]}
                        onToggle={() => togglePaper(paper.id)}
                      />
                    ))}
                </div>
              </section>
            ))}

            {!years.length && (
              <p className="empty-results" role="status">
                No manuscripts in this research area.{" "}
                <button type="button" onClick={() => setArea("all")}>
                  Show all areas
                </button>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
