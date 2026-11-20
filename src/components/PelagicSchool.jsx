import React, { useEffect, useId, useRef } from "react";

// The camera travels with the shark. The smaller fish maintain station in
// its slipstream while their formation changes with the current.
const width = 640;
const height = 380;
const school = [
  [52, 269, 0.62],
  [78, 289, 0.82],
  [92, 251, 0.66],
  [110, 272, 0.81],
  [123, 301, 0.72],
  [146, 251, 0.59],
  [157, 285, 0.92],
  [183, 309, 0.73],
  [211, 277, 0.88],
];
const initialHeading = -6;

function restPose(x, y, size) {
  return `translate(${x} ${y}) rotate(${initialHeading}) scale(${size})`;
}

export default function PelagicSchool({ paused = false }) {
  const stage = useRef(null);
  const models = useRef([]);
  const tails = useRef([]);
  const pausedRef = useRef(paused);
  const wake = useRef(null);
  const inkId = useId();

  useEffect(() => {
    pausedRef.current = paused;
    wake.current?.();
  }, [paused]);

  useEffect(() => {
    const svg = stage.current;
    const fish = school.map(([x, y, size], i) => ({
      x,
      y,
      size,
      vx: 0,
      vy: 0,
      angle: (initialHeading / 180) * Math.PI,
      tailPhase: i * 2.3,
    }));
    const cursor = { x: 0, y: 0, strength: 0, age: 0 };
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let visible = false,
      elapsed = 0,
      last = null,
      frame = 0;

    function schedule() {
      if (!visible || document.hidden || pausedRef.current) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = null;
        cursor.strength = 0;
        return;
      }
      if (!frame) frame = requestAnimationFrame(advance);
    }

    function advance(ts) {
      frame = 0;
      if (last !== null && ts - last < 30) {
        schedule();
        return;
      }
      const dt = last === null ? 0 : Math.min(0.075, (ts - last) / 1000);
      last = ts;
      elapsed += dt;

      const flowX = Math.sin(elapsed * 0.27) * 31 + Math.sin(elapsed * 0.49) * 8;
      const flowY = Math.sin(elapsed * 0.34) * 12;
      cursor.age += dt;
      if (cursor.age > 0.65) cursor.strength *= Math.exp(-dt * 2.75);

      // All neighbors use the same previous-step velocities/positions.
      const forces = fish.map((f, i) => {
        let neighbors = 0,
          alignX = 0,
          alignY = 0,
          centerX = 0,
          centerY = 0,
          awayX = 0,
          awayY = 0;
        for (const other of fish) {
          if (f === other) continue;
          const dx = f.x - other.x,
            dy = f.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance === 0 || distance > 80) continue;
          neighbors++;
          centerX += other.x;
          centerY += other.y;
          alignX += other.vx;
          alignY += other.vy;
          const spacing = 22 + (12 * (f.size + other.size)) / 2;
          const separation = Math.max(0, 1 - distance / spacing) * 34;
          awayX += (dx / distance) * separation;
          awayY += (dy / distance) * separation;
        }

        const goalX = school[i][0] + flowX + Math.sin(elapsed * 0.57 + i) * 7;
        const goalY = school[i][1] + flowY + Math.sin(elapsed * 0.41 + i * 1.9) * 5;
        let ax = (goalX - f.x) * 0.76 - f.vx * 1.08 + awayX;
        let ay = (goalY - f.y) * 0.76 - f.vy * 1.08 + awayY;
        if (neighbors) {
          ax += 0.44 * (alignX / neighbors - f.vx) + 0.075 * (centerX / neighbors - f.x);
          ay += 0.44 * (alignY / neighbors - f.vy) + 0.075 * (centerY / neighbors - f.y);
        }
        const dx = f.x - cursor.x,
          dy = f.y - cursor.y;
        const d = Math.max(1, Math.hypot(dx, dy));
        const avoidance = Math.pow(Math.max(0, 1 - d / 110), 1.35) * 95 * cursor.strength;
        return [ax + (avoidance * dx) / d, ay + (avoidance * dy) / d];
      });

      fish.forEach((f, i) => {
        f.vx += forces[i][0] * dt;
        f.vy += forces[i][1] * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        // Relative-to-water velocity includes the slow forward camera drift.
        const heading = Math.atan2(f.vy - 1.8, Math.max(9, 26 + f.vx));
        f.angle += (heading - f.angle) * (1 - Math.exp(-dt * 3.4));
        const speed = Math.hypot(f.vx, f.vy);
        const burst = 0.28 + 0.72 * Math.pow(0.5 + 0.5 * Math.sin(elapsed * 1.65 + i * 2.7), 1.6);
        f.tailPhase += dt * (8 + i * 0.39 + burst * 7 + Math.min(speed, 35) * 0.15);
        const beat = Math.sin(f.tailPhase) * burst;
        models.current[i]?.setAttribute(
          "transform",
          `translate(${f.x.toFixed(2)} ${f.y.toFixed(2)}) rotate(${((f.angle * 180) / Math.PI).toFixed(2)}) scale(${f.size})`,
        );
        tails.current[i]?.setAttribute(
          "transform",
          `translate(-9 0) rotate(${(beat * 15).toFixed(2)}) scale(${(1 - Math.abs(beat) * 0.25).toFixed(3)} 1)`,
        );
      });
      schedule();
    }

    function startle(e) {
      if (
        !visible ||
        pausedRef.current ||
        (e.type === "pointermove" && (!fine.matches || e.pointerType === "touch"))
      )
        return;
      const bounds = svg.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      cursor.x = ((e.clientX - bounds.left) * width) / bounds.width;
      cursor.y = ((e.clientY - bounds.top) * height) / bounds.height;
      if (cursor.x < 0 || cursor.x > width || cursor.y < 0 || cursor.y > height) return;
      cursor.age = 0;
      cursor.strength = 1;
    }

    wake.current = schedule;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(svg);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("pointermove", startle, { passive: true });
    window.addEventListener("pointerdown", startle, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      wake.current = null;
      document.removeEventListener("visibilitychange", schedule);
      window.removeEventListener("pointermove", startle);
      window.removeEventListener("pointerdown", startle);
    };
  }, []);

  return (
    <svg
      className="pelagic-school"
      aria-hidden="true"
      ref={stage}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient
          id={inkId}
          x1="0.15"
          y1="0"
          x2="0.3"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#679698" />
          <stop offset=".34" stopColor="#a3c8bc" />
          <stop offset=".58" stopColor="#f0e8c7" />
          <stop offset="1" stopColor="#729a9a" />
        </linearGradient>
      </defs>
      {school.map(([x, y, size], i) => (
        <g
          key={i}
          ref={(node) => {
            models.current[i] = node;
          }}
          transform={restPose(x, y, size)}
          opacity={0.6 + (i % 4) * 0.085}
        >
          <g
            ref={(node) => {
              tails.current[i] = node;
            }}
            transform="translate(-9 0)"
          >
            <path
              d="M2 -.8 Q-5 -1.8 -11 -6.2 Q-10 -2 -7 .2 Q-9 2.5 -11 5.4 Q-4 2.4 2 .9Z"
              fill="#a4c1af"
              stroke="#b6cebb"
              strokeWidth=".55"
            />
            <path d="M-8 -3.7 -2 -.7 M-8 3.1 -2 .7" stroke="#435f60" fill="none" strokeWidth=".6" />
          </g>
          <path
            d="M-1 -3.3 2.5 -7.5 Q6 -7 8 -3.3 M.8 3.4 -2 6.1 5 3.6"
            fill="#83a7a0"
            stroke="#b1c7b7"
            strokeWidth=".55"
          />
          <path
            d="M-11 -1 Q-6 -1.5 -2 -3.5 C3.5 -6.1 10.4 -4.7 15 -1.3 L17.3 -.1 15.7 .5 Q12.4 3.6 6.4 4.2 Q1.2 4.8 -4.6 2.4 L-11 1Z"
            fill={`url(#${inkId})`}
            stroke="#a9c7b8"
            strokeWidth=".56"
          />
          <path
            d="M-8 .1 C-1.3 -.3 5.7 -1 11.2 -.5 M9 -3.5 Q7.8 -1.1 9.6 2.5 M6 .4 2 2.7"
            stroke="#507374"
            fill="none"
            strokeWidth=".65"
            strokeLinecap="round"
          />
          <circle cx="13" cy="-1.45" r="1.12" fill="#123a43" stroke="#dde0bc" strokeWidth=".4" />
        </g>
      ))}
    </svg>
  );
}
