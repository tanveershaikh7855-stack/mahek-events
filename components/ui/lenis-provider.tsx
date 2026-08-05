"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Respect the visitor's motion preference — native scrolling is the
    // correct behaviour under prefers-reduced-motion, and it skips Lenis'
    // rAF loop entirely on those devices.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // `smooth` / `smoothTouch` were removed in Lenis v1 — they were silently
    // ignored. `syncTouch` is the current opt-in for touch smoothing.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: false,
    });

    // The rAF loop must not run while the tab is hidden — Lenis keeps the
    // frame scheduled regardless, which burns battery and CPU on background
    // tabs. Stopping and restarting on visibilitychange costs nothing.
    let rafId = 0;
    let running = false;

    function start() {
      if (running) return;
      running = true;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
