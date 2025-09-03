"use client";


import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.scss";
import { getColor, getRandomColorIndex } from "./colors";

export default function Home() {
  const [articles, setArticles] = useState([1, 2]);
  const [articleColors, setArticleColors] = useState<{ [key: number]: string }>({});
  const observer = useRef<IntersectionObserver | null>(null);

  const totalColors = 32;
  const avoidCount = 4; // Number of recent colors to avoid repeating
  // Helper to get a color for a given index
  const getColorForIndex = (index: number) => getColor(index, totalColors);

  // Assign a random color to a new article, avoiding repeats within the last avoidCount
  useEffect(() => {
    setArticleColors((prev) => {
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
    });
  }, [articles]);

  const lastArticleRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setArticles((prevArticles) => [...prevArticles, prevArticles.length + 1]);
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

  return (
    <section className={styles.container}>
      {articles.map((articleNumber, index) => {
        const bgColor = articleColors[articleNumber] || getColorForIndex(index);
        if (index + 1 === articles.length) {
          return (
            <article
              key={articleNumber}
              ref={lastArticleRef}
              style={{ background: bgColor }}
            >
              <h1>{articleNumber}</h1>
            </article>
          );
        }
        return (
          <article key={articleNumber} style={{ background: bgColor }}>
            <h1>{articleNumber}</h1>
          </article>
        );
      })}
    </section>
  );
}
