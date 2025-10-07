import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./App.module.scss";
import { getColor, assignArticleColors } from "./colors";

export default function App() {
  const [articles, setArticles] = useState([1]);
  const [articleColors, setArticleColors] = useState<{ [key: number]: string }>({});
  const observer = useRef<IntersectionObserver | null>(null);

  const totalColors = 32;
  const avoidCount = 4; // Number of recent colors to avoid repeating
  // Helper to get a color for a given index
  const getColorForIndex = (index: number) => getColor(index, totalColors);

  // Assign a random color to each article, avoid repeats w/ avoidCount
  useEffect(() => {
    setArticleColors((prev) => assignArticleColors(articles, prev, totalColors, avoidCount));
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
