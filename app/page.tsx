"use client";


import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.scss";
import colors from "./colors";

export default function Home() {
  const [articles, setArticles] = useState([1, 2]);
  const [articleColors, setArticleColors] = useState<{ [key: number]: string }>({});
  const observer = useRef<IntersectionObserver | null>(null);

  // Helper to get a random color from the colors array
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  // Assign a color to a new article if it doesn't have one
  useEffect(() => {
    setArticleColors((prev) => {
      const updated = { ...prev };
      let changed = false;
      articles.forEach((articleNumber) => {
        if (!(articleNumber in updated)) {
          let color;
          // Avoid duplicate colors if possible
          const usedColors = Object.values(updated);
          const availableColors = colors.filter((c) => !usedColors.includes(c));
          if (availableColors.length > 0) {
            color = availableColors[Math.floor(Math.random() * availableColors.length)];
          } else {
            color = getRandomColor();
          }
          updated[articleNumber] = color;
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
        const bgColor = articleColors[articleNumber] || getRandomColor();
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
