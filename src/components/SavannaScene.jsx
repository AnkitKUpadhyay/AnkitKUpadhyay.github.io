import React, { useEffect, useRef } from "react";

const ZEBRA = "/assets/atlas/zebra-layer.webp";
const STAGE = { width: 820, height: 628 };
const TWO_PI = Math.PI * 2;

// Joint positions correspond to the 721 × 569 painted animal inside the source plate.
const legs = [
  {
    hip: [142, 301],
    knee: [91, 408],
    hoof: [55, 554],
    phase: 0.55,
    outline:
      "M102 268 Q143 269 181 300 L171 344 Q150 376 122 399 L88 452 85 568 21 568 20 495 65 407 103 365 Q115 320 102 268Z",
  },
  {
    hip: [423, 312],
    knee: [400, 430],
    hoof: [385, 554],
    phase: 0.78,
    outline:
      "M392 296 Q420 286 449 303 L453 350 430 413 406 485 405 530 430 569 349 569 349 509 372 423 392 363Z",
  },
  {
    hip: [196, 289],
    knee: [188, 445],
    hoof: [261, 555],
    phase: 0.05,
    outline:
      "M136 263 Q180 253 246 284 L246 323 223 377 209 427 225 475 292 548 298 569 231 569 201 511 160 452 162 380 Q163 347 144 329Z",
  },
  {
    hip: [475, 295],
    knee: [552, 426],
    hoof: [622, 550],
    phase: 0.28,
    outline:
      "M431 262 Q489 245 540 274 L538 321 552 362 585 416 652 535 654 569 590 569 559 503 529 452 469 389 435 358Z",
  },
];
const head = "M385 118 Q396 135 435 163 Q480 199 505 266 L523 295 739 285 739 -12 434 -12Z";
const tail =
  "M106 205 Q108 221 101 242 Q86 281 84 311 Q84 339 78 352 L70 391 Q54 431 15 490 L-12 489 -12 350 66 311 Q76 274 80 237Z";
const ears = [
  { pivot: [641, 69], outline: "M629 67 Q640 37 640 4 L675 -6 677 43 656 77 641 84Z" },
  { pivot: [619, 69], outline: "M594 67 Q600 48 599 20 L608 -3 647 -4 647 31 631 79 614 88Z" },
];

function surface(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function cutPart(source, outline) {
  const path = new Path2D(outline);
  const pixels = surface(source.width, source.height);
  const brush = pixels.getContext("2d");
  brush.clip(path);
  brush.drawImage(source, 0, 0);
  return pixels;
}

function cutAway(pixels, outline) {
  const brush = pixels.getContext("2d");
  brush.save();
  brush.globalCompositeOperation = "destination-out";
  brush.fill(new Path2D(outline));
  brush.restore();
}

function makeRig(image) {
  const source = surface(721, 569);
  source.getContext("2d").drawImage(image, 899, 159, 721, 569, 0, 0, 721, 569);
  const torso = surface(721, 569);
  torso.getContext("2d").drawImage(source, 0, 0);
  const neck = cutPart(source, head);
  const tailPixels = cutPart(source, tail);
  const earPixels = ears.map((ear) => {
    const pixels = cutPart(neck, ear.outline);
    cutAway(neck, ear.outline);
    return pixels;
  });
  for (const part of [head, tail, ...legs.map((leg) => leg.outline)]) cutAway(torso, part);
  const body = torso.getContext("2d");
  body.clearRect(0, 354, 721, 215);
  // The haunch and shoulders overlap the limb roots in the original painting.
  // Keep those contours on top as the leg underneath changes angle.
  body.save();
  body.beginPath();
  body.ellipse(177, 234, 70, 82, 0.08, 0, TWO_PI);
  body.ellipse(480, 252, 52, 59, -0.14, 0, TWO_PI);
  body.clip();
  body.drawImage(source, 0, 0);
  body.restore();
  const legsOnly = surface(721, 569);
  legsOnly.getContext("2d").drawImage(source, 0, 0);
  cutAway(legsOnly, tail);
  const lowerMasks = [
    "M0 354H167L140 406L122 466L146 569H0Z",
    "M316 354H452L474 406L488 569H316Z",
    "M167 354H316V569H146L122 466L140 406Z",
    "M452 354H721V569H488L474 406Z",
  ];
  const limbPixels = legs.map((leg, i) => {
    const pixels = cutPart(legsOnly, leg.outline);
    const brush = pixels.getContext("2d");
    brush.clearRect(0, 354, 721, 215);
    brush.drawImage(cutPart(legsOnly, lowerMasks[i]), 0, 0);
    return pixels;
  });
  return { torso, neck, tailPixels, earPixels, limbPixels };
}

function turn(ctx, [x, y], angle) {
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.translate(-x, -y);
}

function jointAngle(from, to) {
  return Math.atan2(to[1] - from[1], to[0] - from[0]);
}

function drawLeg(ctx, image, leg, cycle, lift) {
  const { hip, knee, hoof } = leg;
  const phase = (cycle + leg.phase) % 1;
  const stance = 0.64;
  const swing = Math.max(0, (phase - stance) / (1 - stance));
  // A planted hoof moves back relative to the advancing body; its return arc clears the grass.
  const stride = 57;
  const travel = phase < stance ? 0.5 - phase / stance : -0.5 * Math.cos(swing * Math.PI);
  const footX = hoof[0] + stride * travel;
  const footY = hoof[1] - lift - 37 * Math.sin(swing * Math.PI) ** 1.4;
  const upper = Math.hypot(knee[0] - hip[0], knee[1] - hip[1]);
  const lower = Math.hypot(hoof[0] - knee[0], hoof[1] - knee[1]);
  const dx = footX - hip[0],
    dy = footY - hip[1];
  const reach = Math.min(
    upper + lower - 0.01,
    Math.max(Math.abs(upper - lower) + 0.01, Math.hypot(dx, dy)),
  );
  const angle = Math.atan2(dy, dx);
  const bend = (knee[0] - hip[0]) * (hoof[1] - hip[1]) - (knee[1] - hip[1]) * (hoof[0] - hip[0]);
  const offset = Math.acos(
    Math.max(
      -1,
      Math.min(1, (upper * upper + reach * reach - lower * lower) / (2 * upper * reach)),
    ),
  );
  const femur = angle + (bend < 0 ? offset : -offset);
  const newKnee = [hip[0] + upper * Math.cos(femur), hip[1] + upper * Math.sin(femur)];
  const lowerAngle = jointAngle(newKnee, [
    hip[0] + reach * Math.cos(angle),
    hip[1] + reach * Math.sin(angle),
  ]);
  const split = knee[1];

  ctx.save();
  turn(ctx, hip, femur - jointAngle(hip, knee));
  ctx.drawImage(image, 0, 0, 721, split + 10, 0, 0, 721, split + 10);
  ctx.restore();
  ctx.save();
  ctx.translate(newKnee[0] - knee[0], newKnee[1] - knee[1]);
  turn(ctx, knee, lowerAngle - jointAngle(knee, hoof));
  ctx.drawImage(image, 0, split - 7, 721, 576 - split, 0, split - 7, 721, 576 - split);
  ctx.restore();
}

function earFlick(t, offset) {
  const time = (t + offset) % 5.83;
  return time < 0.59 ? Math.sin((time / 0.59) * TWO_PI) * Math.sin((time / 0.59) * Math.PI) : 0;
}

function paintZebra(ctx, rig, cycle, time) {
  const lift = Math.sin(cycle * TWO_PI * 2) * 3.1;
  ctx.save();
  ctx.translate(40, 30 + lift);
  legs.forEach((leg, i) => drawLeg(ctx, rig.limbPixels[i], leg, cycle, lift));
  ctx.drawImage(rig.torso, 0, 0);

  const swing = (0.06 + 0.19 * Math.max(0, Math.cos(time * 0.83)) ** 5) * Math.sin(time * 3.3);
  ctx.save();
  turn(ctx, [103, 223], swing);
  ctx.drawImage(rig.tailPixels, 0, 0, 721, 325, 0, 0, 721, 325);
  turn(ctx, [78, 312], swing * 0.52 + Math.sin(time * 3.3 - 0.85) * 0.08);
  ctx.drawImage(rig.tailPixels, 0, 309, 721, 260, 0, 309, 721, 260);
  ctx.restore();

  ctx.save();
  const glance = Math.max(0, Math.sin(time * 0.27 - 0.7)) ** 5;
  turn(ctx, [465, 202], 0.029 * Math.sin(cycle * TWO_PI * 2 - 0.7) + 0.09 * glance);
  ears.forEach((ear, i) => {
    ctx.save();
    turn(ctx, ear.pivot, (i === 1 ? 0.29 : -0.23) * earFlick(time, i === 1 ? 0 : 1.32));
    ctx.drawImage(rig.earPixels[i], 0, 0);
    ctx.restore();
  });
  ctx.drawImage(rig.neck, 0, 0);
  ctx.restore();
  ctx.restore();
}

export default function SavannaScene({ paused }) {
  const scene = useRef(null);
  const track = useRef(null);
  const canvas = useRef(null);
  const motion = useRef(null);

  useEffect(() => {
    const panel = scene.current,
      animal = track.current,
      display = canvas.current;
    const ctx = display.getContext("2d");
    if (!ctx) return;
    const original = new Image();
    let rig = null,
      frame = 0,
      last = 0,
      elapsed = 0,
      distance = 0;
    let alive = true,
      inView = false,
      stopped = true;
    let viewport = 1,
      scale = 1,
      ratio = 1,
      cssWidth = 1;

    function resize() {
      cssWidth = animal.offsetWidth;
      if (!cssWidth) return;
      viewport = panel.clientWidth;
      scale = cssWidth / STAGE.width;
      ratio = Math.min(1.7, window.devicePixelRatio || 1);
      display.width = Math.round(cssWidth * ratio);
      display.height = Math.round((cssWidth / STAGE.width) * STAGE.height * ratio);
      paint();
    }
    function paint() {
      if (!rig || !cssWidth) return;
      const factor = display.width / STAGE.width;
      ctx.setTransform(factor, 0, 0, factor, 0, 0);
      ctx.clearRect(0, 0, STAGE.width, STAGE.height);
      const cycle = elapsed / 2.65;
      paintZebra(ctx, rig, cycle, elapsed);
      // Wrap well beyond the field edges. The pale reading margin veils the distant approach.
      const span = viewport + cssWidth * 1.7;
      const start = viewport * (viewport < 720 ? 0.51 : 0.71);
      const offset = (start - distance + cssWidth * 1.2) % span;
      const x = ((offset + span) % span) - cssWidth * 1.2;
      animal.style.transform = `translate3d(${x}px,0,0)`;
    }
    function tick(now) {
      frame = 0;
      if (!rig || !inView || stopped || document.hidden) return;
      if (!last || now - last >= 1000 / 26) {
        const dt = last ? Math.min((now - last) / 1000, 0.14) : 0;
        elapsed += dt;
        distance += (dt * scale * 57) / (0.64 * 2.65);
        last = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (rig && inView && !stopped && !document.hidden) frame = requestAnimationFrame(tick);
    }
    motion.current = (value) => {
      stopped = value;
      sync();
    };
    const size = new ResizeObserver(resize);
    size.observe(panel);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    visibility.observe(panel);
    document.addEventListener("visibilitychange", sync);
    original.onload = () => {
      if (!alive) return;
      rig = makeRig(original);
      resize();
      animal.dataset.ready = "true";
      sync();
    };
    original.src = ZEBRA;
    return () => {
      alive = false;
      motion.current = null;
      cancelAnimationFrame(frame);
      size.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  useEffect(() => {
    motion.current?.(paused);
  }, [paused]);

  return (
    <div className="pub-scene" ref={scene} aria-hidden="true">
      <img
        className="pub-daybreak"
        src="/assets/atlas/daybreak.webp"
        alt=""
        width="1536"
        height="1024"
      />
      <div className="pub-walker" ref={track}>
        <div className="pub-zebra-shadow" />
        <div className="pub-zebra-fallback">
          <img src={ZEBRA} alt="" />
        </div>
        <canvas className="pub-zebra" ref={canvas} width={STAGE.width} height={STAGE.height} />
      </div>
    </div>
  );
}
