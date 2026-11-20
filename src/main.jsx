import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import AmbientCanopy from "./components/AmbientCanopy";
import WildlifeStudio from "./components/WildlifeStudio";
import PublicationsSection from "./components/PublicationsSection";
import BackgroundSection from "./components/BackgroundSection";
import { profile, researchPillars } from "./data/site";
import "./styles.css";

const NAV_ITEMS = [
  { label: "Research", href: "#research" },
  { label: "Publications", href: "#publications" },
  { label: "Background", href: "#background" },
  { label: "Contact", href: "#contact" },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("ankit-theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ankit-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0D1210" : "#F7F4ED");
    }
  }, [theme]);

  return [theme, setTheme];
}

function BrandMark() {
  return (
    <svg
      className="brand-glyph"
      viewBox="0 0 28 28"
      width="24"
      height="24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="1.2" opacity="0.32" />
      <path
        d="M5.5 14C7.8 9.6 10.7 7.6 14 7.6C17.3 7.6 20.2 9.6 22.5 14C20.2 18.4 17.3 20.4 14 20.4C10.7 20.4 7.8 18.4 5.5 14Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="14" cy="14" r="3.1" fill="currentColor" />
    </svg>
  );
}

function Header({ theme, setTheme, menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="Ankit Upadhyay — Home">
          <BrandMark />
          <span>Ankit Upadhyay</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="header-cv"
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>CV</span>
            <ArrowUpRight size={13} />
          </a>

          <button
            className="icon-btn"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "daylight" : "night"} theme`}
            title={theme === "dark" ? "Daylight Field Journal" : "Night Survey Mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="icon-btn mobile-only"
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              className="icon-btn close-btn"
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={18} />
            </button>
            <div className="mobile-menu-links">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                Curriculum Vitae ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ theme }) {
  return (
    <section className="hero" id="top">
      <AmbientCanopy theme={theme} />
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="show"
          variants={reveal}
        >
          <p className="hero-kicker">
            {profile.role} · {profile.institution}
          </p>
          <h1>
            AI for wildlife,
            <br />
            <em>seen closely.</em>
          </h1>
          <p className="hero-bio">{profile.bio}</p>

          <div className="hero-actions">
            <a className="btn-primary" href="#publications">
              <span>Publications</span>
              <ArrowUpRight size={15} />
            </a>
            <a
              className="btn-secondary"
              href={profile.cvUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Download size={15} />
              <span>Curriculum Vitae</span>
            </a>
          </div>

          <div className="hero-links" aria-label="Academic and code profiles">
            <a href={`mailto:${profile.email}`}>Email</a>
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.figure
          className="hero-portrait"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="portrait-frame">
            <img
              src="/assets/headshot.jpeg"
              alt="Portrait of Ankit Upadhyay"
            />
          </div>
          <figcaption className="portrait-caption">
            <span>{profile.name}</span>
            <span>{profile.location}</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

function ResearchSection({ theme, onJumpToPaper }) {
  return (
    <section className="section research-section" id="research">
      <div className="container">
        <motion.div
          className="section-head research-head"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={reveal}
        >
          <div>
            <p className="eyebrow">Interactive Field Lab</p>
            <h2>Seeing the individual, not the background.</h2>
          </div>
          <p className="section-lead">
            Choose a species and sweep the counterfactual lens to inspect how
            foundation-model segmentation separates biometric identity from
            habitat shortcuts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <WildlifeStudio theme={theme} onJumpToPaper={onJumpToPaper} />
        </motion.div>

        <div className="pillars-grid">
          {researchPillars.map((pillar) => (
            <motion.article
              key={pillar.index}
              className="pillar-item"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={reveal}
            >
              <span className="pillar-index">{pillar.index}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
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
    <section className="section contact-section" id="contact">
      <div className="container contact-inner">
        <motion.div
          className="contact-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={reveal}
        >
          <p className="eyebrow">Contact</p>
          <h2>
            Let&apos;s build <em>field-ready</em> AI together.
          </h2>
          <p>
            Always happy to connect on wildlife computer vision, foundation
            models, research collaborations, and internships.
          </p>
        </motion.div>

        <motion.div
          className="contact-actions"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={reveal}
        >
          <div className="email-bar">
            <a className="email-link" href={`mailto:${profile.email}`}>
              <Mail size={16} />
              <span>{profile.email}</span>
            </a>
            <button
              type="button"
              className="copy-btn"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <div className="contact-socials">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                <span>{s.label}</span>
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {profile.name} · {profile.location}</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pubFilter, setPubFilter] = useState("all");
  const [highlightId, setHighlightId] = useState(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  function handleJumpToPaper(paperId) {
    setPubFilter("all");
    requestAnimationFrame(() => {
      const target = document.getElementById(`paper-${paperId}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightId(paperId);
        setTimeout(() => setHighlightId(null), 2400);
      } else {
        document.getElementById("publications")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  return (
    <>
      <motion.div className="scroll-progress" style={{ width: progressWidth }} />
      <Header
        theme={theme}
        setTheme={setTheme}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Hero theme={theme} />
        <ResearchSection theme={theme} onJumpToPaper={handleJumpToPaper} />
        <div className="container">
          <PublicationsSection
            filter={pubFilter}
            setFilter={setPubFilter}
            highlightId={highlightId}
          />
          <BackgroundSection />
        </div>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
