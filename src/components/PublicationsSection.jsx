import React, { useEffect, useState } from "react";
import { ChevronDown, Link as LinkIcon, Plus } from "lucide-react";
import { publications } from "../data/publications";
import SavannaScene from "./SavannaScene";
import "../publications.css";

function Paper({ paper, expanded, onToggle }) {
  return (
    <details
      className="pub-entry"
      id={`paper-${paper.id}`}
      open={expanded}
      onToggle={(event) => onToggle(event.currentTarget.open)}
    >
      <summary className="pub-entry-trigger" aria-controls={`paper-body-${paper.id}`}>
        <span>
          <span className="pub-citation">
            {[paper.venue, paper.badge].filter(Boolean).join(" · ")}
          </span>
          <span className="pub-title">{paper.title}</span>
        </span>
        <span className="pub-open-icon" aria-hidden="true">
          <Plus size={17} strokeWidth={1.4} />
        </span>
      </summary>
      <div className="pub-detail" id={`paper-body-${paper.id}`}>
        {paper.status !== "preparation" && paper.authors?.length > 0 && (
          <p className="pub-authors">
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
          <div className="pub-resource-links">
            {paper.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <LinkIcon size={14} aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

export default function PublicationsSection({ paused = false }) {
  const [collection, setCollection] = useState("published");
  const [area, setArea] = useState("all");
  const [openIds, setOpenIds] = useState({});
  const [target, setTarget] = useState(null);

  useEffect(() => {
    function followHash() {
      const paper = publications.find((p) => location.hash === `#paper-${p.id}`);
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
    document
      .getElementById(`paper-${target}`)
      ?.scrollIntoView({ behavior: "instant", block: "start" });
    setTarget(null);
  }, [target]);

  const papers = publications.filter((p) => {
    const group = p.status === "published" ? "published" : "manuscripts";
    return group === collection && (area === "all" || p.area === area);
  });
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => Number(b) - Number(a));

  return (
    <section id="publications" className="publication-page" aria-labelledby="papers-title">
      <SavannaScene paused={paused} />
      <div className="pub-content wrap">
        <header className="pub-heading">
          <h1 id="papers-title">
            Publications<span aria-hidden="true">.</span>
          </h1>
        </header>
        <div className="pub-index">
          <div className="pub-tools">
            <div className="pub-collections" role="group" aria-label="Publication collection">
              {[
                ["published", "Published & accepted"],
                ["manuscripts", "Manuscripts"],
              ].map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  aria-pressed={id === collection}
                  onClick={() => {
                    setCollection(id);
                    setArea("all");
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="pub-area">
              <span className="sr-only">Filter by research area</span>
              <select value={area} onChange={(e) => setArea(e.target.value)}>
                <option value="all">All research areas</option>
                <option value="Wildlife Vision">Wildlife vision</option>
                <option value="NLP & Knowledge">NLP &amp; knowledge</option>
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
          </div>
          {years.map((year) => (
            <section className="pub-year-group" key={year} aria-labelledby={`pub-year-${year}`}>
              <h2 id={`pub-year-${year}`}>{year}</h2>
              <div className="pub-entries">
                {papers
                  .filter((p) => p.year === year)
                  .map((p) => (
                    <Paper
                      key={p.id}
                      paper={p}
                      expanded={!!openIds[p.id]}
                      onToggle={(open) =>
                        setOpenIds((prev) =>
                          Boolean(prev[p.id]) === open ? prev : { ...prev, [p.id]: open },
                        )
                      }
                    />
                  ))}
              </div>
            </section>
          ))}
          {!years.length && (
            <p className="pub-empty" role="status">
              No manuscripts in this research area.{" "}
              <button onClick={() => setArea("all")}>Show all areas</button>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
