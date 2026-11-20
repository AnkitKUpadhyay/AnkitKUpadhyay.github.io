import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, Eye, Layers, ScanSearch, Sparkles } from "lucide-react";
import { wildlifeSpecimens } from "../data/wildlife";

const MODES = [
  { id: "lens", label: "CFR Lens", icon: ScanSearch },
  { id: "full", label: "Full Scene", icon: Eye },
  { id: "foreground", label: "Foreground", icon: Sparkles },
  { id: "shortcut", label: "Shortcut Only", icon: Layers },
];

/**
 * Lightweight living atmosphere overlay (savanna golden motes or pelagic ocean caustics).
 */
function AtmosphereCanvas({ atmosphere, dimmed }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;

    const particles = Array.from({ length: 28 }, (_, i) => ({
      x: ((i * 41 + 13) % 100) / 100,
      y: ((i * 67 + 7) % 100) / 100,
      r: atmosphere === "ocean" ? 1.4 + (i % 3) * 0.9 : 1.1 + (i % 3) * 0.7,
      speed: 0.000018 + (i % 5) * 0.000007,
      phase: i * 1.13,
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const time = reduced ? 0 : t;
      const baseAlpha = dimmed ? 0.16 : 0.72;

      if (atmosphere === "ocean") {
        // Gentle moving sunlit pelagic caustics
        for (let i = 0; i < 4; i++) {
          const sway = Math.sin(time * 0.00045 + i * 1.4) * 32;
          const x = w * (0.18 + i * 0.22) + sway;
          const grad = ctx.createLinearGradient(x, 0, x + w * 0.12, h * 0.85);
          grad.addColorStop(0, `rgba(235, 250, 252, ${0.13 * baseAlpha})`);
          grad.addColorStop(1, "rgba(235, 250, 252, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(x - 36, 0);
          ctx.lineTo(x + 44, 0);
          ctx.lineTo(x + w * 0.16, h);
          ctx.lineTo(x + w * 0.05, h);
          ctx.closePath();
          ctx.fill();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const px =
          atmosphere === "ocean"
            ? ((p.x + Math.sin(time * 0.0006 + p.phase) * 0.015 + 1) % 1) * w
            : ((p.x + time * p.speed) % 1) * w;
        const py =
          atmosphere === "ocean"
            ? (((p.y - time * p.speed * 1.35) % 1) + 1) % 1 * h
            : (((p.y + Math.sin(time * 0.0008 + p.phase) * 0.014) % 1) + 1) % 1 * h;
        const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.0018 + p.phase));

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          atmosphere === "ocean"
            ? `rgba(240, 252, 255, ${0.42 * pulse * baseAlpha})`
            : `rgba(202, 146, 72, ${0.34 * pulse * baseAlpha})`;
        ctx.fill();
      }

      if (!reduced) {
        raf = window.requestAnimationFrame(draw);
      }
    }

    raf = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [atmosphere, dimmed]);

  return <canvas ref={ref} className="studio-atmosphere" aria-hidden="true" />;
}

/**
 * Vector SAM3 contour + DINOv3 biometric landmark constellation overlay.
 * Perfectly aligned to the 1440x810 image coordinate space.
 */
function BiometricOverlay({
  specimen,
  accent,
  interactive = false,
  activePoint,
  setActivePoint,
  dashedOnly = false,
}) {
  const { contour, keypoints, edges } = specimen;
  const vb = `0 0 ${contour.width} ${contour.height}`;

  return (
    <svg
      className={`biometric-svg ${interactive ? "is-interactive" : ""}`}
      viewBox={vb}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden={!interactive}
    >
      <defs>
        <filter id={`glow-${specimen.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* SAM 3 exact segmentation silhouette contour */}
      {contour.paths.map((d, i) => (
        <g key={i}>
          {!dashedOnly && (
            <path
              d={d}
              fill="none"
              stroke={accent}
              strokeWidth="4.2"
              strokeOpacity="0.28"
              filter={`url(#glow-${specimen.id})`}
            />
          )}
          <path
            d={d}
            fill="none"
            stroke={accent}
            strokeWidth={dashedOnly ? "2.6" : "2.4"}
            strokeOpacity={dashedOnly ? "0.65" : "0.95"}
            strokeDasharray={dashedOnly ? "10 9" : "16 8"}
            className="contour-trace"
          />
        </g>
      ))}

      {/* Biometric constellation edges and anatomical landmarks */}
      {!dashedOnly && (
        <g>
          {edges.map(([aIdx, bIdx], idx) => {
            const a = keypoints[aIdx];
            const b = keypoints[bIdx];
            const highlighted =
              activePoint === a.id || activePoint === b.id;
            return (
              <line
                key={idx}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={accent}
                strokeWidth={highlighted ? "2.6" : "1.6"}
                strokeOpacity={highlighted ? "0.95" : "0.52"}
                strokeDasharray="5 5"
              />
            );
          })}

          {keypoints.map((pt, idx) => {
            const isSelected = activePoint === pt.id;
            return (
              <g
                key={pt.id}
                transform={`translate(${pt.x}, ${pt.y})`}
                className="landmark-node"
                onMouseEnter={interactive ? () => setActivePoint(pt.id) : undefined}
                onMouseLeave={interactive ? () => setActivePoint(null) : undefined}
                onClick={
                  interactive
                    ? (e) => {
                        e.stopPropagation();
                        setActivePoint(isSelected ? null : pt.id);
                      }
                    : undefined
                }
              >
                <circle
                  r={isSelected ? "22" : "15"}
                  fill={accent}
                  fillOpacity={isSelected ? "0.24" : "0.14"}
                  className="landmark-pulse"
                  style={{ animationDelay: `${idx * 0.25}s` }}
                />
                <circle
                  r={isSelected ? "7.5" : "5.5"}
                  fill="#ffffff"
                  stroke={accent}
                  strokeWidth="3"
                />
                {interactive && (
                  <circle r="24" fill="transparent" style={{ cursor: "pointer" }} />
                )}
                {interactive && isSelected && (
                  <g transform="translate(0, -28)" pointerEvents="none">
                    <rect
                      x="-96"
                      y="-18"
                      width="192"
                      height="30"
                      rx="15"
                      fill="rgba(16, 22, 19, 0.88)"
                      stroke={accent}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill="#F7F4ED"
                      fontSize="14.5"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="500"
                    >
                      {pt.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

export default function WildlifeStudio({ theme, onJumpToPaper }) {
  const [speciesIndex, setSpeciesIndex] = useState(0);
  const [mode, setMode] = useState("lens");
  const [activePoint, setActivePoint] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 52, y: 46 });
  const [lensRadius, setLensRadius] = useState(148);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  const specimen = wildlifeSpecimens[speciesIndex];
  const accent = theme === "dark" ? specimen.accentDark : specimen.accentLight;
  const voidColor = theme === "dark" ? specimen.voidDark : specimen.voidLight;

  // Keep clip-path circle and reticle ring pixel-synced across every screen size
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    function measure() {
      const w = el.getBoundingClientRect().width;
      setLensRadius(Math.round(Math.max(68, Math.min(168, w * 0.155))));
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset active landmark on species/mode switch
  useEffect(() => {
    setActivePoint(null);
  }, [speciesIndex, mode]);

  // Serene autonomous figure-8 optical scan when visitor hasn't hovered yet
  useEffect(() => {
    if (mode !== "lens" || isHovering) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLensPos({ x: 52, y: 46 });
      return;
    }

    let raf = 0;
    const start = performance.now();

    function tick(now) {
      const elapsed = (now - start) / 1000;
      // Gentle path strictly across the animal's body region
      const cx = specimen.id === "whaleshark" ? 54 : 52;
      const cy = specimen.id === "giraffe" ? 44 : 47;
      const rx = specimen.id === "whaleshark" ? 26 : 16;
      const ry = specimen.id === "giraffe" ? 16 : 9;
      const x = cx + Math.sin(elapsed * 0.62) * rx;
      const y = cy + Math.sin(elapsed * 1.24) * ry * 0.55;
      setLensPos({ x, y });
      raf = window.requestAnimationFrame(tick);
    }

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [mode, isHovering, specimen.id]);

  function handlePointerMove(e) {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xPct = Math.max(4, Math.min(96, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(6, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));
    setLensPos({ x: xPct, y: yPct });
    setParallax({
      x: ((xPct - 50) / 50) * -6,
      y: ((yPct - 50) / 50) * -4,
    });
  }

  function handlePointerLeave() {
    setIsHovering(false);
    setParallax({ x: 0, y: 0 });
  }

  const activeLandmarkObj = specimen.keypoints.find((k) => k.id === activePoint);

  const captionText =
    mode === "shortcut"
      ? specimen.shortcutNote
      : mode === "foreground"
      ? specimen.foregroundNote
      : specimen.fullNote;

  return (
    <div className="wildlife-studio">
      {/* Top bar: Species Tabs + Counterfactual View Switcher */}
      <div className="studio-controls">
        <div className="species-tabs" role="tablist" aria-label="Select wildlife species">
          {wildlifeSpecimens.map((item, idx) => {
            const active = idx === speciesIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`species-tab ${active ? "is-active" : ""}`}
                onClick={() => setSpeciesIndex(idx)}
              >
                {active && (
                  <motion.span
                    layoutId="species-pill"
                    className="species-tab-bg"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                )}
                <span className="species-tab-label">{item.name}</span>
                <span className="species-tab-latin">{item.latin}</span>
              </button>
            );
          })}
        </div>

        <div className="mode-pills" role="group" aria-label="Counterfactual inspection mode">
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                className={`mode-pill ${active ? "is-active" : ""}`}
                onClick={() => setMode(m.id)}
              >
                <Icon size={14} strokeWidth={2} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 16:9 Specimen Stage */}
      <div
        ref={stageRef}
        className={`studio-stage mode-${mode} atmosphere-${specimen.atmosphere}`}
        style={{ "--specimen-accent": accent }}
        onPointerEnter={() => setIsHovering(true)}
        onPointerDown={(e) => {
          setIsHovering(true);
          handlePointerMove(e);
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={specimen.id}
            className="stage-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Base archival grid (visible in Foreground mode) */}
            <div className="stage-archival-grid" aria-hidden="true" />

            {/* Full natural habitat illustration */}
            <img
              src={specimen.fullImage}
              alt={`${specimen.name} (${specimen.latin}) minimalist editorial naturalist illustration`}
              className={`stage-img stage-full ${mode === "foreground" ? "is-hidden" : ""}`}
              style={
                mode === "full"
                  ? {
                      transform: `scale(1.025) translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
                    }
                  : undefined
              }
              draggable={false}
            />

            {/* Subtle living atmosphere (golden motes / ocean sunbeams) */}
            <AtmosphereCanvas
              atmosphere={specimen.atmosphere}
              dimmed={mode === "foreground"}
            />

            {/* Shortcut-Only Mode: exact animal silhouette masked out into matte archival void */}
            {mode === "shortcut" && (
              <>
                <div
                  className="stage-shortcut-void"
                  style={{
                    backgroundColor: voidColor,
                    WebkitMaskImage: `url(${specimen.maskImage})`,
                    maskImage: `url(${specimen.maskImage})`,
                  }}
                />
                <BiometricOverlay specimen={specimen} accent={accent} dashedOnly />
              </>
            )}

            {/* Foreground-Only Mode: crisp isolated specimen + interactive landmarks */}
            {mode === "foreground" && (
              <>
                <img
                  src={specimen.fgImage}
                  alt={`${specimen.name} segmented foreground`}
                  className="stage-img stage-fg-isolated"
                  draggable={false}
                />
                <BiometricOverlay
                  specimen={specimen}
                  accent={accent}
                  interactive
                  activePoint={activePoint}
                  setActivePoint={setActivePoint}
                />
              </>
            )}

            {/* Interactive Counterfactual Biometric Lens Mode */}
            {mode === "lens" && (
              <>
                <div
                  className="stage-lens-reveal"
                  style={{
                    clipPath: `circle(${lensRadius}px at ${lensPos.x}% ${lensPos.y}%)`,
                  }}
                >
                  <div className="stage-archival-grid is-lens-grid" />
                  <img
                    src={specimen.fgImage}
                    alt=""
                    aria-hidden="true"
                    className="stage-img"
                    draggable={false}
                  />
                  <BiometricOverlay specimen={specimen} accent={accent} />
                </div>

                {/* Crisp optical reticle ring pixel-synced to clip-path */}
                <div
                  className="lens-reticle"
                  style={{
                    left: `${lensPos.x}%`,
                    top: `${lensPos.y}%`,
                    width: `${lensRadius * 2}px`,
                    height: `${lensRadius * 2}px`,
                    borderColor: accent,
                  }}
                  aria-hidden="true"
                >
                  <span className="lens-tag">CFR · FG</span>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quiet corner specimen metadata + active landmark readout */}
        <div className="stage-hud-top">
          <span className="hud-chip">
            <span className="hud-dot" style={{ backgroundColor: accent }} />
            {specimen.habitat}
          </span>
          <span className="hud-chip hud-hint">
            {mode === "lens"
              ? isHovering
                ? "Inspecting foreground mask"
                : "Move cursor across animal"
              : mode === "foreground"
              ? activeLandmarkObj
                ? `Landmark · ${activeLandmarkObj.label}`
                : "Click a biometric node"
              : mode === "shortcut"
              ? "Animal removed · Background only"
              : "Natural field observation"}
          </span>
        </div>
      </div>

      {/* Single crisp caption strip beneath canvas linking directly to the relevant paper */}
      <div className="studio-footer">
        <p className="studio-caption">{captionText}</p>
        <button
          type="button"
          className="studio-paper-link"
          onClick={() => onJumpToPaper(specimen.paperId)}
        >
          <span>{specimen.paperLabel}</span>
          <ArrowDownRight size={15} />
        </button>
      </div>
    </div>
  );
}
