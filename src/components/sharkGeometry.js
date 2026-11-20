const TAU = Math.PI * 2;
export const textureWidth = 1024;
export const textureHeight = 768;
const skinHeight = 498;

// Measured along the nose-to-peduncle axis, with separate half-width and half-height.
// The broad, shallow anterior section gives a whale shark its distinctive square snout.
const sections = [
  [0, 0.008, 0.008],
  [0.006, 0.102, 0.034],
  [0.018, 0.189, 0.063],
  [0.043, 0.259, 0.102],
  [0.09, 0.307, 0.135],
  [0.16, 0.337, 0.174],
  [0.27, 0.325, 0.217],
  [0.38, 0.291, 0.229],
  [0.51, 0.238, 0.204],
  [0.66, 0.165, 0.15],
  [0.8, 0.104, 0.097],
  [0.91, 0.063, 0.067],
  [0.98, 0.041, 0.051],
  [1, 0.03, 0.045],
];
function breadth(s, dim) {
  let i = 0;
  while (i < sections.length - 2 && s > sections[i + 1][0]) i++;
  const a = sections[i],
    b = sections[i + 1],
    span = b[0] - a[0],
    t = (s - a[0]) / span;
  const prev = sections[Math.max(0, i - 1)],
    next = sections[Math.min(sections.length - 1, i + 2)];
  const da = (b[dim] - prev[dim]) / (b[0] - prev[0]);
  const db = (next[dim] - a[dim]) / (next[0] - a[0]);
  return (
    (2 * t * t * t - 3 * t * t + 1) * a[dim] +
    (t * t * t - 2 * t * t + t) * span * da +
    (-2 * t * t * t + 3 * t * t) * b[dim] +
    (t * t * t - t * t) * span * db
  );
}
const axialX = (s) => 1.14 - 2.03 * s;
const axialY = (s) => 0.026 * Math.sin(Math.PI * s * 1.4) - 0.018 * s;
const skinUV = (s, t) => [s, (2 + t * (skinHeight - 4)) / textureHeight];
const finUV = (u, v) => [u * 0.91, (512 + v * 233) / textureHeight];
const paintUV = (color) => [(988 + color * 7) / textureWidth, 750 / textureHeight];
const rows = (n) => Array.from({ length: n + 1 }, (_, i) => i / n);
const vec = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (a) => {
  const l = Math.hypot(...a) || 1;
  return a.map((v) => v / l);
};

export function buildSharkShape(coarse = false) {
  const vertices = [],
    indices = [];
  // Vertex fields: position xyz, outward normal xyz, texture uv.
  function point(p, n, uv) {
    vertices.push(...p, ...n, ...uv);
    return vertices.length / 8 - 1;
  }
  function patch(us, vs, evaluate, uvAt, outward) {
    const base = vertices.length / 8;
    for (const u of us)
      for (const v of vs) {
        const p = evaluate(u, v);
        const tangent = vec(
          evaluate(Math.min(1, u + 0.0002), v),
          evaluate(Math.max(0, u - 0.0002), v),
        );
        const flank = vec(
          evaluate(u, Math.min(1, v + 0.0002)),
          evaluate(u, Math.max(0, v - 0.0002)),
        );
        const n = unit(cross(tangent, flank));
        if (outward(n, u, v, p) < 0) for (let d = 0; d < 3; d++) n[d] *= -1;
        point(p, n, uvAt(u, v));
      }
    for (let i = 0; i < us.length - 1; i++)
      for (let j = 0; j < vs.length - 1; j++) {
        const a = base + i * vs.length + j,
          b = a + vs.length;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
  }
  function skin(s, t) {
    const a = (t - 0.5) * TAU;
    const top = Math.cos(a),
      side = Math.sin(a);
    return [axialX(s), axialY(s) + breadth(s, 2) * top, breadth(s, 1) * side];
  }
  const longitudinal = [...new Set([...sections.map((r) => r[0]), ...rows(coarse ? 26 : 58)])].sort(
    (a, b) => a - b,
  );
  patch(
    longitudinal,
    rows(coarse ? 19 : 42),
    skin,
    skinUV,
    (n, s, t, p) => n[1] * (p[1] - axialY(s)) + n[2] * p[2],
  );

  // Paired fins have a cambered top, a flatter underside and a swept leading edge.
  function pectoral(side, small = false) {
    for (const face of [-1, 1]) {
      patch(
        rows(13),
        rows(6),
        (span, chord) => {
          const lead = small ? -0.14 - 0.27 * span : 0.65 - 0.55 * span - 0.18 * span * span;
          const length = (small ? 0.21 : 0.45) * Math.pow(1 - span, 0.76) + 0.006;
          const x = lead - length * chord;
          const y =
            (small ? -0.115 : -0.066) -
            (small ? 0.09 : 0.22) * span +
            0.05 * Math.sin(Math.PI * span) +
            face * 0.018 * Math.sin(Math.PI * chord) * Math.sin(Math.PI * (0.12 + span * 0.82));
          const z = side * ((small ? 0.095 : 0.22) + (small ? 0.23 : 0.64) * span);
          return [x, y, z];
        },
        (span, chord) => finUV(span, chord),
        (n) => n[1] * face,
      );
    }
  }
  for (const side of [-1, 1]) {
    pectoral(side);
    pectoral(side, true);
  }
  // Anterior and posterior dorsals, anal fin, and the asymmetric caudal fork.
  function upright(rootLead, rootTrail, rootY, tipX, tipY, thickness, tail = false) {
    for (const face of [-1, 1]) {
      patch(
        rows(14),
        rows(7),
        (span, chord) => {
          const lead = rootLead + (tipX - rootLead) * span;
          const ray = Math.pow(1 - span, tail ? 0.86 : 0.69);
          const width = (rootLead - rootTrail) * ray + 0.005;
          const trailingCurve = tail
            ? 0.04 * Math.sin(span * Math.PI)
            : 0.025 * Math.sin(span * Math.PI * 1.4);
          return [
            lead - width * chord + trailingCurve * chord,
            rootY + (tipY - rootY) * span,
            face * thickness * (1 - span) * (0.15 + 0.85 * Math.sin(Math.PI * chord)),
          ];
        },
        (span, chord) => finUV(span, chord),
        (n) => n[2] * face,
      );
    }
  }
  upright(0.32, -0.19, 0.12, -0.075, 0.575, 0.035);
  upright(-0.445, -0.66, 0.065, -0.61, 0.213, 0.016);
  upright(-0.44, -0.62, -0.105, -0.62, -0.206, 0.013);
  upright(-0.795, -1.075, 0.006, -1.283, 0.584, 0.032, true);
  upright(-0.805, -1.075, 0.007, -1.182, -0.34, 0.032, true);

  // Locate lips on the anterior hull, from one corner of the mouth to the other.
  function snoutAt(z, y) {
    let l = 0,
      r = 0.153;
    for (let k = 0; k < 18; k++) {
      const s = (l + r) / 2;
      const d = (z / breadth(s, 1)) ** 2 + ((y - axialY(s)) / breadth(s, 2)) ** 2;
      if (d > 1) l = s;
      else r = s;
    }
    return axialX(r) + 0.0024;
  }
  for (const rim of [false, true]) {
    patch(
      rows(46),
      [0, 1],
      (u, v) => {
        const across = 2 * u - 1;
        const z = 0.284 * across,
          half = 0.002 + 0.009 * (1 - across ** 2);
        const y = -0.025 + 0.017 * across ** 2 + (rim ? -half - v * 0.004 : (2 * v - 1) * half);
        return [snoutAt(z, y), y, z];
      },
      () => paintUV(rim ? 1 : 0),
      (n) => n[0],
    );
  }
  function eye(px, py, pz, rx, ry, rz, color) {
    patch(
      rows(7),
      rows(14),
      (u, v) => {
        const a = (0.003 + 0.994 * u) * Math.PI,
          b = v * TAU;
        return [
          px + rx * Math.sin(a) * Math.cos(b),
          py + ry * Math.cos(a),
          pz + rz * Math.sin(a) * Math.sin(b),
        ];
      },
      () => paintUV(color),
      (n, u, v, p) => n[0] * (p[0] - px) + n[1] * (p[1] - py) + n[2] * (p[2] - pz),
    );
  }
  for (const side of [-1, 1]) {
    const s = 0.087,
      x = axialX(s),
      y = 0.008,
      z = side * breadth(s, 1);
    eye(x, y, z, 0.028, 0.023, 0.011, 1);
    eye(x + 0.002, y, z + side * 0.007, 0.02, 0.018, 0.011, 2);
    eye(x + 0.012, y + 0.008, z + side * 0.016, 0.004, 0.004, 0.002, 3);
  }
  return { vertices: Float32Array.from(vertices), indices: Uint16Array.from(indices) };
}
