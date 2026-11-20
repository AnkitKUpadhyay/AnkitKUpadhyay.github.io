import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Download, Mail, Menu, Pause, Play, X } from "lucide-react";
import { profile } from "./data/site";
import { Hero } from "./components/Habitat";
import HabitatCrossing from "./components/HabitatCrossing";
import NewsSection from "./components/NewsSection";
import PublicationsSection from "./components/PublicationsSection";
import "./styles.css";

const links = [
  ["News", "#news"],
  ["Publications", "#publications"],
  ["About", "#about"],
];

function Compass() {
  return (
    <svg aria-hidden="true" width="35" height="35" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15.5" stroke="currentColor" strokeWidth=".75" />
      <circle
        cx="20"
        cy="20"
        r="11.5"
        stroke="currentColor"
        strokeDasharray="1 3.5"
        opacity=".65"
      />
      <path
        d="M20 1.7 22.4 17.6 38.3 20 22.4 22.4 20 38.3 17.6 22.4 1.7 20 17.6 17.6Z"
        stroke="currentColor"
        strokeWidth=".8"
      />
      <path
        d="M20 2v18l-2.4-2.4ZM38 20H20l2.4-2.4ZM20 38V20l2.4 2.4ZM2 20h18l-2.4 2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function useMotionSetting() {
  const [preference, setPreference] = useState(() => {
    try {
      return localStorage.getItem("habitat-motion");
    } catch {
      return null;
    }
  });
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const paused = preference ? preference === "paused" : reduced;
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running";
  }, [paused]);
  function toggle() {
    const next = paused ? "running" : "paused";
    setPreference(next);
    try {
      localStorage.setItem("habitat-motion", next);
    } catch {
      /* Session state remains available. */
    }
  }
  return [paused, toggle];
}

function Header({ paused, toggleMotion }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const header = useRef(null);
  useEffect(() => {
    if (!open) return;
    function closeOnEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    function closeOutside(e) {
      if (!header.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);
  return (
    <header className="site-header" ref={header}>
      <div className="wrap header-bar">
        <a
          className="brand"
          aria-label="Ankit Upadhyay, home"
          href="#top"
          onClick={() => setOpen(false)}
        >
          <Compass />
          <span>Ankit Upadhyay</span>
        </a>
        <nav
          id="main-navigation"
          className={open ? "main-navigation is-open" : "main-navigation"}
          aria-label="Primary"
        >
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="cv-link" href={profile.cvUrl} download>
            <Download size={15} strokeWidth={1.6} aria-hidden="true" />
            CV
          </a>
          <button
            className="round-control motion-control"
            type="button"
            onClick={toggleMotion}
            aria-label={paused ? "Resume habitat motion" : "Pause habitat motion"}
            title={paused ? "Resume motion" : "Pause motion"}
          >
            {paused ? (
              <Play size={15} aria-hidden="true" />
            ) : (
              <Pause size={15} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="round-control menu-control"
            ref={menuButton}
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="wrap about-inner">
        <div className="portrait-wrap">
          <img
            src="/assets/headshot.jpeg"
            loading="lazy"
            width="1894"
            height="2048"
            alt="Ankit Upadhyay"
          />
        </div>
        <div className="about-copy">
          <p className="kicker">
            <span />
            About me
          </p>
          <h2 id="about-heading">
            Ankit <em>Upadhyay.</em>
          </h2>
          <p>
            I work with Charles V. Stewart in Troy, New York. Beyond wildlife vision, I study how
            language models learn across languages with limited data and how we can check their
            claims against a knowledge graph.
          </p>
          <a className="about-email" href={`mailto:${profile.email}`}>
            <Mail size={17} aria-hidden="true" />
            {profile.email}
          </a>
          <div className="social-links" aria-label="Research and professional profiles">
            {profile.socials.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [paused, toggleMotion] = useMotionSetting();
  useEffect(() => {
    const aliases = { "#research": "#publications", "#background": "#news", "#contact": "#about" };
    function resolveAlias() {
      const target = aliases[location.hash];
      if (target) {
        history.replaceState(null, "", target);
        document.querySelector(target)?.scrollIntoView();
      }
    }
    resolveAlias();
    window.addEventListener("hashchange", resolveAlias);
    return () => window.removeEventListener("hashchange", resolveAlias);
  }, []);
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header paused={paused} toggleMotion={toggleMotion} />
      <main id="content">
        <Hero paused={paused} />
        <NewsSection paused={paused} />
        <HabitatCrossing paused={paused} />
        <PublicationsSection paused={paused} />
        <About />
      </main>
      <footer>
        <div className="wrap footer-line">
          <span>© {new Date().getFullYear()} Ankit Upadhyay</span>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
