// color palette generator
export function getColor(index: number, total: number = 32) {
  const lightness = 0.75;
  const chroma = 0.43;
  const step = 360 / total;
  const hue = (index * step) % 360;
  return `oklch(${lightness} ${chroma} ${hue})`;
}

// random color picker
export function getRandomColorIndex(total: number, recent: number[], avoidCount: number = 4): number {
  const avoidSet = new Set(recent.slice(-avoidCount));
  const available = [];
  for (let i = 0; i < total; i++) {
    if (!avoidSet.has(i)) available.push(i);
  }
  if (available.length === 0) {
    // fallback: all indices are in recent, so allow all
    for (let i = 0; i < total; i++) available.push(i);
  }
  const idx = Math.floor(Math.random() * available.length);
  return available[idx];
}
