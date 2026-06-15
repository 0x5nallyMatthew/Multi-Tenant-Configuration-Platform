"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * Batches DOM reads to prevent forced reflow.
 * When you need to read geometric properties (offsetWidth, getBoundingClientRect, etc.),
 * use this hook to batch the reads together to minimize layout thrashing.
 */
export function useBatchedReads<T>() {
  const readsRef = useRef<Array<() => T>>([]);
  const rafRef = useRef<number | null>(null);

  const flushReads = useCallback(() => {
    const results: T[] = [];
    for (const read of readsRef.current) {
      results.push(read());
    }
    readsRef.current = [];
    return results;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scheduleRead = useCallback(
    (readFn: () => T): Promise<T> => {
      return new Promise((resolve) => {
        readsRef.current.push(() => {
          const result = readFn();
          resolve(result);
          return result;
        });

        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            flushReads();
            rafRef.current = null;
          });
        }
      });
    },
    [flushReads]
  );

  return { scheduleRead, flushReads };
}

/**
 * A hook that defers non-critical work to prevent blocking the main thread.
 * Use this for operations that don't need to happen immediately.
 */
export function useDeferredTask() {
  const scheduleTask = useCallback((task: () => void, priority: "user-blocking" | "user-visible" | "background" = "background") => {
    // Use requestIdleCallback for background tasks, requestAnimationFrame for others
    if (priority === "background" && "requestIdleCallback" in window) {
      (window as any).requestIdleCallback(task, { timeout: 1000 });
    } else if (priority === "user-blocking") {
      requestAnimationFrame(() => task());
    } else {
      // For user-visible, use setTimeout with 0 to defer to next microtask
      setTimeout(task, 0);
    }
  }, []);

  return { scheduleTask };
}

/**
 * Measures layout dimensions without causing forced reflow.
 * Returns cached dimensions that are updated lazily.
 */
export function useLazyDimensions(elementRef: React.RefObject<HTMLElement | null>) {
  const dimensionsRef = useRef<{
    width: number;
    height: number;
    top: number;
    left: number;
  } | null>(null);

  const getDimensions = useCallback(() => {
    if (!elementRef.current) return null;

    // Cache the dimensions
    const rect = elementRef.current.getBoundingClientRect();
    dimensionsRef.current = {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
    };
    return dimensionsRef.current;
  }, [elementRef]);

  return { getDimensions, cachedDimensions: dimensionsRef };
}

/**
 * Throttles DOM reads to prevent multiple forced reflows in quick succession.
 */
export function useThrottledRead<T>(readFn: () => T, delay: number = 16) {
  const lastReadRef = useRef<number>(0);
  const lastResultRef = useRef<T | null>(null);

  const throttledRead = useCallback((): T | null => {
    const now = performance.now();
    if (now - lastReadRef.current >= delay) {
      lastReadRef.current = now;
      lastResultRef.current = readFn();
      return lastResultRef.current;
    }
    return lastResultRef.current;
  }, [readFn, delay]);

  return throttledRead;
}
