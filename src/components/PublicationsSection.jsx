import React, { useEffect, useState } from "react";
import { ChevronDown, Link as LinkIcon, Plus } from "lucide-react";
import { publications } from "../data/publications";
import { Savanna } from "./Habitat";

function Paper({ paper }) {
  return (
    <details className="paper" id={`paper-${paper.id}`}>
      <summary>
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
        <span className="paper-plus">
          <Plus size={17} aria-hidden="true" />
        </span>
      </summary>
      <div className="paper-info">
        {paper.status !== "preparation" && paper.authors?.length > 0 && (
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
              <a href={link.href} key={link.href}>
                <LinkIcon size={13} aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

export default function PublicationsSection({ paused }) {
  const [collection, setCollection] = useState("published");
  const [area, setArea] = useState("all");
  const [target, setTarget] = useState(null);
  useEffect(() => {
    function followHash() {
      const paper = publications.find((p) => window.location.hash === `#paper-${p.id}`);
      if (!paper) return;
      setArea("all");
      setCollection(paper.status === "published" ? "published" : "manuscripts");
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
      row.open = true;
      row.scrollIntoView({ block: "center", behavior: "instant" });
    }
    setTarget(null);
  }, [target]);

  const papers = publications.filter((paper) => {
    const group = paper.status === "published" ? "published" : "manuscripts";
    return group === collection && (area === "all" || paper.area === area);
  });
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => Number(b) - Number(a));

  return (
    <section id="publications" aria-labelledby="papers-title" className="publications">
      <Savanna paused={paused} />
      <div className="wrap papers-inner">
        <div className="papers-tools">
          <div className="collection-switch" role="group" aria-label="Publication collection">
            {[
              ["published", "Published & accepted"],
              ["manuscripts", "Manuscripts"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={collection === id}
                onClick={() => {
                  setCollection(id);
                  setArea("all");
                }}
              >
                {label}
              </button>
            ))}
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
        {years.map((year) => (
          <section key={year} className="year-group" aria-label={`Work from ${year}`}>
            <h3>{year}</h3>
            <div>
              {papers
                .filter((paper) => paper.year === year)
                .map((paper) => (
                  <Paper key={paper.id} paper={paper} />
                ))}
            </div>
          </section>
        ))}
        {!years.length && (
          <p className="empty-results" role="status">
            No manuscripts in this research area.{" "}
            <button onClick={() => setArea("all")}>Show all areas</button>
          </p>
        )}
      </div>
    </section>
  );
}
