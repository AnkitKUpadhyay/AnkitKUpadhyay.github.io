import React, { useEffect, useRef } from "react";

/**
 * Whisper-minimal living ecological backdrop for the hero.
 * Renders gentle topographic/biometric contour ribbons and a small flock
 * of quiet distant bird silhouettes drifting slowly across the horizon.
 */
export default function AmbientCanopy({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const birds = Array.from({ length: 6 }, (_, i) => ({
      x: (i * 0.19 + 0.08) % 1,
      y: 0.13 + (i % 3) * 0.065 + Math.sin(i * 2.1) * 0.02,
      speed: 0.000042 + (i % 4) * 0.000012,
      scale: 0.65 + (i % 3) * 0.22,
      phase: i * 1.4,
      wingFreq: 0.0042 + (i % 3) * 0.0006,
    }));

    const motes = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 37) % 100) / 100,
      y: ((i * 53 + 17) % 100) / 100,
      r: 1 + (i % 3) * 0.65,
      vx: 0.000018 + (i % 5) * 0.000006,
      vy: -0.000012 - (i % 4) * 0.000005,
      phase: i * 0.9,
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointerMove(e) {
      pointer.tx = e.clientX / Math.max(1, window.innerWidth);
      pointer.ty = e.clientY / Math.max(1, window.innerHeight);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const isDark = theme === "dark";
    const lineColor = isDark ? "rgba(106, 212, 164, 0.085)" : "rgba(31, 92, 68, 0.07)";
    const warmLine = isDark ? "rgba(226, 168, 87, 0.075)" : "rgba(184, 109, 41, 0.065)";
    const birdColor = isDark ? "rgba(237, 234, 226, 0.24)" : "rgba(21, 27, 24, 0.22)";
    const moteColor = isDark ? "rgba(106, 212, 164, 0.26)" : "rgba(184, 109, 41, 0.24)";

    function drawFrame(t) {
      ctx.clearRect(0, 0, width, height);

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      const shiftX = (pointer.x - 0.5) * 24;
      const shiftY = (pointer.y - 0.5) * 14;
      const time = reducedMotion ? 0 : t;

      // Subtle biometric contour waves along the lower horizon
      for (let row = 0; row < 5; row++) {
        ctx.beginPath();
        const baseY = height * (0.64 + row * 0.072) + shiftY * (0.35 + row * 0.12);
        const amp = 12 + row * 4;
        const freq = 0.0024 + row * 0.00035;
        const speed = time * (0.00028 + row * 0.00004);

        for (let x = -20; x <= width + 20; x += 18) {
          const y =
            baseY +
            Math.sin(x * freq + speed + row * 1.1) * amp +
            Math.cos(x * freq * 0.55 - speed * 0.7) * (amp * 0.45);
          if (x === -20) ctx.moveTo(x + shiftX * 0.25, y);
          else ctx.lineTo(x + shiftX * 0.25, y);
        }
        ctx.strokeStyle = row % 2 === 0 ? lineColor : warmLine;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Quiet drifting savanna dust motes / telemetry particles
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const px = ((m.x + time * m.vx) % 1) * width;
        const py = (((m.y + time * m.vy) % 1) + 1) % 1 * height;
        const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.0014 + m.phase));
        ctx.beginPath();
        ctx.arc(px + shiftX * 0.2, py + shiftY * 0.2, m.r, 0, Math.PI * 2);
        ctx.fillStyle = moteColor;
        ctx.globalAlpha = alpha * 0.55;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Minimalist distant birds soaring gently across the upper sky
      ctx.strokeStyle = birdColor;
      ctx.lineCap = "round";
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        const bx = (((b.x + time * b.speed) % 1.16) - 0.08) * width + shiftX * 0.35;
        const by =
          b.y * height + Math.sin(time * 0.0007 + b.phase) * 9 + shiftY * 0.25;
        const flap = Math.sin(time * b.wingFreq + b.phase) * 4.5 * b.scale;
        const span = 10.5 * b.scale;

        ctx.lineWidth = 1.25 * b.scale;
        ctx.beginPath();
        ctx.moveTo(bx - span, by - flap);
        ctx.quadraticCurveTo(bx - span * 0.42, by - 4.2 * b.scale - flap * 0.4, bx, by);
        ctx.quadraticCurveTo(bx + span * 0.42, by - 4.2 * b.scale - flap * 0.4, bx + span, by - flap);
        ctx.stroke();
      }

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    }

    rafId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="ambient-canopy" aria-hidden="true" />;
}
