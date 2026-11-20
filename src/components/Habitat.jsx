import React, { useEffect, useRef } from "react";
import { ChevronDown, Waves, Sun } from "lucide-react";

// Update a visible plate only while the document is moving. The native scroll
// position stays in charge, including when someone follows a section link.
export function useHabitatMotion(paused) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    let frame = 0;
    function paint() {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      const phase = Math.min(
        1,
        Math.max(-1, (innerHeight / 2 - top - height / 2) / ((innerHeight + height) / 2)),
      );
      el.style.setProperty("--drift-x", `${(phase * 33).toFixed(1)}px`);
      el.style.setProperty("--drift-y", `${(phase * 24).toFixed(1)}px`);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) {
        schedule();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
      } else {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [paused]);
  return ref;
}

export function Bubbles({ sparse = false }) {
  const sizes = sparse ? [8, 15, 5, 24, 9, 6] : [9, 28, 7, 43, 13, 6, 21, 8, 36, 11, 16, 5];
  return (
    <div aria-hidden="true" className="sea-bubbles">
      {sizes.map((size, i) => (
        <i
          key={i}
          style={{
            "--x": `${(i * 29 + 5) % 98}%`,
            "--y": `${(i * 23 + 11) % 95}%`,
            "--size": `${size}px`,
            "--time": `${10 + (i % 6)}s`,
            "--delay": `${-i * 2.7}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero({ paused }) {
  const ref = useHabitatMotion(paused);
  return (
    <section className="hero plate" id="top" ref={ref} aria-labelledby="hero-heading">
      <div className="plate-frame" aria-hidden="true">
        <div className="plate-art ocean-art">
          <img
            className="scene-image"
            src="/assets/atlas/ocean-background.webp"
            width="1923"
            height="818"
            alt=""
            fetchPriority="high"
          />
          <div className="animal-parallax">
            <img
              className="animal-layer"
              src="/assets/atlas/shark-layer.webp"
              width="1923"
              height="818"
              alt=""
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
      <Bubbles sparse />
      <div className="wrap hero-layout">
        <div className="hero-copy">
          <p className="kicker hero-kicker">
            <span />
            AI for biodiversity
          </p>
          <h1 id="hero-heading">
            Computer vision
            <br />
            <em>in the wild.</em>
          </h1>
          <p className="hero-bio">
            I’m Ankit Upadhyay, a PhD researcher at Rensselaer Polytechnic Institute. I study how
            computers recognize individual animals and interpret their behavior.
          </p>
          <a className="button-primary" href="#publications">
            Explore publications
          </a>
        </div>
        <aside className="specimen-tag hero-specimen" aria-label="Illustrated species">
          <i className="specimen-pin" aria-hidden="true" />
          <span>
            Whale shark<em>Rhincodon typus</em>
          </span>
        </aside>
      </div>
      <div className="hero-rail">
        <div className="wrap hero-rail-inner">
          <span className="habitat-label">
            <Waves aria-hidden="true" size={17} />
            Open ocean
          </span>
          <a href="#news" className="dive-link">
            Dive into the news <ChevronDown size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Savanna({ paused }) {
  const ref = useHabitatMotion(paused);
  return (
    <div className="savanna plate" ref={ref}>
      <div className="plate-frame" aria-hidden="true">
        <div className="plate-art savanna-art">
          <img
            className="scene-image"
            src="/assets/atlas/savanna-background.webp"
            width="1923"
            height="818"
            alt=""
            loading="lazy"
          />
          <div className="animal-parallax">
            <img
              className="animal-layer"
              src="/assets/atlas/zebra-layer.webp"
              width="1923"
              height="818"
              alt=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div className="wrap savanna-inner">
        <p className="kicker">
          <Sun size={16} aria-hidden="true" />
          Savanna
        </p>
        <h2 id="papers-title">Publications</h2>
      </div>
    </div>
  );
}
