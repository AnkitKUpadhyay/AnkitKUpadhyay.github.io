// Coordinates describe the center of the water column (x/y) and distance
// from the far side of the loop (depth). Heading comes from its tangent.
export function sharkCourse(seconds) {
  const a = seconds * 0.255 - 0.52 + 0.045 * Math.sin(seconds * 0.48);
  const x = 0.505 + 0.232 * Math.sin(a) + 0.017 * Math.sin(2 * a - 0.45);
  const y = 0.466 + 0.117 * Math.cos(a - 0.25) + 0.052 * Math.sin(2 * a + 0.15);
  const depth = 0.5 + 0.5 * Math.cos(a + 0.1);
  const dx = 0.232 * Math.cos(a) + 0.034 * Math.cos(2 * a - 0.45);
  const dz = -0.23 * Math.sin(a + 0.1);
  const dy = (-0.117 * Math.sin(a - 0.25) + 0.104 * Math.cos(2 * a + 0.15)) / 1.68;
  const yaw = Math.atan2(dz, dx);
  const elevation = 0.39;
  const pitch = Math.max(
    -0.34,
    Math.min(0.34, Math.atan2(dz * Math.sin(elevation) - dy, Math.hypot(dx, dz))),
  );
  const bank = -0.15 - 0.2 * Math.sin(a) * Math.sin(a) + 0.055 * Math.sin(seconds * 0.91);
  return { x, y, depth, yaw, pitch, bank, elevation };
}
