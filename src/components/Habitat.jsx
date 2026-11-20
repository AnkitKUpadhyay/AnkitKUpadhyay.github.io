import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { profile } from "../data/site";
import LivingAnimalCanvas from "./LivingAnimalCanvas";
import { OceanAtmosphere, SavannaAtmosphere } from "./LivingAtmosphere";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Inertial scroll-linked depth motion for habitat plates.
 * Smoothly interpolates parallax offset toward scroll target so section
 * transitions feel fluid and organic rather than mechanically locked to pixels.
 */
export function useHabitatMotion(paused) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    let raf = 0;
    let visible = false;
    let curX = 0;
    let curY = 0;
    let targetX = 0;
    let targetY = 0;

    function computeTarget() {
      const { top, height } = el.getBoundingClientRect();
      const phase = Math.min(
        1,
        Math.max(-1, (window.innerHeight / 2 - top - height / 2) / ((window.innerHeight + height) / 2)),
      );
      targetX = phase * 30;
      targetY = phase * 22;
    }

    function step() {
      raf = 0;
      curX += (targetX - curX) * 0.09;
      curY += (targetY - curY) * 0.09;
      el.style.setProperty("--drift-x", `${curX.toFixed(2)}px`);
      el.style.setProperty("--drift-y", `${curY.toFixed(2)}px`);
      if (visible && (Math.abs(targetX - curX) > 0.08 || Math.abs(targetY - curY) > 0.08)) {
        raf = requestAnimationFrame(step);
      }
    }

    function schedule() {
      computeTarget();
      if (!raf) raf = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      el.dataset.visible = String(visible);
      if (visible) {
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
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [paused]);
  return ref;
}

export function Bubbles({ sparse = false }) {
  const sizes = sparse ? [7, 14, 5, 22, 9, 6] : [8, 24, 6, 36, 12, 6, 18, 7, 29, 10, 14, 5];
  return (
    <div aria-hidden="true" className="sea-bubbles">
      {sizes.map((size, i) => (
        <i
          key={i}
          style={{
            "--x": `${(i * 29 + 7) % 96}%`,
            "--y": `${(i * 23 + 11) % 92}%`,
            "--size": `${size}px`,
            "--time": `${11 + (i % 6)}s`,
            "--delay": `${-i * 2.5}s`,
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
          <OceanAtmosphere paused={paused} />
          <div className="animal-parallax">
            <LivingAnimalCanvas
              className="animal-layer shark-canvas"
              src="/assets/atlas/shark-layer.webp"
              mode="shark"
              width={1923}
              height={818}
              paused={paused}
              interactivePointer
            />
          </div>
        </div>
      </div>

      <Bubbles sparse />

      <div className="wrap hero-layout">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <h1 id="hero-heading">
            Ankit <em>Upadhyay</em>
          </h1>

          <p className="hero-bio">{profile.bioPrimary}</p>
          <p className="hero-bio hero-bio-secondary">{profile.bioSecondary}</p>

          <div className="hero-actions">
            <a className="button-primary" href="#publications">
              <span>Publications</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a className="button-ghost" href={profile.cvUrl} download>
              <Download size={15} aria-hidden="true" />
              <span>Curriculum Vitae</span>
            </a>
          </div>

          <div className="hero-profiles" aria-label="Academic and code profiles">
            <a href={`mailto:${profile.email}`}>Email</a>
            {profile.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll-cue">
        <a href="#news" aria-label="Scroll to latest news">
          <ArrowDown size={17} strokeWidth={1.6} aria-hidden="true" />
        </a>
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
          <SavannaAtmosphere paused={paused} />
          <div className="animal-parallax">
            <LivingAnimalCanvas
              className="animal-layer zebra-canvas"
              src="/assets/atlas/zebra-layer.webp"
              mode="zebra"
              width={1923}
              height={818}
              paused={paused}
            />
          </div>
        </div>
      </div>

      <motion.div
        className="wrap savanna-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.72, ease: EASE }}
      >
        <h2 id="papers-title">Publications</h2>
      </motion.div>
      <div className="savanna-fade" aria-hidden="true" />
    </div>
  );
}
