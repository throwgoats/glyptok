
// Assigns a color to each article, avoiding recent repeats
export function assignArticleColors(
  articles: number[],
  prev: { [key: number]: string },
  totalColors: number = 32,
  avoidCount: number = 4
): { [key: number]: string } {
  const updated = { ...prev };
  let changed = false;
  // Track the last avoidCount color indices used
  const recentIndices: number[] = Object.values(updated)
    .map((color) => {
      // Extract hue from oklch string
      const match = color.match(/oklch\([^ ]+ [^ ]+ ([^\)]+)\)/);
      return match ? parseFloat(match[1]) : -1;
    })
    .map((hue) => {
      // Map hue back to index
      return Math.round((hue / 360) * totalColors) % totalColors;
    })
    .filter((idx) => idx >= 0);

  articles.forEach((articleNumber) => {
    if (!(articleNumber in updated)) {
      const idx = getRandomColorIndex(totalColors, recentIndices, avoidCount);
      updated[articleNumber] = getColor(idx, totalColors);
      recentIndices.push(idx);
      if (recentIndices.length > avoidCount) recentIndices.shift();
      changed = true;
    }
  });
  return changed ? updated : prev;
}

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
