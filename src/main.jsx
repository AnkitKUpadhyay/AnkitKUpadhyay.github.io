import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, BookOpen, BrainCircuit, BriefcaseBusiness, ChevronDown, Code2,
  Download, Github, GraduationCap, Mail, MapPin, Menu, Moon, Search, Sparkles, Sun, X,
} from "lucide-react";
import { publications, publicationFilters } from "./data/publications";
import { projects } from "./data/projects";
import { experience, honors, service, skills } from "./data/experience";
import "./styles.css";

const navItems = ["Home", "Research", "Publications", "Projects", "Experience", "About", "Contact"];
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

function useDarkMode() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  return [theme, setTheme];
}

function App() {
  const [theme, setTheme] = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <>
      <motion.div className="scroll-progress" style={{ width: progress }} />
      <Header theme={theme} setTheme={setTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Research />
        <Publications />
        <Projects />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function Header({ theme, setTheme, menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Go to home"><span className="brand-mark">AU</span><span>Ankit Upadhyay</span></a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Toggle dark and light mode" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-button mobile-only" type="button" aria-label="Open navigation menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="icon-button close-menu" type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            {navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section" id="home">
      <NeuralBackdrop />
      <div className="hero-grid">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> AI for biodiversity conservation and social good</p>
          <h1>Ankit Upadhyay</h1>
          <p className="hero-subtitle">Computer Science PhD student at RPI building foundation-model pipelines for animal re-identification, ecological video understanding, and multilingual AI for underrepresented languages.</p>
          <div className="hero-actions">
            <a className="button primary" href="#publications"><BookOpen size={18} /> View publications</a>
            <a className="button secondary" href="/files/Ankit_Upadhyay_CV.pdf"><Download size={18} /> Download CV</a>
          </div>
          <div className="hero-stats" aria-label="Research highlights">
            <Stat value="5" label="publications and submissions" />
            <Stat value="4.0" label="PhD GPA at RPI" />
            <Stat value="240K+" label="wildlife detections curated" />
          </div>
        </motion.div>
        <motion.div className="portrait-shell" initial={{ opacity: 0, scale: 0.94, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
          <img src="/assets/headshot.jpeg" alt="Headshot of Ankit Upadhyay" />
          <div className="portrait-card"><span>Research focus</span><strong>Animal re-ID, foundation models, low-resource NLP</strong></div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}

function NeuralBackdrop() {
  return <div className="neural-backdrop" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <span key={index} style={{ "--i": index }} />)}</div>;
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <motion.div className="section-title" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </motion.div>
  );
}

function Research() {
  const areas = [
    { icon: BrainCircuit, title: "AI for biodiversity conservation", text: "Field-ready systems that connect foundation models, segmentation, tracking, and human verification for ecological monitoring." },
    { icon: Search, title: "Animal re-identification", text: "Video-first pipelines for viewpoint-aware identity matching across long-tailed species, occlusion, motion, and domain shift." },
    { icon: GraduationCap, title: "Democratized multilingual AI", text: "Cross-lingual NLU and transfer learning approaches that improve access for low-resource and underrepresented languages." },
  ];
  return (
    <section className="section research-band" id="research">
      <SectionTitle eyebrow="Research" title="Building AI systems that can leave the lab">My work focuses on robust perception and representation learning for ecological settings, with a parallel commitment to multilingual NLP for social good.</SectionTitle>
      <div className="area-grid">
        {areas.map((area) => <motion.article className="area-card" key={area.title} whileHover={{ y: -6 }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}><area.icon size={25} /><h3>{area.title}</h3><p>{area.text}</p></motion.article>)}
      </div>
      <div className="abstract-list">
        {publications.map((paper) => <details key={paper.id} className="abstract-item"><summary><span>{paper.title}</span><ChevronDown size={18} /></summary><p>{paper.abstract}</p></details>)}
      </div>
    </section>
  );
}

function Publications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const featured = publications.filter((paper) => paper.featured);
  const filtered = useMemo(() => activeFilter === "All" ? publications : publications.filter((paper) => paper.type === activeFilter || paper.area === activeFilter), [activeFilter]);
  return (
    <section className="section" id="publications">
      <SectionTitle eyebrow="Publications" title="Selected papers and research outputs">Publication cards foreground the research question, venue, links, and exact abstract text.</SectionTitle>
      <div className="featured-grid">{featured.map((paper) => <PublicationCard key={paper.id} paper={paper} featured />)}</div>
      <div className="filter-bar" aria-label="Publication filters">{publicationFilters.map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} type="button" onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
      <div className="publication-list">{filtered.map((paper) => <PublicationCard key={paper.id} paper={paper} />)}</div>
    </section>
  );
}

function PublicationCard({ paper, featured = false }) {
  return (
    <motion.article className={`publication-card ${featured ? "featured" : ""}`} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
      <div className="pub-meta"><span>{paper.year}</span><span>{paper.type}</span><span>{paper.area}</span></div>
      <h3>{paper.title}</h3>
      <p className="authors">{paper.authors}</p>
      <p className="venue">{paper.venue}</p>
      <p>{paper.summary}</p>
      <details><summary>Abstract <ChevronDown size={16} /></summary><p>{paper.abstract}</p></details>
      <div className="link-row">{paper.links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={15} /></a>)}</div>
    </motion.article>
  );
}

function Projects() {
  return (
    <section className="section project-band" id="projects">
      <SectionTitle eyebrow="Projects" title="Engineering work with research-grade rigor">A mix of scalable ML systems, creative generative pipelines, and applied AI prototypes.</SectionTitle>
      <div className="project-grid">{projects.map((project) => <motion.article className="project-card" key={project.title} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ y: -5 }} variants={fadeUp}><div className="project-topline"><Code2 size={22} /><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="link-row">{project.links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={15} /></a>)}</div></motion.article>)}</div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section" id="experience">
      <SectionTitle eyebrow="Experience" title="Research, teaching, and leadership trajectory">The timeline highlights the arc from multilingual NLP to deployable ecological AI.</SectionTitle>
      <div className="timeline">{experience.map((item) => <motion.article className="timeline-item" key={item.title} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}><div className="timeline-date">{item.period}</div><div className="timeline-content"><h3>{item.title}</h3><p className="venue">{item.role}</p><p>{item.description}</p></div></motion.article>)}</div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-band" id="about">
      <SectionTitle eyebrow="About" title="A researcher-engineer for high-impact AI">I am a Computer Science PhD student at Rensselaer Polytechnic Institute, working across computer vision, biodiversity science, and knowledge-guided AI.</SectionTitle>
      <div className="about-grid">
        <div className="about-copy"><p>My research develops label-efficient systems for wildlife monitoring: selecting informative frames from video, separating identity cues from ecological background, linking views across time, and keeping humans in the loop only where their judgment matters most.</p><p>Before RPI, I worked on cross-lingual natural language inference and low-resource language transfer, work that continues to shape how I think about equitable AI systems.</p></div>
        <div className="skills-panel">{Object.entries(skills).map(([group, values]) => <div key={group}><h3>{group}</h3><div className="tag-row">{values.map((value) => <span key={value}>{value}</span>)}</div></div>)}</div>
      </div>
      <div className="honors-grid"><InfoList title="Selected Honors" items={honors} /><InfoList title="Leadership and Service" items={service} /></div>
    </section>
  );
}

function InfoList({ title, items }) {
  return <article className="info-list"><h3>{title}</h3>{items.map((item) => <p key={item}>{item}</p>)}</article>;
}

function Contact() {
  const contacts = [
    { label: "Email", href: "mailto:upadha2@rpi.edu", icon: Mail },
    { label: "GitHub", href: "https://github.com/AnkitKUpadhyay", icon: Github },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=dNClByYAAAAJ&hl=en", icon: GraduationCap },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ankit-kumar-upadhyay-b332b8186/", icon: BriefcaseBusiness },
  ];
  return (
    <section className="section contact-section" id="contact">
      <div><p className="eyebrow">Contact</p><h2>Open to research collaborations, internships, and future faculty or industry research conversations.</h2><p><MapPin size={17} /> Troy, New York</p></div>
      <div className="contact-links">{contacts.map((contact) => <a key={contact.label} href={contact.href} target={contact.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"><contact.icon size={20} /><span>{contact.label}</span><ArrowUpRight size={17} /></a>)}</div>
    </section>
  );
}

function Footer() {
  return <footer><span>© 2026 Ankit Upadhyay</span><a href="#home">Back to top</a></footer>;
}

createRoot(document.getElementById("root")).render(<App />);
