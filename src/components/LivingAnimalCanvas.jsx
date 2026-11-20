import React, { useEffect, useRef, useState } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_uv;
  uniform float u_time;
  uniform vec2 u_pointer;
  uniform int u_mode;
  uniform float u_aspect;
  varying vec2 v_uv;

  vec2 rotateAround(vec2 p, vec2 pivot, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    vec2 d = p - pivot;
    return pivot + vec2(d.x * c - d.y * s, d.x * s + d.y * c);
  }

  void main() {
    v_uv = a_uv;
    vec2 uv = a_uv;

    if (u_mode == 0) {
      // WHALE SHARK: head (0.90, 0.72) -> tail (0.43, 0.16) carangiform wave
      vec2 p = vec2(uv.x * u_aspect, uv.y);
      vec2 head = vec2(0.90 * u_aspect, 0.72);
      vec2 tail = vec2(0.43 * u_aspect, 0.16);
      vec2 spine = tail - head;
      float L = length(spine);
      vec2 ax = spine / L;
      vec2 nx = vec2(-ax.y, ax.x);

      float s = clamp(dot(p - head, ax) / L, 0.0, 1.18);
      // Traveling biological swim wave propagating smoothly head -> tail
      float wave = sin(s * 5.1 - u_time * 1.65);
      float lateral = wave * 0.036 * pow(s, 1.82);

      // Gentle pectoral fin feathering (lower-left fin around u=0.56, v=0.69)
      float pecDist = length((uv - vec2(0.56, 0.69)) / vec2(0.11, 0.13));
      float pecMask = smoothstep(1.15, 0.2, pecDist);
      float pecFeather = sin(u_time * 1.15 - 1.0) * 0.012 * pecMask;

      // Calm buoyant vertical heave + soft pointer current response
      float heave = sin(u_time * 0.62) * 0.011;
      vec2 drift = vec2(u_pointer.x * 0.008, u_pointer.y * 0.011 + heave);

      p += nx * lateral + vec2(0.0, pecFeather);
      uv = vec2(p.x / u_aspect, p.y) + drift;
    } else if (u_mode == 1) {
      // SEA TURTLE: rigid carapace + rhythmic figure-8 front flipper strokes
      // Scale slightly inside quad so sweeping flipper tips never clip bounds
      vec2 center = vec2(0.50, 0.50);
      vec2 pos = uv;

      vec2 shellCenter = vec2(0.525, 0.51);
      float shellDist = length((uv - shellCenter) / vec2(0.285, 0.305));
      float outsideShell = smoothstep(0.92, 1.12, shellDist);

      // Asymmetric underwater flight stroke (graceful downstroke + calm glide)
      float phi = u_time * 1.48;

      // Left front flipper: shoulder (0.29, 0.36) -> tip down-left (0.06, 0.77)
      float leftZone = outsideShell * smoothstep(0.32, 0.22, uv.x) * smoothstep(0.26, 0.37, uv.y);
      float leftDist = clamp(length(uv - vec2(0.29, 0.36)) / 0.45, 0.0, 1.0);
      float leftPhase = phi - leftDist * 1.6;
      float leftStroke = (sin(leftPhase) + 0.22 * sin(2.0 * leftPhase - 0.45)) * 0.19 * leftZone;
      pos = rotateAround(pos, vec2(0.29, 0.36), leftStroke);

      // Right front flipper: shoulder (0.47, 0.22) -> tip upper-right (0.91, 0.16)
      float rightZone = outsideShell * smoothstep(0.42, 0.53, uv.x) * smoothstep(0.30, 0.19, uv.y);
      float rightDist = clamp(length(uv - vec2(0.47, 0.22)) / 0.46, 0.0, 1.0);
      float rightPhase = phi - rightDist * 1.6;
      float rightStroke = -(sin(rightPhase) + 0.22 * sin(2.0 * rightPhase - 0.45)) * 0.19 * rightZone;
      pos = rotateAround(pos, vec2(0.47, 0.22), rightStroke);

      // Subtle rear flippers rudder in gentle counter-phase
      float rearZone = outsideShell * smoothstep(0.70, 0.80, uv.y) * smoothstep(0.46, 0.58, uv.x);
      float rearAngle = sin(phi + 1.4) * 0.055 * rearZone;
      pos = rotateAround(pos, vec2(0.66, 0.72), rearAngle);

      // Rhythmic forward glide propulsion synchronized to power stroke
      vec2 fwd = normalize(vec2(-0.66, -0.75));
      float surge = cos(phi - 0.9) * 0.013;
      float sway = sin(u_time * 0.55) * 0.008;
      pos += fwd * surge + vec2(-fwd.y, fwd.x) * sway;

      // Gentle 0.87 padding inside quad for full flipper sweep headroom
      uv = center + (pos - center) * 0.87;
    } else if (u_mode == 2) {
      // GREVY'S ZEBRA: grounded hooves, diagonal-isolated tail swish, calm breathing & alert head
      vec2 p = vec2(uv.x * u_aspect, uv.y);
      float groundLock = smoothstep(0.84, 0.65, uv.y);

      // Hanging tail on left separated cleanly along diagonal line from hind leg
      float tailSep = 0.526 - max(0.0, uv.y - 0.44) * 0.145;
      float tailMask =
        smoothstep(tailSep + 0.010, tailSep - 0.012, uv.x) *
        smoothstep(0.43, 0.50, uv.y) *
        smoothstep(0.81, 0.73, uv.y);
      float tLen = clamp((uv.y - 0.44) / 0.32, 0.0, 1.0);
      float swishBurst = pow(0.5 + 0.5 * sin(u_time * 0.42), 3.0);
      float swish = sin(u_time * 3.1 - tLen * 3.0) * (0.006 + 0.022 * swishBurst) * pow(tLen, 1.45) * tailMask;
      p.x += swish;

      // Calm ribcage breathing along torso
      float torsoDist = length((uv - vec2(0.64, 0.49)) / vec2(0.11, 0.14));
      float torsoMask = smoothstep(1.0, 0.15, torsoDist) * groundLock;
      p.y += sin(u_time * 1.35) * 0.0038 * torsoMask;

      // Subtle dignified neck & head micro-posture pivoting at withers (0.70, 0.44)
      float headMask = smoothstep(0.67, 0.74, uv.x) * smoothstep(0.52, 0.36, uv.y) * groundLock;
      vec2 withers = vec2(0.70 * u_aspect, 0.44);
      float headNod = (sin(u_time * 0.58) * 0.015 + sin(u_time * 1.18 + 0.7) * 0.004) * headMask;
      p = rotateAround(p, withers, headNod);

      uv = vec2(p.x / u_aspect, p.y);
    }

    vec2 ndc = vec2(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
    gl_Position = vec4(ndc, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_tex;
  uniform float u_time;
  uniform int u_mode;
  varying vec2 v_uv;

  void main() {
    vec4 tex = texture2D(u_tex, v_uv);
    if (tex.a < 0.004) discard;

    if (u_mode == 0) {
      // Soft sunlit oceanic caustics dancing gently over the whale shark's dorsal surface
      float c1 = sin(v_uv.x * 24.0 + v_uv.y * 12.0 - u_time * 1.05);
      float c2 = sin(v_uv.x * 16.0 - v_uv.y * 18.0 + u_time * 0.78);
      float caustic = pow(max(0.0, (c1 + c2) * 0.5), 3.0);
      float sunlit = smoothstep(0.76, 0.18, v_uv.y) * smoothstep(0.42, 0.92, v_uv.x);
      vec3 glow = vec3(0.68, 0.95, 0.89) * caustic * sunlit * 0.14 * tex.a;
      tex.rgb += glow;
    } else if (u_mode == 1) {
      // Subtle sunlit shallow-water shimmer across the turtle's carapace
      float shimmer = pow(max(0.0, sin(v_uv.x * 14.0 + v_uv.y * 11.0 - u_time * 1.15)), 4.0);
      tex.rgb += vec3(0.72, 0.96, 0.88) * shimmer * 0.08 * tex.a;
    } else if (u_mode == 2) {
      // Whisper-warm golden morning savanna sunlight breathing softly along mane & back
      float pulse = 0.5 + 0.5 * sin(u_time * 0.55);
      float rim = smoothstep(0.68, 0.22, v_uv.y) * smoothstep(0.50, 0.82, v_uv.x);
      tex.rgb += vec3(1.0, 0.76, 0.36) * rim * (0.03 + 0.035 * pulse) * tex.a;
    }

    gl_FragColor = tex;
  }
`;

const MODE_MAP = { shark: 0, turtle: 1, zebra: 2 };

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildGrid(cols, rows) {
  const verts = [];
  const indices = [];
  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      verts.push(u, v);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i0 = r * (cols + 1) + c;
      const i1 = i0 + 1;
      const i2 = i0 + (cols + 1);
      const i3 = i2 + 1;
      indices.push(i0, i1, i2, i1, i3, i2);
    }
  }
  return {
    vertices: new Float32Array(verts),
    indices: new Uint16Array(indices),
  };
}

export default function LivingAnimalCanvas({
  src,
  mode = "shark",
  width,
  height,
  className = "",
  paused = false,
  interactivePointer = false,
}) {
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
      }) || canvas.getContext("experimental-webgl");

    if (!gl) {
      setFallback(true);
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setFallback(true);
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }

    const cols = mode === "turtle" ? 36 : 52;
    const rows = mode === "turtle" ? 36 : 26;
    const { vertices, indices } = buildGrid(cols, rows);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const aUv = gl.getAttribLocation(program, "a_uv");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uMode = gl.getUniformLocation(program, "u_mode");
    const uAspect = gl.getUniformLocation(program, "u_aspect");
    const uTex = gl.getUniformLocation(program, "u_tex");

    let disposed = false;
    let ready = false;
    let visible = true;
    let raf = 0;
    let elapsed = 0;
    let lastTs = 0;
    let aspect = width / height;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function renderFrame(ts) {
      raf = 0;
      if (disposed || !ready) return;

      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      if (!pausedRef.current) {
        elapsed += dt;
      }

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uTex, 0);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1i(uMode, MODE_MAP[mode] ?? 0);
      gl.uniform1f(uAspect, aspect);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      if (visible && !pausedRef.current) {
        raf = requestAnimationFrame(renderFrame);
      }
    }

    function kick() {
      if (disposed || !ready) return;
      lastTs = 0;
      if (!raf) raf = requestAnimationFrame(renderFrame);
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (disposed) return;
      aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
      const maxDim = mode === "turtle" ? 700 : 1440;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      ready = true;
      kick();
    };
    img.onerror = () => setFallback(true);
    img.src = src;

    function onPointer(e) {
      pointer.tx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointer.ty = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      },
      { rootMargin: "120px" },
    );
    observer.observe(canvas);
    canvas.addEventListener("animal-wake", kick);

    if (interactivePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("animal-wake", kick);
      if (interactivePointer) {
        window.removeEventListener("pointermove", onPointer);
      }
      gl.deleteTexture(texture);
      gl.deleteBuffer(vbo);
      gl.deleteBuffer(ibo);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, mode, width, height, interactivePointer]);

  // Wake up animation smoothly if user clicks Play after Pause
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;
    // Trigger scroll eventless repaint by toggling attribute watched via mount?
    // Wait: let's handle paused changes cleanly inside the main effect by dispatching a custom wake event!
    canvas.dispatchEvent(new Event("animal-wake"));
  }, [paused]);

  if (fallback) {
    return (
      <img
        className={className}
        src={src}
        width={width}
        height={height}
        alt=""
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={width}
      height={height}
      aria-hidden="true"
    />
  );
}
