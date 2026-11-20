import React, { useEffect, useRef, useState } from "react";
import { Download, Mail, MapPin, Menu, Pause, Play, X } from "lucide-react";
import { profile } from "./data/site";
import { pages } from "./pages";

const destinations = [
  ["News", "news"],
  ["Publications", "publications"],
  ["About", "about"],
];

function useMotion() {
  // Start with a still frame on both the server and the hydrating client.
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      let setting;
      try {
        setting = localStorage.getItem("habitat-motion");
      } catch {
        /* Storage is optional. */
      }
      const next = setting === "paused" || (setting !== "running" && media.matches);
      document.documentElement.dataset.motion = next ? "paused" : "running";
      setPaused(next);
    }
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    window.addEventListener("pageshow", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, []);
  function toggle() {
    const value = paused ? "running" : "paused";
    document.documentElement.dataset.motion = value;
    try {
      localStorage.setItem("habitat-motion", value);
    } catch {
      /* Use this page’s preference. */
    }
    setPaused(!paused);
  }
  return [paused, toggle];
}

function Header({ view, paused, toggle }) {
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  const trigger = useRef(null);
  const home = view === "home";
  useEffect(() => {
    if (!open) return;
    function escape(e) {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    function outside(e) {
      if (!header.current?.contains(e.target)) setOpen(false);
    }
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header ref={header} className="site-header">
      <div className="wrap header-inner">
        <a className="brand-home" href="/" aria-label="Ankit Upadhyay, home">
          <img src="/assets/avatar.webp" alt="" width="34" height="34" />
          <span>{home ? "Research portfolio" : profile.name}</span>
        </a>
        {!home && (
          <nav id="site-nav" aria-label="Primary" className={open ? "site-nav open" : "site-nav"}>
            <a href="/">Home</a>
            {destinations.map(([label, key]) => (
              <a key={key} href={pages[key].path} aria-current={view === key ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>
        )}
        <div className="header-tools">
          {home && (
            <a href={`mailto:${profile.email}`} className="header-email" aria-label="Email Ankit">
              <Mail size={16} aria-hidden="true" />
              <span>Email</span>
            </a>
          )}
          <a className="cv-action" href={profile.cvUrl} download="Ankit_Upadhyay_CV.pdf">
            <Download size={15} aria-hidden="true" />
            <span>CV</span>
          </a>
          <button
            className="icon-action motion-action"
            type="button"
            onClick={toggle}
            aria-label={paused ? "Resume animations" : "Pause animations"}
            title={paused ? "Resume animations" : "Pause animations"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          {!home && (
            <button
              type="button"
              ref={trigger}
              className="icon-action menu-action"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer({ home }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        {home ? (
          <>
            <span className="footer-location">
              <MapPin size={14} aria-hidden="true" />
              Troy, New York
            </span>
            <nav aria-label="Academic profiles">
              {profile.socials.slice(0, 2).map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </>
        ) : (
          <>
            <a href="/">Ankit Upadhyay</a>
            <nav aria-label="Footer">
              <a href="/">Home</a>
              <a href={profile.cvUrl}>Curriculum vitae</a>
            </nav>
          </>
        )}
      </div>
    </footer>
  );
}

export default function App({ view, Page }) {
  const [paused, toggle] = useMotion();
  return (
    <div className={`portfolio-shell view-${view}`} id="top">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header view={view} paused={paused} toggle={toggle} />
      <main id="content">
        <Page paused={paused} />
      </main>
      <Footer home={view === "home"} />
    </div>
  );
}
