import React, { useEffect, useRef, useState } from "react";
import { buildSharkShape, textureWidth, textureHeight } from "./sharkGeometry";
import { sharkCourse } from "./sharkCourse";
import { compileShader } from "./wildlifeMesh";

const litVertex = `
  attribute vec4 projected;
  attribute vec2 uv;
  varying vec2 texCoord;
  varying float light;
  void main() {
    gl_Position=vec4(projected.xyz, 1.);
    texCoord=uv;
    light=projected.w;
  }`;
const skinFragment = `
  precision mediump float;
  uniform sampler2D skin;
  uniform float haze;
  varying vec2 texCoord;
  varying float light;
  void main() {
    vec3 color=texture2D(skin,texCoord).rgb * light;
    gl_FragColor=vec4(mix(color,vec3(.055,.195,.219),haze),1.);
  }`;

function hardware(gl, shape, skin) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, litVertex);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, skinFragment);
  const program = gl.createProgram();
  const buffers = [];
  let texture;
  function dispose() {
    buffers.forEach((b) => gl.deleteBuffer(b));
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
  function attribute(name, size, data, usage) {
    const buffer = gl.createBuffer();
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const loc = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  const count = shape.vertices.length / 8,
    uv = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    uv[i * 2] = shape.vertices[i * 8 + 6];
    uv[i * 2 + 1] = shape.vertices[i * 8 + 7];
  }
  attribute("uv", 2, uv, gl.STATIC_DRAW);
  attribute("projected", 4, count * 4 * Float32Array.BYTES_PER_ELEMENT, gl.DYNAMIC_DRAW);
  const idx = gl.createBuffer();
  buffers.push(idx);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.indices, gl.STATIC_DRAW);
  texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skin);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  const fog = gl.getUniformLocation(program, "haze");
  return {
    draw(points, width, height, haze) {
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, points);
      gl.uniform1f(fog, haze);
      gl.drawElements(gl.TRIANGLES, shape.indices.length, gl.UNSIGNED_SHORT, 0);
    },
    dispose,
  };
}

// A small depth buffer gives software-only browsers the same side, head and
// tail views. The image buffer is reused and its resolution is capped.
function software(canvas, shape, skin) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const atlas = document.createElement("canvas");
  atlas.width = textureWidth;
  atlas.height = textureHeight;
  const textureContext = atlas.getContext("2d");
  textureContext.drawImage(skin, 0, 0);
  const tex = textureContext.getImageData(0, 0, textureWidth, textureHeight).data;
  const points = new Float32Array((shape.vertices.length / 8) * 4);
  let image, depth;
  return {
    draw(clip, width, height, haze) {
      if (!image || image.width !== width || image.height !== height) {
        image = ctx.createImageData(width, height);
        depth = new Float32Array(width * height);
      }
      image.data.fill(0);
      depth.fill(Infinity);
      for (let i = 0; i < clip.length; i += 4) {
        points[i] = (clip[i] * 0.5 + 0.5) * width;
        points[i + 1] = (0.5 - clip[i + 1] * 0.5) * height;
        points[i + 2] = clip[i + 2];
        points[i + 3] = clip[i + 3];
      }
      const pixel = image.data,
        ids = shape.indices,
        verts = shape.vertices;
      for (let tri = 0; tri < ids.length; tri += 3) {
        const A = ids[tri] * 4,
          B = ids[tri + 1] * 4,
          C = ids[tri + 2] * 4;
        const x = points[A],
          y = points[A + 1],
          bx = points[B] - x,
          by = points[B + 1] - y,
          cx = points[C] - x,
          cy = points[C + 1] - y,
          d = bx * cy - by * cx;
        if (Math.abs(d) < 0.005) continue;
        const xmin = Math.max(0, Math.floor(x + Math.min(0, bx, cx))),
          xmax = Math.min(width - 1, Math.ceil(x + Math.max(0, bx, cx)));
        const ymin = Math.max(0, Math.floor(y + Math.min(0, by, cy))),
          ymax = Math.min(height - 1, Math.ceil(y + Math.max(0, by, cy)));
        const u0 = verts[A * 2 + 6],
          v0 = verts[A * 2 + 7],
          u1 = verts[B * 2 + 6] - u0,
          u2 = verts[C * 2 + 6] - u0,
          v1 = verts[B * 2 + 7] - v0,
          v2 = verts[C * 2 + 7] - v0;
        for (let py = ymin; py <= ymax; py++) {
          let b = ((xmin + 0.5 - x) * cy - (py + 0.5 - y) * cx) / d,
            c = ((py + 0.5 - y) * bx - (xmin + 0.5 - x) * by) / d;
          for (let px = xmin; px <= xmax; px++, b += cy / d, c -= by / d) {
            if (b < 0 || c < 0 || b + c > 1) continue;
            const a = 1 - b - c,
              z = a * points[A + 2] + b * points[B + 2] + c * points[C + 2],
              i = py * width + px;
            if (z > depth[i]) continue;
            depth[i] = z;
            const tu = Math.max(
              0,
              Math.min(textureWidth - 1, ((u0 + b * u1 + c * u2) * textureWidth) | 0),
            );
            const tv = Math.max(
              0,
              Math.min(textureHeight - 1, ((v0 + b * v1 + c * v2) * textureHeight) | 0),
            );
            const k = 4 * (tu + tv * textureWidth),
              q = 4 * i,
              light = (a * points[A + 3] + b * points[B + 3] + c * points[C + 3]) * (1 - haze);
            pixel[q] = tex[k] * light + 14 * haze;
            pixel[q + 1] = tex[k + 1] * light + 50 * haze;
            pixel[q + 2] = tex[k + 2] * light + 56 * haze;
            pixel[q + 3] = 255;
          }
        }
      }
      ctx.putImageData(image, 0, 0);
    },
    dispose() {},
  };
}

function pose(shape, points, seconds, width, height, pointerX, pointerY) {
  const course = sharkCourse(seconds);
  const yaw = course.yaw + pointerX * 0.095,
    pitch = course.pitch - pointerY * 0.07;
  const C = Math.cos(yaw),
    S = Math.sin(yaw),
    P = Math.cos(pitch),
    Q = Math.sin(pitch);
  const B = Math.cos(course.bank),
    T = Math.sin(course.bank);
  const H = Math.cos(course.elevation),
    D = Math.sin(course.elevation);
  // Columns of the body-to-camera matrix include the curve's bank and pitch.
  const transform = [
    C * P,
    Q,
    S * P,
    -C * Q * B - S * T,
    P * B,
    -S * Q * B + C * T,
    C * Q * T - S * B,
    -P * T,
    S * Q * T + C * B,
  ];
  const scale = Math.min(width * 0.319, height * 0.55) * (0.655 + 0.39 * course.depth);
  const phase = seconds * 2.78 + 0.24 * Math.sin(seconds * 0.83);
  let lastX = NaN,
    bend = 0,
    derivative = 0;
  for (let i = 0, j = 0; i < shape.vertices.length; i += 8, j += 4) {
    const v = shape.vertices;
    const x = v[i];
    if (x !== lastX) {
      const s = Math.max(0, Math.min(1.1, (1.14 - x) / 2.26));
      const power = s * s * s,
        wave = phase - 6 * s;
      bend = 0.29 * power * Math.sin(wave);
      derivative = (-0.29 * (3 * s * s * Math.sin(wave) - 6 * power * Math.cos(wave))) / 2.26;
      lastX = x;
    }
    const bodyY = v[i + 1],
      bodyZ = v[i + 2] + bend;
    const X = transform[0] * x + transform[3] * bodyY + transform[6] * bodyZ;
    const Y = transform[1] * x + transform[4] * bodyY + transform[7] * bodyZ;
    const Z = transform[2] * x + transform[5] * bodyY + transform[8] * bodyZ;
    const screenY = Z * D - Y * H,
      near = Z * H + Y * D,
      perspective = 6.4 / (6.4 - near);
    points[j] = 2 * (course.x - 0.5 + (X * perspective * scale) / width);
    points[j + 1] = 2 * (0.5 - course.y - (screenY * perspective * scale) / height);
    points[j + 2] = -near * 0.43;
    const nx = v[i + 3] - derivative * v[i + 5],
      ny = v[i + 4],
      nz = v[i + 5];
    const wx = transform[0] * nx + transform[3] * ny + transform[6] * nz;
    const wy = transform[1] * nx + transform[4] * ny + transform[7] * nz;
    const wz = transform[2] * nx + transform[5] * ny + transform[8] * nz;
    const unit = 1 / (Math.sqrt(nx * nx + ny * ny + nz * nz) || 1);
    const lit = Math.max(0, (-0.27 * wx + 0.79 * wy + 0.49 * wz) * unit);
    const glint = Math.max(0, Math.min(1, (-0.15 * wx + 0.63 * wy + 0.75 * wz) * unit));
    points[j + 3] = 0.68 + 0.39 * lit + 0.14 * Math.pow(glint, 12);
  }
  // Keep the entire silhouette in view, including the swept tail on near passes.
  let left = 1,
    right = -1,
    top = -1,
    bottom = 1;
  for (let j = 0; j < points.length; j += 4) {
    left = Math.min(left, points[j]);
    right = Math.max(right, points[j]);
    bottom = Math.min(bottom, points[j + 1]);
    top = Math.max(top, points[j + 1]);
  }
  const pad = 0.052,
    dx = Math.max(0, -1 + pad - left) - Math.max(0, right - 1 + pad);
  const dy = Math.max(0, -1 + pad - bottom) - Math.max(0, top - 1 + pad);
  if (dx || dy)
    for (let j = 0; j < points.length; j += 4) {
      points[j] += dx;
      points[j + 1] += dy;
    }
  return 0.035 + (1 - course.depth) * 0.22;
}

export default function WhaleShark({ paused, className }) {
  const hostRef = useRef(null),
    activeRef = useRef(null),
    pauseRef = useRef(paused);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    pauseRef.current = paused;
    activeRef.current?.();
  }, [paused]);
  useEffect(() => {
    const host = hostRef.current;
    let visible = false,
      frame = 0,
      last = null,
      elapsed = 0,
      renderer,
      shape,
      points,
      canvas,
      gl,
      first = true,
      disposed = false;
    let pointerX = 0,
      pointerY = 0,
      targetX = 0,
      targetY = 0;
    const material = new Image();
    let materialRequested = false,
      materialReady = false;
    const pointer = matchMedia("(pointer:fine) and (hover:hover)");
    function paint(dt) {
      elapsed += dt;
      const ease = 1 - Math.exp(-dt * 1.3);
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;
      const { width, height } = canvas;
      const haze = pose(shape, points, elapsed, width, height, pointerX, pointerY);
      renderer.draw(points, width, height, haze);
      if (first) {
        first = false;
        setReady(true);
      }
    }
    function resize() {
      if (!renderer) return;
      const { width, height } = host.getBoundingClientRect();
      const dpr = Math.min(
        devicePixelRatio || 1,
        gl ? 1.65 : 1,
        (gl ? 1500 : 590) / Math.max(1, width),
      );
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      paint(0);
    }
    function start() {
      canvas = document.createElement("canvas");
      gl = canvas.getContext("webgl", {
        alpha: true,
        depth: true,
        antialias: true,
        powerPreference: "low-power",
      });
      if (gl) {
        shape = buildSharkShape();
        renderer = hardware(gl, shape, material);
      }
      if (!renderer) {
        if (gl) {
          canvas = document.createElement("canvas");
          gl = null;
        }
        shape = buildSharkShape(true);
        renderer = software(canvas, shape, material);
      }
      if (!renderer) return;
      points = new Float32Array((shape.vertices.length / 8) * 4);
      host.appendChild(canvas);
      canvas.addEventListener("webglcontextlost", onLoss);
      resize();
    }
    function tick(ts) {
      frame = 0;
      if (!visible || pauseRef.current || document.hidden || disposed) return;
      if (last === null || ts - last >= 1000 / (gl ? 36 : 24) - 1) {
        const dt = last === null ? 0 : Math.min(0.12, (ts - last) / 1000);
        last = ts;
        paint(dt);
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (!visible || pauseRef.current || document.hidden || disposed) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = null;
        return;
      }
      if (!materialRequested) {
        materialRequested = true;
        material.onload = material.onerror = () => {
          materialReady = true;
          sync();
        };
        material.src = "/assets/atlas/shark-skin.webp";
      }
      if (!materialReady || !material.naturalWidth) return;
      if (!renderer) start();
      if (renderer && !frame) frame = requestAnimationFrame(tick);
    }
    function onLoss() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = null;
      setReady(false);
      first = true;
      canvas.removeEventListener("webglcontextlost", onLoss);
      canvas.remove();
      renderer?.dispose();
      renderer = null;
      // Re-enter on the next visibility or motion event; a still plate remains readable.
    }
    function steer(e) {
      if (!visible || pauseRef.current || e.pointerType !== "mouse" || !pointer.matches) return;
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      targetX = x < 0 || x > 1 ? 0 : 2 * x - 1;
      targetY = y < 0 || y > 1 ? 0 : 2 * y - 1;
    }
    const visibility = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    const size = new ResizeObserver(resize);
    visibility.observe(host);
    size.observe(host);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pointermove", steer, { passive: true });
    activeRef.current = sync;
    return () => {
      disposed = true;
      material.onload = material.onerror = null;
      activeRef.current = null;
      cancelAnimationFrame(frame);
      size.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", steer);
      canvas?.removeEventListener("webglcontextlost", onLoss);
      canvas?.remove();
      renderer?.dispose();
    };
  }, []);
  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      className={`swimming-animal swimming-whale ${className}`}
      data-animated={ready || undefined}
    >
      <svg className="swimming-animal__poster" viewBox="595 -70 1450 890">
        <image href="/assets/atlas/shark-layer.webp" width="1923" height="818" />
      </svg>
    </span>
  );
}
