import React, { useEffect, useRef } from "react";
import "../crossing.css";

function paintShore(canvas, width, height, pixelRatio, shoreColor) {
  canvas.width = Math.ceil(width * pixelRatio);
  canvas.height = Math.ceil(height * pixelRatio);
  const ctx = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);

  function waterline(fraction, drift = 0) {
    const path = new Path2D();
    const y = fraction * height;
    path.moveTo(-1, y);
    path.bezierCurveTo(
      width * 0.15,
      y - height * 0.14,
      width * 0.38,
      y + height * (0.14 + drift),
      width * 0.56,
      y - height * 0.05,
    );
    path.bezierCurveTo(
      width * 0.72,
      y - height * (0.2 + drift),
      width * 0.85,
      y + height * 0.11,
      width + 1,
      y - height * 0.02,
    );
    return path;
  }

  for (let i = 0; i < 12; i++) {
    const path = waterline(0.32 + i * 0.049, Math.sin(i * 0.75) * 0.05);
    ctx.strokeStyle = `rgba(189,219,194,${0.05 + i * 0.009})`;
    ctx.lineWidth = i % 4 === 0 ? 1.3 : 0.75;
    ctx.stroke(path);
  }
  const shore = waterline(0.86, 0.1);
  shore.lineTo(width + 1, height + 1);
  shore.lineTo(-1, height + 1);
  shore.closePath();
  ctx.fillStyle = shoreColor;
  ctx.fill(shore);
}

export default function HabitatCrossing({ paused = false }) {
  const stageRef = useRef(null);
  const shoreRef = useRef(null);
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = shoreRef.current;
    let visible = false;
    let frame = 0;

    function drawShore() {
      const bounds = stage.getBoundingClientRect();
      if (window.Path2D && canvas.getContext("2d")) {
        paintShore(
          canvas,
          bounds.width,
          bounds.height,
          Math.min(window.devicePixelRatio || 1, 2),
          getComputedStyle(stage).color,
        );
      }
      move();
    }

    function move() {
      if (!visible || paused || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = stage.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)),
        );
        const distance = Math.min(bounds.width * 0.48, 580);
        stage.style.setProperty("--swim-offset", `${(0.5 - progress) * distance}px`);
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      stage.dataset.visible = String(visible);
      move();
    });
    observer.observe(stage);
    const sizeObserver = new ResizeObserver(drawShore);
    sizeObserver.observe(stage);
    window.addEventListener("scroll", move, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("scroll", move);
    };
  }, [paused]);

  return (
    <div className="habitat-crossing" data-paused={paused} ref={stageRef} aria-hidden="true">
      <canvas className="habitat-crossing__shore" ref={shoreRef} />
      <div className="habitat-crossing__turtle">
        <img
          src="/assets/atlas/sea-turtle.webp"
          alt=""
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
