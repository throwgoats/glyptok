"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./page.module.scss";

export default function Home() {
  const [articles, setArticles] = useState([1, 2]);
  const observer = useRef<IntersectionObserver>();
  const lastArticleRef = useCallback(
    (node) => {
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
        if (index + 1 === articles.length) {
          return (
            <article
              key={articleNumber}
              ref={lastArticleRef}
            >
              <h1>{articleNumber}</h1>
            </article>
          );
        }
        return (
          <article key={articleNumber}>
            <h1>{articleNumber}</h1>
          </article>
        );
      })}
    </section>
  );
}
