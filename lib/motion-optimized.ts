"use client";

/**
 * Optimized motion utilities to reduce forced reflow.
 * These utilities help batch layout reads and minimize layout thrashing
 * when using framer-motion animations.
 */

import { type Variants, type Transition } from "framer-motion";

/**
 * Default transition optimized for performance.
 * Uses transform and opacity which don't trigger layout.
 */
export const optimizedTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 0.8,
};

/**
 * Optimized variants that use only transform and opacity properties.
 * These properties are composited and don't trigger layout reflows.
 */
export const optimizedVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Use transform instead of margin/top
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: optimizedTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: optimizedTransition,
  },
};

/**
 * Optimized stagger children variants.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Optimized fade in variants using only opacity and transform.
 */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Optimized scale variants using only transform.
 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: optimizedTransition,
  },
};

/**
 * Helper to create optimized hover animations.
 * Uses only transform and opacity to avoid layout triggers.
 */
export const optimizedHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

/**
 * Helper to create optimized tap animations.
 * Uses only transform and opacity to avoid layout triggers.
 */
export const optimizedTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

/**
 * Layout animation preset that minimizes forced reflow.
 * Uses layoutId sparingly to reduce layout recalculations.
 */
export const layoutAnimation = {
  layout: true,
  layoutId: undefined, // Avoid using layoutId unless necessary
};

/**
 * Optimized whileInView configuration.
 * Uses IntersectionObserver efficiently.
 */
export const whileInViewConfig = {
  once: true,
  margin: "-50px",
  amount: 0.3,
};
