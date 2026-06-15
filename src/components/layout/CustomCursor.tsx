import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Show the cursor elements
    if (dotRef.current) dotRef.current.style.display = "block";
    if (ringRef.current) ringRef.current.style.display = "block";
    document.body.classList.add("custom-cursor-active");

    // Use refs to track position without React state (zero re-renders)
    let dotX = -100, dotY = -100;
    let trailX = -100, trailY = -100;
    let isHovered = false;
    let rafId: number;

    const moveCursor = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      isHovered = !!(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".interactive") ||
        target.getAttribute("role") === "button"
      );
    };

    // Single rAF loop – updates DOM directly, no React state, no re-renders
    const tick = () => {
      // Lerp trail toward dot
      trailX += (dotX - trailX) * 0.15;
      trailY += (dotY - trailY) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 4}px,${dotY - 4}px,0) scale(${isHovered ? 1.5 : 1})`;
      }
      if (ringRef.current) {
        const size = isHovered ? 48 : 32;
        const offset = size / 2;
        ringRef.current.style.transform = `translate3d(${trailX - offset}px,${trailY - offset}px,0)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.border = isHovered
          ? "1px solid rgba(6,182,212,0.8)"
          : "1px solid rgba(139,92,246,0.5)";
        ringRef.current.style.boxShadow = isHovered ? "0 0 15px rgba(6,182,212,0.3)" : "none";
        ringRef.current.style.backgroundColor = isHovered ? "rgba(6,182,212,0.05)" : "transparent";
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []); // ← empty deps: listeners and rAF loop set up ONCE, never torn down

  return (
    <>
      {/* Tiny Cyan Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyber-cyan rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{ display: "none", willChange: "transform", boxShadow: "0 0 8px rgba(6,182,212,0.8)" }}
      />
      {/* Violet Outer Trailing Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{ display: "none", willChange: "transform" }}
      />
    </>
  );
}
