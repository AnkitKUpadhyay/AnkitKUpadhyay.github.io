import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Download, Mail } from "lucide-react";
import { profile } from "../data/site";
import "../field-pages.css";

function TroyMap() {
  return (
    <figure className="notebook-map">
      <div className="notebook-map__surface">
        <img
          className="notebook-map__streets"
          src="/assets/atlas/troy-map.webp"
          width="960"
          height="1040"
          alt=""
        />
        <svg viewBox="0 0 960 1040" className="notebook-map__current" aria-hidden="true">
          <path d="M556 -10 Q574 28 544 83 T506 194 Q509 245 510 286 T498 353 Q478 419 461 460 T422 550 Q372 606 356 651 T333 750 Q318 825 300 888 T253 1050" />
        </svg>
        <span className="notebook-map__river" aria-hidden="true">
          Hudson River
        </span>
        <img
          className="notebook-map__portrait"
          src="/assets/headshot.jpeg"
          width="1894"
          height="2048"
          alt="Ankit Upadhyay"
        />
        <a
          className="notebook-map__campus"
          href="https://www.rpi.edu/visit/directions"
          aria-label="View Rensselaer Polytechnic Institute campus map"
        >
          <span className="notebook-map__pin" aria-hidden="true" />
          <span>RPI campus</span>
        </a>
      </div>
      <figcaption>
        <span>Troy, New York</span>
        <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html">
          U.S. Census map data
        </a>
      </figcaption>
    </figure>
  );
}

function ContactEmail() {
  const [state, setState] = useState("idle");
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setState("copied");
    } catch {
      setState("manual");
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), 3500);
  }

  return (
    <div className="notebook-about__email">
      <a href={`mailto:${profile.email}`}>
        <Mail size={17} aria-hidden="true" />
        {profile.email}
      </a>
      <button
        type="button"
        onClick={copyEmail}
        title="Copy email address"
        aria-label="Copy email address"
      >
        {state === "copied" ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
      </button>
      <span className="notebook-about__copy-status" role="status">
        {state === "copied" ? "Copied" : state === "manual" ? "Select the address to copy it." : ""}
      </span>
    </div>
  );
}

export default function AboutPage({ paused = false }) {
  return (
    <section
      id="about"
      className="notebook-about"
      aria-labelledby="about-title"
      data-paused={paused}
    >
      <div className="wrap notebook-about__spread">
        <TroyMap />
        <div className="notebook-about__copy">
          <h1 id="about-title">
            About <em>me.</em>
          </h1>
          <p>
            A zebra turns halfway through a drone video. The stripes on its left flank differ from
            those on its right. How can we tell it’s the same animal when we see it again? Questions
            like this shape my research.
          </p>
          <p>
            In Troy, I’ve also mentored students in RPI’s AI for Conservation course as they
            developed computer vision projects around conservation problems of their own.
          </p>
          <div className="notebook-about__contact" id="contact">
            <ContactEmail />
            <a className="notebook-about__cv" href={profile.cvUrl} download>
              <Download size={16} aria-hidden="true" />
              Download CV
            </a>
          </div>
          <nav className="notebook-about__socials" aria-label="Research and professional profiles">
            {profile.socials.map(({ href, label }) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <details className="notebook-about__funding">
            <summary>
              Research support <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <p>{profile.support}</p>
          </details>
        </div>
      </div>
    </section>
  );
}
