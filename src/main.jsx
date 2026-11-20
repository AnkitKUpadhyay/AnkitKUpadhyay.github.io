import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Mail,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import { profile } from "./data/site";
import { Hero } from "./components/Habitat";
import HabitatCrossing from "./components/HabitatCrossing";
import NewsSection from "./components/NewsSection";
import PublicationsSection from "./components/PublicationsSection";
import "./styles.css";

const EASE = [0.22, 1, 0.36, 1];

const links = [
  ["News", "#news"],
  ["Publications", "#publications"],
  ["Contact", "#contact"],
];

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
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const header = useRef(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 18);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    function closeOutside(e) {
      if (!header.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} ref={header}>
      <div className="wrap header-bar">
        <a
          className="brand"
          aria-label="Ankit Upadhyay, home"
          href="#top"
          onClick={() => setOpen(false)}
        >
          <img
            className="brand-avatar"
            src="/assets/headshot.jpeg"
            width="36"
            height="36"
            alt=""
          />
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
            <Download size={14} strokeWidth={1.6} aria-hidden="true" />
            CV
          </a>
          <button
            className="round-control motion-control"
            type="button"
            onClick={toggleMotion}
            aria-label={paused ? "Resume animations" : "Pause animations"}
            title={paused ? "Resume animations" : "Pause animations"}
          >
            {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
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

function ContactSection() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <motion.div
        className="wrap contact-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.68, ease: EASE }}
      >
        <div className="portrait-wrap">
          <img
            src="/assets/headshot.jpeg"
            loading="lazy"
            width="1894"
            height="2048"
            alt="Ankit Upadhyay"
          />
        </div>

        <div className="contact-copy">
          <h2 id="contact-heading">
            Get in <em>touch.</em>
          </h2>
          <p className="contact-lead">
            Always glad to connect on wildlife computer vision, foundation models, research
            collaborations, and internships.
          </p>

          <div className="contact-email-row">
            <a className="contact-email" href={`mailto:${profile.email}`}>
              <Mail size={16} aria-hidden="true" />
              <span>{profile.email}</span>
            </a>
            <button
              type="button"
              className="copy-email-btn"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <div className="social-links" aria-label="Research and professional profiles">
            {profile.socials.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                <span>{link.label}</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ))}
          </div>

          <p className="support-note">{profile.support}</p>
        </div>
      </motion.div>
    </section>
  );
}

function App() {
  const [paused, toggleMotion] = useMotionSetting();
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const aliases = { "#research": "#publications", "#background": "#news", "#about": "#contact" };
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
      <motion.div
        className="scroll-filament"
        style={{ scaleX: progressScale }}
        aria-hidden="true"
      />
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header paused={paused} toggleMotion={toggleMotion} />
      <main id="content">
        <Hero paused={paused} />
        <NewsSection paused={paused} />
        <HabitatCrossing paused={paused} />
        <PublicationsSection paused={paused} />
        <ContactSection />
      </main>
      <footer>
        <div className="wrap footer-line">
          <span>© {new Date().getFullYear()} Ankit Upadhyay · Troy, NY</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
