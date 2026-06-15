import { useRef, useEffect } from "react";

/**
 * Returns a stable ref object { x, y } with normalized mouse coords [-1, 1].
 * Does NOT cause any React re-renders on mouse move.
 * Uses a single global listener so multiple consumers share one event handler.
 */

// Shared global state - no React state, no re-renders
const mouseRef = { x: 0, y: 0 };
let listenerCount = 0;

function handleGlobalMouseMove(e: MouseEvent) {
  mouseRef.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseRef.y = -((e.clientY / window.innerHeight) * 2 - 1);
}

export function useMousePosition() {
  useEffect(() => {
    if (listenerCount === 0) {
      window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    }
    listenerCount++;
    return () => {
      listenerCount--;
      if (listenerCount === 0) {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
      }
    };
  }, []);

  return mouseRef;
}

/**
 * Returns a ref with raw pixel coordinates { x, y }.
 * Uses throttling via requestAnimationFrame to avoid flooding React state.
 * Calls the provided callback at most once per animation frame.
 */
export function useThrottledMouseCoords(
  callback: (x: number, y: number) => void
) {
  const rafRef = useRef<number | null>(null);
  const latestRef = useRef({ x: 0, y: 0 });
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      latestRef.current = { x: Math.round(e.clientX), y: Math.round(e.clientY) };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          callbackRef.current(latestRef.current.x, latestRef.current.y);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);
}
