import { getColor, getRandomColorIndex } from "../app/colors";

describe("getColor", () => {
  it("should return a valid oklch color string", () => {
    const color = getColor(0);
    expect(color).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
  });

  it("should return different hues for different indices", () => {
    const color1 = getColor(0);
    const color2 = getColor(1);
    expect(color1).not.toBe(color2);
  });
});

describe("getRandomColorIndex", () => {
  it("should not return a recent index if avoidCount allows", () => {
    const total = 8;
    const recent = [1, 2, 3, 4];
    const avoidCount = 4;
    for (let i = 0; i < 10; i++) {
      const idx = getRandomColorIndex(total, recent, avoidCount);
      expect(recent.slice(-avoidCount)).not.toContain(idx);
    }
  });

  it("should return any index if all are in recent", () => {
    const total = 4;
    const recent = [0, 1, 2, 3];
    const avoidCount = 4;
    const idx = getRandomColorIndex(total, recent, avoidCount);
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(total);
  });
});
