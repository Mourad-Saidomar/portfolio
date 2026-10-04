"use client";

import { useEffect } from "react";

/**
 * Pose `data-scrolled` sur <html> dès que la page a défilé de plus de `threshold` px.
 * Le style de l'en-tête en dépend (CSS, transition ~300 ms). Lecture groupée par frame.
 */
export function ScrollState({ threshold = 50 }: { threshold?: number }) {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.scrollY > threshold) root.dataset.scrolled = "";
      else delete root.dataset.scrolled;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return null;
}
