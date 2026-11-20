import React from "react";
import { BookOpenText, Mail, Newspaper } from "lucide-react";
import SwimmingAnimal from "./SwimmingAnimal";
import PelagicSchool from "./PelagicSchool";
import OceanWater from "./OceanWater";
import { profile } from "../data/site";
import { pages } from "../pages";
import "../home.css";

const bubbles = [
  { key: "news", label: "News", icon: Newspaper },
  { key: "publications", label: "Publications", icon: BookOpenText },
  { key: "contact", label: "Contact me", icon: Mail },
];

function shiftReflection(event) {
  if (event.pointerType !== "mouse" || document.documentElement.dataset.motion === "paused") return;
  const link = event.currentTarget;
  const rect = link.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  link.style.setProperty("--light-x", 22 + x * 29 + "%");
  link.style.setProperty("--light-y", 9 + y * 20 + "%");
}
function resetReflection(event) {
  event.currentTarget.style.removeProperty("--light-x");
  event.currentTarget.style.removeProperty("--light-y");
}

export default function HomePage({ paused }) {
  return (
    <section className="landing" aria-labelledby="intro-name">
      <OceanWater paused={paused} />
      <div className="wrap landing-layout">
        <div className="landing-intro">
          <div className="landing-identity">
            <img
              className="landing-portrait"
              src="/assets/ankit-portrait.webp"
              alt="Portrait of Ankit Upadhyay"
              width="480"
              height="560"
              fetchPriority="high"
            />
            <h1 id="intro-name">
              Ankit <em>Upadhyay</em>
            </h1>
          </div>
          <div className="landing-biography">
            <p>{profile.bioPrimary}</p>
            <p>{profile.bioSecondary}</p>
          </div>
        </div>
        <div className="landing-animal" aria-hidden="true">
          <div className="landing-pelagic">
            <SwimmingAnimal species="shark" paused={paused} className="shark-swimmer" />
            <PelagicSchool paused={paused} />
          </div>
        </div>
        <nav className="habitat-portals" aria-label="Explore the portfolio">
          {bubbles.map(({ key, label, icon: Icon }) => (
            <a
              key={key}
              href={pages[key].path}
              data-bubble={key}
              className={`portal portal-${key}`}
              onPointerMove={shiftReflection}
              onPointerLeave={resetReflection}
            >
              <span className="portal-glass" aria-hidden="true">
                <i className="portal-landscape" />
                <i className="portal-reflection" />
              </span>
              <span className="portal-label">
                <Icon size={18} strokeWidth={1.45} aria-hidden="true" />
                <span>{label}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
