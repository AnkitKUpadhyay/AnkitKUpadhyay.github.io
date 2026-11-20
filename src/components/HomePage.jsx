import React from "react";
import { BookOpenText, Newspaper, UserRound } from "lucide-react";
import SwimmingAnimal from "./SwimmingAnimal";
import PelagicSchool from "./PelagicSchool";
import { pages } from "../pages";
import "../home.css";

const bubbles = [
  { key: "news", label: "News", icon: Newspaper },
  { key: "publications", label: "Publications", icon: BookOpenText },
  { key: "about", label: "About me", icon: UserRound },
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
      <div className="landing-water" aria-hidden="true">
        <div className="sunlight" />
        <div className="plankton">
          {Array.from({ length: 12 }, (_, i) => (
            <i
              key={i}
              style={{
                left: ((i * 31 + 17) % 98) + "%",
                top: ((i * 13 + 9) % 95) + "%",
                animationDelay: -i * 1.72 + "s",
                "--period": 9 + (i % 4) + "s",
              }}
            />
          ))}
        </div>
      </div>
      <div className="wrap landing-layout">
        <div className="landing-intro">
          <p className="kicker landing-discipline">
            <span />
            AI for biodiversity
          </p>
          <h1 id="intro-name">
            Ankit <em>Upadhyay</em>
          </h1>
          <p className="landing-bio">
            I’m a fourth-year computer science PhD student at Rensselaer Polytechnic Institute,
            advised by Charles V. Stewart.
          </p>
          <p className="landing-bio">
            I use vision foundation models to recognize individual animals and interpret their
            behavior in the wild. I also work on multilingual AI for low-resource languages.
          </p>
        </div>
        <figure className="landing-animal">
          <div className="landing-pelagic">
            <SwimmingAnimal species="shark" paused={paused} className="shark-swimmer" />
            <PelagicSchool paused={paused} />
          </div>
          <figcaption>
            <span className="species-rule" aria-hidden="true" />
            <span>
              Whale shark <em>Rhincodon typus</em>
            </span>
          </figcaption>
        </figure>
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
