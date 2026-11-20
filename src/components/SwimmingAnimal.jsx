import React, { useEffect, useRef, useState } from "react";
import { buildGrid, compileShader } from "./wildlifeMesh";
import "../swimming.css";

const animals = {
  // Crop coordinates are the measured alpha bounds of the illustrated plates.
  shark: {
    src: "/assets/atlas/shark-layer.webp",
    original: [1923, 818],
    crop: [792, 12, 1067, 670],
    margin: [0.165, 0.17, 0.06, 0.08],
  },
  turtle: {
    src: "/assets/atlas/sea-turtle.webp",
    original: [500, 500],
    crop: [0, 0, 500, 500],
    margin: [0.08, 0.06, 0.07, 0.07],
  },
};

function smooth(a, b, value) {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// The phase travels from the shoulder to the caudal peduncle. The near
// pectoral overlaps the tail in this three-quarter view, so it has a separate
// attachment and does not inherit the posterior body's wave.
function bendShark(u, v, time) {
  const pectoral = smooth(0.49, 0.83, v) * (1 - smooth(0.35, 0.58, u)) * smooth(0.05, 0.13, u);
  const axial = Math.min(1.04, Math.max(0, 0.93 - u + 0.19 * (0.66 - v)));
  const spine = axial + (0.32 - axial) * pectoral;
  const phase = 2.62 * time + 0.34 * Math.sin(time * 0.54) - 6.25 * spine;
  const wave = Math.sin(phase);
  const bend = spine * spine * wave;
  const caudal = smooth(0.74, 1.0, spine);
  const finTwist = Math.sin(phase - 0.85) * caudal;
  const bank = Math.sin(time * 0.78 - pectoral * 1.6);

  return [
    u -
      0.082 * bend +
      0.13 * (v - 0.33) * finTwist +
      0.022 * caudal * wave * wave +
      pectoral * bank * 0.015,
    v +
      0.099 * bend -
      (v - 0.33) * caudal * (1 - Math.cos(finTwist * 0.52)) +
      pectoral * bank * 0.054,
  ];
}

function paddle(u, v, px, py, sign, cycle, weight) {
  if (weight === 0) return [0, 0];
  const dx = u - px,
    dy = v - py;
  const span = Math.min(1, Math.hypot(dx, dy) / 0.46);
  const phase = (cycle + 1 - 0.075 * span) % 1;
  // Reach, a forceful bilateral downstroke, a folded recovery, then glide.
  const angle =
    sign *
    (-0.17 * smooth(0, 0.17, phase) +
      0.84 * smooth(0.17, 0.42, phase) -
      0.77 * smooth(0.47, 0.8, phase) +
      0.1 * smooth(0.82, 1, phase));
  const fold = 1 - 0.24 * span * smooth(0.38, 0.56, phase) * (1 - smooth(0.64, 0.88, phase));
  const a = angle * smooth(0.015, 0.25, span);
  const c = Math.cos(a),
    s = Math.sin(a);
  return [((dx * c - dy * s) * fold - dx) * weight, ((dx * s + dy * c) * fold - dy) * weight];
}

function bendTurtle(u, v, time) {
  const cycle = (time * 0.225 + 0.013 * Math.sin(time * 0.53)) % 1;
  const near = (1 - smooth(0.21, 0.276, u)) * smooth(0.255, 0.345, v);
  const far = smooth(0.435, 0.55, u) * (1 - smooth(0.17, 0.26, v));
  const left = paddle(u, v, 0.269, 0.341, -1, cycle, near);
  const right = paddle(u, v, 0.48, 0.212, 1, (cycle + 0.012) % 1, far);
  const rear = smooth(0.71, 0.9, v) * smooth(0.47, 0.65, u);
  const steer = rear * Math.sin(2 * Math.PI * cycle - 1) * 0.022;
  return [u + left[0] + right[0] + steer, v + left[1] + right[1] - steer * 0.55];
}

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  uniform vec4 crop;
  uniform vec2 fit;
  varying vec2 texCoord;
  void main() {
    texCoord = crop.xy + uv * crop.zw;
    gl_Position = vec4((position - 0.5) * fit * vec2(2.0, -2.0), 0., 1.);
  }`;
const fragmentShader = `
  precision mediump float;
  varying vec2 texCoord;
  uniform sampler2D plate;
  void main() {
    vec4 ink = texture2D(plate, texCoord);
    if (ink.a < 0.002) discard;
    gl_FragColor = ink;
  }`;

// A single indexed textured mesh needs one draw call per swimming animal.
function gpuRenderer(gl, mesh, image, animal) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  const buffers = [];
  let texture;
  function dispose() {
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  }
  if (!vs || !fs) {
    dispose();
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  function attribute(name, data, usage) {
    const buffer = gl.createBuffer();
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  }
  attribute("uv", mesh.vertices, gl.STATIC_DRAW);
  attribute("position", mesh.vertices, gl.DYNAMIC_DRAW);
  const indices = gl.createBuffer();
  buffers.push(indices);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  const [x, y, w, h] = animal.crop;
  gl.uniform4f(
    gl.getUniformLocation(program, "crop"),
    x / image.width,
    y / image.height,
    w / image.width,
    h / image.height,
  );
  const fit = gl.getUniformLocation(program, "fit");
  return {
    draw(positions, width, height, fitX, fitY) {
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(fit, fitX, fitY);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    },
    dispose,
  };
}

// Browsers without a GPU use the same pose on a coarser triangular mesh.
// Transparent cells are discarded once when the texture is loaded.
function rasterRenderer(canvas, mesh, image, animal, cols, rows) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const [cropX, cropY, w, h] = animal.crop;
  const mask = document.createElement("canvas");
  mask.width = cols * 3;
  mask.height = rows * 3;
  const mc = mask.getContext("2d");
  mc.drawImage(image, cropX, cropY, w, h, 0, 0, mask.width, mask.height);
  const alpha = mc.getImageData(0, 0, mask.width, mask.height).data;
  const tris = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let filled = false;
      for (let dy = 0; dy < 3; dy++) {
        for (let dx = 0; dx < 3; dx++) {
          if (alpha[4 * ((r * 3 + dy) * mask.width + c * 3 + dx) + 3]) filled = true;
        }
      }
      if (!filled) continue;
      const a = 2 * (r * (cols + 1) + c),
        b = a + 2,
        d = a + 2 * (cols + 1),
        e = d + 2;
      const x = cropX + (c * w) / cols,
        y = cropY + (r * h) / rows;
      tris.push([a, b, d, x, y, 1], [e, d, b, x + w / cols, y + h / rows, -1]);
    }
  }

  return {
    draw(positions, width, height, fitX, fitY) {
      ctx.clearRect(0, 0, width, height);
      const W = width * fitX,
        H = height * fitY,
        cellW = w / cols,
        cellH = h / rows;
      const points = mesh.vertices.map((_, i) =>
        i % 2 === 0 ? (positions[i] - 0.5) * W + width / 2 : (positions[i] - 0.5) * H + height / 2,
      );
      for (const [o, i, j, x, y, sign] of tris) {
        const ox = points[o],
          oy = points[o + 1],
          ix = points[i],
          iy = points[i + 1],
          jx = points[j],
          jy = points[j + 1];
        const a = (ix - ox) / (sign * cellW),
          b = (iy - oy) / (sign * cellW);
        const c = (jx - ox) / (sign * cellH),
          d = (jy - oy) / (sign * cellH);
        const centerX = (ox + ix + jx) / 3,
          centerY = (oy + iy + jy) / 3;
        const bleed = Math.min(0.12, 1.7 / Math.min(W / cols, H / rows));
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ox + (ox - centerX) * bleed, oy + (oy - centerY) * bleed);
        ctx.lineTo(ix + (ix - centerX) * bleed, iy + (iy - centerY) * bleed);
        ctx.lineTo(jx + (jx - centerX) * bleed, jy + (jy - centerY) * bleed);
        ctx.closePath();
        ctx.clip();
        ctx.setTransform(a, b, c, d, ox - a * x - c * y, oy - b * x - d * y);
        const bx = sign === 1 ? x : x - cellW,
          by = sign === 1 ? y : y - cellH;
        ctx.drawImage(
          image,
          bx - 2,
          by - 2,
          cellW + 4,
          cellH + 4,
          bx - 2,
          by - 2,
          cellW + 4,
          cellH + 4,
        );
        ctx.restore();
      }
    },
    dispose() {},
  };
}

export default function SwimmingAnimal({ species = "shark", paused = false, className = "" }) {
  const animal = animals[species];
  const hostRef = useRef(null);
  const syncRef = useRef(null);
  const pausedRef = useRef(paused);
  const [canvasReady, setCanvasReady] = useState(false);
  const [cx, cy, cw, ch] = animal.crop;
  const [left, top, right, bottom] = animal.margin;
  const frameWidth = cw * (1 + left + right);
  const frameHeight = ch * (1 + top + bottom);
  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    const image = new Image();
    let disposed = false,
      visible = false,
      ready = false,
      painted = false,
      renderer = null;
    let frame = 0,
      last = null,
      elapsed = 0;
    let targetX = 0,
      targetY = 0,
      currentX = 0,
      currentY = 0;
    let size = { width: 1, height: 1 };
    let mesh, positions, canvas, gl;
    const pointer = matchMedia("(hover: hover) and (pointer: fine)");
    const isShark = species === "shark";
    setCanvasReady(false);

    function schedule() {
      if (!ready || !visible || document.hidden || pausedRef.current || disposed) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = null;
        return;
      }
      if (!frame) frame = requestAnimationFrame(paint);
    }
    function paint(ts) {
      frame = 0;
      if (pausedRef.current || !visible || document.hidden || disposed || !ready) return;
      const interval = gl ? 1000 / 36 : 1000 / 24;
      if (last === null || ts - last >= interval - 1) {
        const dt = last === null ? 0 : Math.min(0.085, (ts - last) / 1000);
        last = ts;
        elapsed += dt;
        const ease = 1 - Math.exp(-dt * 1.6);
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        const time = elapsed;
        const blend = smooth(0, 0.85, time);
        const surge = isShark ? Math.sin(time * 0.6) * 0.011 : Math.sin(time * 1.414 - 1.5) * 0.014;
        const driftX = Math.sin(time * 0.33) * 0.014 + currentX * 0.014 + surge;
        const driftY =
          Math.sin(time * 0.46) * 0.014 + currentY * 0.02 + surge * (isShark ? 0.25 : 0.85);
        const roll = Math.sin(time * 0.62) * 0.024 + currentX * 0.021;
        const cos = Math.cos(roll),
          sin = Math.sin(roll),
          aspect = cw / ch;
        for (let i = 0; i < positions.length; i += 2) {
          const u = mesh.vertices[i],
            v = mesh.vertices[i + 1];
          const [x, y] = isShark ? bendShark(u, v, time) : bendTurtle(u, v, time);
          const X = (x - 0.56) * aspect,
            Y = y - 0.51;
          positions[i] =
            u + (0.56 + (X * cos - Y * sin) / aspect + driftX - u) * blend + (left - right) / 2;
          positions[i + 1] =
            v + (0.51 + X * sin + Y * cos + driftY - v) * blend + (top - bottom) / 2;
        }
        draw();
        if (!painted) {
          painted = true;
          setCanvasReady(true);
        }
      }
      schedule();
    }

    function draw() {
      const { width, height } = size;
      const scale = Math.min(width / frameWidth, height / frameHeight);
      renderer.draw(positions, width, height, (cw * scale) / width, (ch * scale) / height);
    }

    function resize() {
      if (!renderer) return;
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        gl ? 1.5 : 1.15,
        1400 / Math.max(1, rect.width),
      );
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (width !== size.width || height !== size.height) {
        size = { width, height };
        canvas.width = width;
        canvas.height = height;
        draw();
      }
    }

    function create() {
      if (
        disposed ||
        ready ||
        !image.complete ||
        !image.naturalWidth ||
        !visible ||
        pausedRef.current ||
        document.hidden
      )
        return;
      canvas = document.createElement("canvas");
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      if (gl) {
        mesh = buildGrid(44, 32);
        renderer = gpuRenderer(gl, mesh, image, animal);
      }
      if (!renderer) {
        // A canvas which already owns a WebGL context cannot acquire a 2D context.
        if (gl) canvas = document.createElement("canvas");
        gl = null;
        mesh = buildGrid(21, 17);
        renderer = rasterRenderer(canvas, mesh, image, animal, 21, 17);
      }
      if (!renderer) return;
      positions = new Float32Array(mesh.vertices);
      host.appendChild(canvas);
      canvas.addEventListener("webglcontextlost", loseContext);
      ready = true;
      resize();
      schedule();
    }

    function sync() {
      create();
      schedule();
    }
    syncRef.current = sync;
    function loseContext() {
      ready = false;
      painted = false;
      cancelAnimationFrame(frame);
      frame = 0;
      setCanvasReady(false);
      canvas?.remove();
      renderer?.dispose();
      renderer = null;
    }
    function onPointer(e) {
      if (!visible || pausedRef.current || !pointer.matches || e.pointerType === "touch") return;
      targetX = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2));
      targetY = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2));
    }
    function leave() {
      targetX = 0;
      targetY = 0;
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersection.observe(host);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    function onPointerOut(e) {
      if (!e.relatedTarget) leave();
    }
    image.onload = sync;
    image.src = animal.src;
    return () => {
      disposed = true;
      syncRef.current = null;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", sync);
      canvas?.removeEventListener("webglcontextlost", loseContext);
      canvas?.remove();
      renderer?.dispose();
    };
  }, [species, animal, cw, ch, frameWidth, frameHeight, left, top, right, bottom]);

  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      className={`swimming-animal ${className}`}
      data-animated={canvasReady || undefined}
    >
      <svg
        className="swimming-animal__poster"
        viewBox={`${cx - cw * left} ${cy - ch * top} ${frameWidth} ${frameHeight}`}
      >
        <image href={animal.src} width={animal.original[0]} height={animal.original[1]} />
      </svg>
    </span>
  );
}
