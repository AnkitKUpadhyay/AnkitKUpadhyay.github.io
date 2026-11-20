import React, { useEffect, useRef } from "react";

/**
 * Living sunlit ocean atmosphere: breathing volumetric sun-shafts,
 * drifting marine snow / bioluminescent plankton, and a tiny distant
 * school of pelagic fish silhouettes gliding calmly through deep water.
 */
export function OceanAtmosphere({ paused = false, dense = false }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let elapsed = 0;
    let lastTs = 0;

    const moteCount = dense ? 42 : 30;
    const motes = Array.from({ length: moteCount }, (_, i) => ({
      x: ((i * 37 + 11) % 100) / 100,
      y: ((i * 59 + 17) % 100) / 100,
      r: 0.9 + (i % 4) * 0.55,
      vx: 0.0045 + (i % 5) * 0.0016,
      vy: -0.007 - (i % 4) * 0.0022,
      phase: i * 1.17,
      tint: i % 3 === 0 ? "rgba(235, 224, 184," : "rgba(182, 232, 220,",
    }));

    // Small graceful school of distant silver fish silhouettes (only in hero)
    const school = dense
      ? []
      : Array.from({ length: 7 }, (_, i) => ({
          offsetX: -i * 0.022 + (i % 2) * 0.008,
          offsetY: (i % 3 - 1) * 0.018 + Math.sin(i * 1.9) * 0.008,
          size: 5.5 + (i % 3) * 1.4,
          phase: i * 0.7,
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

    function draw(ts) {
      raf = 0;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      if (!pausedRef.current) elapsed += dt;

      ctx.clearRect(0, 0, w, h);

      // Soft breathing diagonal volumetric underwater sunbeams (upper right)
      if (!dense) {
        for (let i = 0; i < 4; i++) {
          const sway = Math.sin(elapsed * 0.35 + i * 1.3) * 28;
          const xTop = w * (0.62 + i * 0.11) + sway;
          const rayAlpha = 0.036 + 0.018 * Math.sin(elapsed * 0.52 + i * 1.7);
          const grad = ctx.createLinearGradient(xTop, 0, xTop - w * 0.24, h * 0.82);
          grad.addColorStop(0, `rgba(218, 248, 236, ${rayAlpha})`);
          grad.addColorStop(0.65, `rgba(145, 220, 212, ${rayAlpha * 0.35})`);
          grad.addColorStop(1, "rgba(145, 220, 212, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(xTop - 22, 0);
          ctx.lineTo(xTop + 34, 0);
          ctx.lineTo(xTop - w * 0.18 + 56, h * 0.85);
          ctx.lineTo(xTop - w * 0.24 - 20, h * 0.85);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Tiny distant pelagic fish gliding calmly across the deep background
      if (school.length > 0 && w > 520) {
        const baseProg = ((elapsed * 0.015 + 0.15) % 1.32) - 0.16;
        const baseY = 0.3 + Math.sin(elapsed * 0.22) * 0.04;
        ctx.fillStyle = "rgba(179, 217, 206, 0.16)";
        for (let i = 0; i < school.length; i++) {
          const f = school[i];
          const fx = (baseProg + f.offsetX) * w;
          const fy =
            (baseY + f.offsetY + Math.sin(elapsed * 0.9 + f.phase) * 0.005) * h;
          const tailWag = Math.sin(elapsed * 5.2 + f.phase) * 1.4;
          const s = f.size;

          ctx.beginPath();
          ctx.moveTo(fx + s, fy);
          ctx.quadraticCurveTo(fx, fy - s * 0.36, fx - s * 0.9, fy + tailWag * 0.35);
          ctx.lineTo(fx - s * 1.45, fy - s * 0.32 + tailWag);
          ctx.lineTo(fx - s * 1.25, fy + tailWag * 0.5);
          ctx.lineTo(fx - s * 1.45, fy + s * 0.32 + tailWag);
          ctx.lineTo(fx - s * 0.9, fy + tailWag * 0.35);
          ctx.quadraticCurveTo(fx, fy + s * 0.36, fx + s, fy);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Drifting marine snow & warm bioluminescent motes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const px =
          (((m.x + elapsed * m.vx + Math.sin(elapsed * 0.45 + m.phase) * 0.014) % 1) + 1) % 1 * w;
        const py = (((m.y + elapsed * m.vy) % 1) + 1) % 1 * h;
        const twinkle = 0.22 + 0.36 * (0.5 + 0.5 * Math.sin(elapsed * 1.3 + m.phase));
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `${m.tint} ${twinkle.toFixed(3)})`;
        ctx.fill();
      }

      if (visible && !pausedRef.current) {
        raf = requestAnimationFrame(draw);
      }
    }

    function kick() {
      lastTs = 0;
      if (!raf) raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    canvas.addEventListener("atmo-wake", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("atmo-wake", kick);
    };
  }, [dense]);

  useEffect(() => {
    if (!paused) canvasRef.current?.dispatchEvent(new Event("atmo-wake"));
  }, [paused]);

  return <canvas ref={canvasRef} className="living-atmosphere" aria-hidden="true" />;
}

/**
 * Living savanna atmosphere: graceful African savanna birds soaring naturally
 * with realistic flap-and-glide cadence above the acacia horizon, plus warm
 * golden morning sunlight dust motes drifting across the plains.
 */
export function SavannaAtmosphere({ paused = false }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let elapsed = 0;
    let lastTs = 0;

    // Small natural flock soaring calmly at varied altitudes and glide phases
    const birds = [
      { x0: 0.14, y0: 0.22, speed: 0.022, scale: 0.95, phase: 0.2, freq: 3.1, glideBias: 0.45 },
      { x0: 0.21, y0: 0.16, speed: 0.024, scale: 0.72, phase: 1.8, freq: 3.4, glideBias: 0.55 },
      { x0: 0.27, y0: 0.26, speed: 0.021, scale: 0.82, phase: 3.4, freq: 2.9, glideBias: 0.4 },
      { x0: 0.56, y0: 0.15, speed: 0.017, scale: 0.62, phase: 2.5, freq: 3.6, glideBias: 0.6 },
      { x0: 0.62, y0: 0.21, speed: 0.018, scale: 0.55, phase: 4.1, freq: 3.8, glideBias: 0.5 },
      { x0: 0.79, y0: 0.18, speed: 0.020, scale: 0.78, phase: 0.9, freq: 3.0, glideBias: 0.48 },
    ];

    const dust = Array.from({ length: 26 }, (_, i) => ({
      x: ((i * 43 + 9) % 100) / 100,
      y: 0.42 + ((i * 37) % 56) / 100,
      r: 0.9 + (i % 3) * 0.6,
      vx: 0.008 + (i % 4) * 0.003,
      phase: i * 1.3,
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

    function draw(ts) {
      raf = 0;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      if (!pausedRef.current) elapsed += dt;

      ctx.clearRect(0, 0, w, h);

      // Warm floating golden morning dust motes over the savanna grass
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        const px = ((d.x + elapsed * d.vx) % 1) * w;
        const py = (d.y + Math.sin(elapsed * 0.75 + d.phase) * 0.02) * h;
        const alpha = 0.18 + 0.34 * (0.5 + 0.5 * Math.sin(elapsed * 1.4 + d.phase));
        // Brighter toward sunlit right side of the savanna
        const sunWeight = Math.min(1, Math.max(0.15, (px / Math.max(1, w) - 0.15) * 1.3));
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 224, 152, ${(alpha * sunWeight).toFixed(3)})`;
        ctx.fill();
      }

      // Natural soaring birds with realistic alternating wingbeat & calm thermal gliding
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        const progress = ((b.x0 + elapsed * b.speed) % 1.18) - 0.09;
        const bx = progress * w;
        const thermalLift = Math.sin(elapsed * 0.45 + b.phase) * 11;
        const by = b.y0 * h + thermalLift;

        // Realistic flap-glide cycle: smoothly alternates between gentle wingbeats and outstretched gliding
        const glideEnvelope = Math.max(
          0.16,
          0.5 + 0.5 * Math.sin(elapsed * 0.55 + b.phase * 1.7) - b.glideBias * 0.35,
        );
        const flap = Math.sin(elapsed * b.freq + b.phase) * 5.2 * b.scale * glideEnvelope;
        const span = 11.5 * b.scale;
        const bank = Math.cos(elapsed * 0.45 + b.phase) * 0.09;

        // Warm atmospheric blending: crisp dark-gold silhouette over amber sky, soft over deep teal left
        const skyLight = Math.min(1, Math.max(0.25, (progress - 0.12) * 1.25));
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(bank);
        ctx.strokeStyle = `rgba(24, 34, 32, ${(0.34 + 0.36 * skyLight).toFixed(3)})`;
        ctx.lineWidth = 1.45 * b.scale;

        ctx.beginPath();
        // Left wing with natural arched shoulder and flexible outer primary tip
        ctx.moveTo(-span, -flap + 1.2 * b.scale);
        ctx.quadraticCurveTo(
          -span * 0.48,
          -4.4 * b.scale - flap * 0.35,
          0,
          0.5 * b.scale,
        );
        // Right wing
        ctx.quadraticCurveTo(
          span * 0.48,
          -4.4 * b.scale - flap * 0.35,
          span,
          -flap + 1.2 * b.scale,
        );
        ctx.stroke();

        // Subtle warm golden rim highlight on bird silhouette when crossing sunset glow
        if (skyLight > 0.55) {
          ctx.strokeStyle = `rgba(255, 206, 130, ${(0.22 * skyLight).toFixed(3)})`;
          ctx.lineWidth = 0.7 * b.scale;
          ctx.stroke();
        }
        ctx.restore();
      }

      if (visible && !pausedRef.current) {
        raf = requestAnimationFrame(draw);
      }
    }

    function kick() {
      lastTs = 0;
      if (!raf) raf = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    canvas.addEventListener("atmo-wake", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("atmo-wake", kick);
    };
  }, []);

  useEffect(() => {
    if (!paused) canvasRef.current?.dispatchEvent(new Event("atmo-wake"));
  }, [paused]);

  return <canvas ref={canvasRef} className="living-atmosphere" aria-hidden="true" />;
}
