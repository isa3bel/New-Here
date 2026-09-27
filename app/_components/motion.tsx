"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Shared animation primitives so every redesigned page moves the same way.
// Duration/easing follows the 150-300ms micro-interaction guidance; reveals
// run a touch longer since they're one-shot, not repeated hover feedback.

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

// Fades + slides an element up once when it scrolls into view. Falls back to
// a static render when the user has prefers-reduced-motion enabled.
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
};

// Wrap a list/grid of cards in <Stagger>, each direct child in <StaggerItem>,
// to reveal them one after another instead of all at once.
//
// Pass as="ul" when the children are <li>s (or components that render one as
// their root) — never wrap this in a "contents" div to satisfy list markup
// instead: display:contents has no box, so whileInView's IntersectionObserver
// never reports it as visible and the stagger silently never fires, leaving
// every child stuck at its hidden/opacity-0 state.
export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const MotionTag = as === "ul" ? motion.ul : motion.div;

  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

type PressableProps = {
  children: ReactNode;
  className?: string;
  scale?: number;
};

// Subtle lift-and-press feedback for cards/tiles that are clickable but
// aren't plain <button>s (so :active styles alone don't read as tappable).
export function Pressable({ children, className, scale = 1.015 }: PressableProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale, y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export { motion, useReducedMotion, AnimatePresence } from "framer-motion";
