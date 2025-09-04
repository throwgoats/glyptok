import { getColor, getRandomColorIndex, assignArticleColors } from "../app/colors";

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

describe("assignArticleColors", () => {
  it("should assign a color for each article", () => {
    const articles = [101, 102, 103];
    const prev: { [key: number]: string } = {};
    const result = assignArticleColors(articles, prev, 8, 2);
    expect(Object.keys(result)).toHaveLength(3);
    articles.forEach((a) => {
      expect(result[a]).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
    });
  });

  it("should not change prev if all articles already have colors", () => {
    const prev = { 1: "oklch(0.75 0.43 0)", 2: "oklch(0.75 0.43 45)" };
    const articles = [1, 2];
    const result = assignArticleColors(articles, prev, 8, 2);
    expect(result).toBe(prev);
  });

  it("should avoid recent color indices when assigning new colors", () => {
    const prev = {
      1: "oklch(0.75 0.43 0)",
      2: "oklch(0.75 0.43 45)",
      3: "oklch(0.75 0.43 90)",
      4: "oklch(0.75 0.43 135)",
    };
    const articles = [1, 2, 3, 4, 5];
    const result = assignArticleColors(articles, prev, 8, 4);
    // The new color for article 5 should not reuse the last 4 hues
    const usedHues = Object.values(prev).map((c) => {
      const m = c.match(/oklch\([^ ]+ [^ ]+ ([^\)]+)\)/);
      return m ? m[1] : "";
    });
    const newColor = result[5];
    const newHue = newColor.match(/oklch\([^ ]+ [^ ]+ ([^\)]+)\)/)?.[1];
    expect(usedHues).not.toContain(newHue);
  });

  it("should assign colors to only new articles", () => {
    const prev = { 1: "oklch(0.75 0.43 0)" };
    const articles = [1, 2, 3];
    const result = assignArticleColors(articles, prev, 8, 2);
    expect(result[1]).toBe(prev[1]);
    expect(result[2]).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
    expect(result[3]).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
  });

  it("should handle empty articles array", () => {
    const prev = { 1: "oklch(0.75 0.43 0)" };
    const articles: number[] = [];
    const result = assignArticleColors(articles, prev, 8, 2);
    expect(result).toBe(prev);
  });
});
