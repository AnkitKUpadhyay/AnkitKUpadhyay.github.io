import React, { useEffect, useRef } from "react";
import LivingAnimalCanvas from "./LivingAnimalCanvas";
import "../crossing.css";

/**
 * Seamless living ocean-to-savanna transition.
 * Continuously animates flowing water-current contours, subtle turtle wake bubbles,
 * and an organically flipper-stroking sea turtle gliding across the shallows.
 */
export default function HabitatCrossing({ paused = false }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const turtleWrapRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const turtleWrap = turtleWrapRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");

    let visible = false;
    let raf = 0;
    let width = 0;
    let height = 0;
    let elapsed = 0;
    let lastTs = 0;
    let curOffset = 0;
    let curPitch = 0;

    // Gentle pearl wake micro-bubbles trailing behind the gliding turtle
    const wakeBubbles = Array.from({ length: 16 }, (_, i) => ({
      t: i / 16,
      spread: ((i * 37) % 100) / 100 - 0.5,
      r: 1.4 + (i % 4) * 0.9,
      phase: i * 0.9,
    }));

    function resize() {
      const bounds = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.ceil(width * dpr));
      canvas.height = Math.max(1, Math.ceil(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function waterlinePath(fraction, t, drift, speed) {
      const path = new Path2D();
      const y = fraction * height;
      const w1 = Math.sin(t * speed + drift * 7) * height * 0.045;
      const w2 = Math.cos(t * speed * 0.82 - drift * 5) * height * 0.05;
      path.moveTo(-2, y + w1 * 0.4);
      path.bezierCurveTo(
        width * 0.17,
        y - height * 0.12 + w1,
        width * 0.39,
        y + height * (0.11 + drift) + w2,
        width * 0.56,
        y - height * 0.04 - w1 * 0.5,
      );
      path.bezierCurveTo(
        width * 0.73,
        y - height * (0.16 + drift) + w2,
        width * 0.87,
        y + height * 0.09 - w1,
        width + 2,
        y - height * 0.015 + w2 * 0.4,
      );
      return path;
    }

    function drawFrame(ts) {
      raf = 0;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      if (!pausedRef.current) elapsed += dt;

      // Inertial scroll-linked glide path + subtle natural autonomous swimming sway
      const bounds = stage.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)),
      );
      const distance = Math.min(width * 0.44, 520);
      const targetOffset = (0.5 - progress) * distance;
      const targetPitch = (progress - 0.5) * 6;
      curOffset += (targetOffset - curOffset) * 0.08;
      curPitch += (targetPitch - curPitch) * 0.08;

      const gentleBob = Math.sin(elapsed * 0.95) * 6.5;
      if (turtleWrap) {
        turtleWrap.style.transform = `translate3d(calc(-50% + ${curOffset.toFixed(1)}px), calc(-50% + ${gentleBob.toFixed(1)}px), 0) rotate(${(-9 + curPitch).toFixed(2)}deg)`;
      }

      ctx.clearRect(0, 0, width, height);

      // Continuously undulating ocean-to-shore current contours
      for (let i = 0; i < 11; i++) {
        const drift = Math.sin(i * 0.78) * 0.045;
        const speed = 0.45 + (i % 4) * 0.09;
        const path = waterlinePath(0.24 + i * 0.055, elapsed, drift, speed);
        const alpha = 0.045 + i * 0.01;
        ctx.strokeStyle = `rgba(196, 224, 206, ${alpha.toFixed(3)})`;
        ctx.lineWidth = i % 3 === 0 ? 1.25 : 0.75;
        ctx.stroke(path);
      }

      // Delicate hydrodynamic wake trail streaming behind the turtle's flippers
      const turtleX = width * 0.56 + curOffset;
      const turtleY = height * 0.47 + gentleBob;
      for (let i = 0; i < wakeBubbles.length; i++) {
        const b = wakeBubbles[i];
        const age = (b.t + elapsed * 0.14) % 1;
        const bx = turtleX + 36 + age * Math.min(width * 0.22, 190);
        const by =
          turtleY +
          18 +
          age * 36 +
          b.spread * (22 + age * 44) +
          Math.sin(elapsed * 2.1 + b.phase) * 5;
        const alpha = Math.sin(age * Math.PI) * 0.32;
        ctx.beginPath();
        ctx.arc(bx, by, b.r * (0.65 + age * 0.5), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(208, 240, 228, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // Smooth organic shore wave rising seamlessly into the Savanna section below
      const shoreColor = getComputedStyle(stage).color || "#0c262b";
      const shore = waterlinePath(0.84, elapsed * 0.7, 0.06, 0.38);
      shore.lineTo(width + 2, height + 2);
      shore.lineTo(-2, height + 2);
      shore.closePath();
      ctx.fillStyle = shoreColor;
      ctx.fill(shore);

      if (visible && !pausedRef.current) {
        raf = requestAnimationFrame(drawFrame);
      }
    }

    function kick() {
      lastTs = 0;
      if (!raf) raf = requestAnimationFrame(drawFrame);
    }

    resize();
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        stage.dataset.visible = String(visible);
        if (visible) kick();
      },
      { rootMargin: "100px" },
    );
    observer.observe(stage);

    const ro = new ResizeObserver(() => {
      resize();
      if (visible) kick();
    });
    ro.observe(stage);
    stage.addEventListener("crossing-wake", kick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      stage.removeEventListener("crossing-wake", kick);
    };
  }, []);

  useEffect(() => {
    if (!paused) stageRef.current?.dispatchEvent(new Event("crossing-wake"));
  }, [paused]);

  return (
    <div className="habitat-crossing" data-paused={paused} ref={stageRef} aria-hidden="true">
      <canvas className="habitat-crossing__shore" ref={canvasRef} />
      <div className="habitat-crossing__turtle" ref={turtleWrapRef}>
        <LivingAnimalCanvas
          className="habitat-crossing__turtle-canvas"
          src="/assets/atlas/sea-turtle.webp"
          mode="turtle"
          width={500}
          height={500}
          paused={paused}
        />
      </div>
    </div>
  );
}
