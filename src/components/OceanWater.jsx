import React, { useEffect, useRef } from "react";
import { compileShader } from "./wildlifeMesh";
import "../ocean-water.css";

const artUrl = "/assets/atlas/ocean-background.webp";

// Each train has a different heading, wavelength and phase velocity. The same
// spectrum drives the refracted plate, the surface highlights and their light.
const waves = [
  { x: 0.91, y: 0.415, k: 3.1, a: 0.89, speed: 0.94, phase: 0.5 },
  { x: -0.43, y: 0.903, k: 4.2, a: 0.72, speed: 1.15, phase: 2.4 },
  { x: 0.27, y: 0.963, k: 5.3, a: 0.47, speed: -1.37, phase: 4.5 },
  { x: 0.86, y: -0.51, k: 7.6, a: 0.28, speed: -1.64, phase: 1.0 },
];

const vertexSource = `
  attribute vec2 point;
  varying vec2 uv;
  void main() {
    uv = vec2(0.5 + 0.5 * point.x, 0.5 - 0.5 * point.y);
    gl_Position = vec4(point, 0.0, 1.0);
  }
`;
const waveCalls = waves
  .map(
    (w) =>
      `wave(vec2(${w.x}, ${w.y}), ${w.k}, ${w.a}, ${w.speed}, ${w.phase.toFixed(1)}, p, slope, curvature);`,
  )
  .join("\n");
const fragmentSource = `
  precision mediump float;
  varying vec2 uv;
  uniform sampler2D plate;
  uniform vec4 frame;
  uniform float time;
  uniform float aspect;

  void wave(vec2 d, float k, float a, float rate, float start, vec2 p,
            inout vec2 slope, inout vec3 curvature) {
    float angle = k * dot(d, p) - rate * time + start;
    slope += d * (a / k) * sin(angle);
    curvature += vec3(d.x*d.x, d.x*d.y, d.y*d.y) * (a * cos(angle));
  }
  void main() {
    // A plane viewed from below compresses interference patterns towards the distance.
    vec2 p = vec2(uv.x * aspect * 4.7, uv.y * (12.0 + 5.0 * uv.y));
    p += vec2(0.37 * sin(0.7 * p.y + uv.x * 2.8), 0.42 * sin(0.83 * p.x - 0.63 * p.y));
    vec2 slope = vec2(0.0);
    vec3 curvature = vec3(0.0);
    ${waveCalls}

    // Where the projected area approaches zero neighboring rays concentrate.
    float area = abs((1.0 + curvature.x)*(1.0 + curvature.z) - curvature.y*curvature.y);
    float focus = 1.0 / (1.0 + 62.0 * area * area);
    float skin = exp(-uv.y * 5.5);
    float sun = 0.1 + 0.9*smoothstep(0.27, 0.96, uv.x + 0.19*(1.0-uv.y));
    vec2 current = vec2(sin(uv.y*7.5 + 0.46*time + sin(uv.x*4.2)), cos(uv.x*8.1 - 0.48*time));
    vec2 drift = 0.0034*current + slope*(0.011 + 0.012*skin);
    vec3 color = texture2D(plate, frame.zw + frame.xy * clamp(uv + drift, 0.002, 0.998)).rgb;

    // A moving ridge at the surface gates a shaft of light through the water column.
    float source = (uv.x + (0.28 + 0.06*uv.x) * uv.y / aspect)*7.0;
    float gather = sin(source*3.3 - 0.6*time + 1.9*sin(source*1.41 + 0.43*time))
                   + 0.63*sin(source*5.0 + 0.58*time) + 0.30*sin(source*8.3 - 0.73*time);
    float shaft = smoothstep(0.15, 1.86, gather)*exp(-2.0*uv.y)*sun;
    color *= 0.94 + 0.21*shaft + 0.07*skin*slope.y;
    color += vec3(0.27, 0.43, 0.37) * focus * skin * sun;
    color += vec3(0.11, 0.20, 0.17) * shaft;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function graphicWater(canvas, image) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, "point");
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  const frame = gl.getUniformLocation(program, "frame");
  const clock = gl.getUniformLocation(program, "time");
  const aspect = gl.getUniformLocation(program, "aspect");
  return {
    resize(width, height, box) {
      gl.viewport(0, 0, width, height);
      gl.uniform4fv(frame, box);
      gl.uniform1f(aspect, width / height);
    },
    draw(t) {
      gl.uniform1f(clock, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}

// Software rendering keeps the same folded light field. Precompute spatial
// phases once, then update a small illumination texture and refract the image in strips.
function softwareWater(canvas, image) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;
  const light = document.createElement("canvas");
  const paint = light.getContext("2d");
  if (!paint) return null;
  const rayDensity = 240;
  let crop, samples, weights, columnLight, rayAt, rays, pixels;
  return {
    resize(width, height, box) {
      crop = [
        box[2] * image.width,
        box[3] * image.height,
        box[0] * image.width,
        box[1] * image.height,
      ];
      light.width = Math.min(260, Math.ceil(width / 4));
      light.height = Math.min(122, Math.ceil(height / 5));
      pixels = paint.createImageData(light.width, light.height);
      const count = light.width * light.height;
      weights = new Float32Array(count);
      columnLight = new Float32Array(count);
      rayAt = new Uint16Array(count);
      rays = new Float32Array(Math.ceil((1 + (0.34 * height) / width) * rayDensity) + 1);
      samples = waves.map(() => new Float32Array(count * 2));
      for (let j = 0; j < light.height; j++)
        for (let i = 0; i < light.width; i++) {
          const n = j * light.width + i,
            u = i / light.width,
            v = j / light.height;
          const x = ((u * width) / height) * 4.7,
            y = v * (12 + 5 * v);
          const px = x + 0.37 * Math.sin(0.7 * y + u * 2.8),
            py = y + 0.42 * Math.sin(0.83 * x - 0.63 * y);
          const sun = Math.min(1, Math.max(0, (u + 0.19 * (1 - v) - 0.27) / 0.69));
          const illumination = 0.1 + 0.9 * sun * sun * (3 - 2 * sun);
          weights[n] = Math.exp(-5.5 * v) * illumination;
          columnLight[n] = Math.exp(-2 * v) * illumination;
          rayAt[n] = Math.round((u + ((0.28 + 0.06 * u) * v * height) / width) * rayDensity);
          waves.forEach((w, k) => {
            const angle = w.k * (w.x * px + w.y * py) + w.phase;
            samples[k][2 * n] = w.a * Math.cos(angle);
            samples[k][2 * n + 1] = w.a * Math.sin(angle);
          });
          pixels.data[n * 4] = 105;
          pixels.data[n * 4 + 1] = 163;
          pixels.data[n * 4 + 2] = 141;
        }
    },
    draw(t) {
      const { width: w, height: h } = canvas;
      const [sx, sy, sw, sh] = crop;
      const strips = Math.ceil(h / 4);
      for (let j = 0; j < strips; j++) {
        const y = j / strips;
        const shift = 0.006 * (Math.sin(y * 13 + t * 0.65) + 0.35 * Math.sin(y * 34 - t * 0.91));
        const sourceX = sx + sw * (0.014 + shift);
        ctx.drawImage(
          image,
          sourceX,
          sy + y * sh,
          sw * 0.972,
          sh / strips,
          0,
          y * h,
          w,
          h / strips + 1,
        );
      }
      const trig = waves.map((w) => [Math.cos(t * w.speed), Math.sin(t * w.speed)]);
      for (let j = 0; j < rays.length; j++) {
        const s = (j * 7) / rayDensity;
        const gathered =
          Math.sin(s * 3.3 - 0.6 * t + 1.9 * Math.sin(s * 1.41 + 0.43 * t)) +
          0.63 * Math.sin(s * 5 + 0.58 * t) +
          0.3 * Math.sin(s * 8.3 - 0.73 * t);
        const x = Math.min(1, Math.max(0, (gathered - 0.15) / 1.71));
        rays[j] = x * x * (3 - 2 * x);
      }
      for (let i = 0; i < weights.length; i++) {
        let xx = 1,
          xy = 0,
          yy = 1;
        for (let k = 0; k < waves.length; k++) {
          const d = waves[k],
            sample = samples[k];
          const a = trig[k][0] * sample[2 * i] + trig[k][1] * sample[2 * i + 1];
          xx += d.x * d.x * a;
          xy += d.x * d.y * a;
          yy += d.y * d.y * a;
        }
        const area = xx * yy - xy * xy;
        pixels.data[4 * i + 3] =
          (174 * weights[i]) / (1 + 36 * area * area) + 86 * columnLight[i] * rays[rayAt[i]];
      }
      paint.putImageData(pixels, 0, 0);
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(light, 0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    },
    dispose() {},
  };
}

export default function OceanWater({ paused }) {
  const stage = useRef(null);
  const control = useRef(null);
  useEffect(() => {
    const host = stage.current;
    const art = new Image();
    let canvas = null,
      renderer = null,
      raf = 0,
      last = null,
      time = 3.7;
    let visible = false,
      stopped = true,
      disposed = false,
      attempted = false,
      useSoftware = false;
    function release() {
      cancelAnimationFrame(raf);
      raf = 0;
      last = null;
      renderer?.dispose();
      canvas?.removeEventListener("webglcontextlost", lost);
      canvas?.remove();
      canvas = null;
      renderer = null;
    }
    function lost(event) {
      event.preventDefault();
      release();
      useSoftware = true;
      attempted = false;
      sync();
    }
    function allocate() {
      if (attempted || !art.complete || !art.naturalWidth) return;
      attempted = true;
      canvas = document.createElement("canvas");
      if (!useSoftware) renderer = graphicWater(canvas, art);
      if (!renderer) {
        useSoftware = true;
        canvas = document.createElement("canvas");
        renderer = softwareWater(canvas, art);
      }
      if (!renderer) return;
      canvas.addEventListener("webglcontextlost", lost);
      host.append(canvas);
      resize();
    }
    function resize() {
      if (!renderer) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(1, (useSoftware ? 870 : 1250) / Math.max(rect.width, rect.height));
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      const aspect = canvas.width / canvas.height,
        imageAspect = art.naturalWidth / art.naturalHeight;
      const x = Math.min(1, aspect / imageAspect),
        y = Math.min(1, imageAspect / aspect);
      renderer.resize(canvas.width, canvas.height, [
        x,
        y,
        (1 - x) * (rect.width < 760 ? 0.84 : 0.67),
        (1 - y) * 0.46,
      ]);
      renderer.draw(time);
    }
    function frame(ts) {
      raf = 0;
      if (stopped || !visible || document.hidden || disposed || !renderer) return;
      const interval = 1000 / (useSoftware ? 18 : 24);
      if (last === null || ts - last >= interval - 1) {
        time += last === null ? 0 : Math.min(0.12, (ts - last) / 1000);
        last = ts;
        renderer.draw(time);
      }
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      if (!disposed && !stopped && visible && !document.hidden) {
        allocate();
        if (renderer && !raf) raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = null;
      }
    }
    control.current = (pause) => {
      stopped = pause;
      sync();
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const sizing = new ResizeObserver(resize);
    intersection.observe(host);
    sizing.observe(host);
    document.addEventListener("visibilitychange", sync);
    art.onload = sync;
    art.src = artUrl;
    return () => {
      disposed = true;
      control.current = null;
      intersection.disconnect();
      sizing.disconnect();
      document.removeEventListener("visibilitychange", sync);
      art.onload = null;
      release();
    };
  }, []);
  useEffect(() => {
    control.current?.(paused);
  }, [paused]);
  return <div ref={stage} className="ocean-water" aria-hidden="true" />;
}
