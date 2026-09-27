"use client";

import { motion, Reveal, useReducedMotion } from "@/app/_components/motion";
import type { Badge } from "@/lib/types";

// Mirrors the Stagger/StaggerItem variant shape in app/_components/motion.tsx.
// Kept local because each badge below is a real <li> inside this <ul> —
// StaggerItem itself renders a <div>, which isn't valid list markup.
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 12, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Persistent shelf of every badge — earned ones in full color with the
// accent border, unearned ones dimmed + grayscaled so the user can see
// what's next.
//
// Sits above PlanView on both /plan and /sample. CelebrationBanner
// still pops on top when a badge was *just* earned (cookie-flagged);
// this shelf is the always-visible "collection" view.
export function BadgeShelf({
  badges,
  earnedIds,
}: {
  badges: Badge[];
  earnedIds: Set<string>;
}) {
  const reduce = useReducedMotion();
  if (badges.length === 0) return null;
  const earnedCount = badges.filter((b) => earnedIds.has(b.id)).length;

  return (
    <Reveal>
      <section className="mt-8">
        <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Badges
          </h2>
          <span className="text-xs text-[var(--muted-foreground)]">
            {earnedCount} of {badges.length} earned
          </span>
        </div>
        <motion.ul
          className="flex flex-wrap gap-2"
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          {badges.map((b) => {
            const earned = earnedIds.has(b.id);
            return (
              <motion.li
                key={b.id}
                variants={reduce ? undefined : staggerItem}
                title={
                  earned
                    ? `Earned — ${b.description}`
                    : `Locked — ${b.description}`
                }
                className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2 transition-colors duration-200 ${
                  earned
                    ? "border-[var(--accent)] bg-[var(--card)]"
                    : "border-[var(--border)] bg-[var(--background)] opacity-60"
                }`}
              >
                <span
                  className={`text-2xl leading-none ${earned ? "" : "grayscale"}`}
                  aria-hidden
                >
                  {b.icon ?? "🏅"}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold leading-tight">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)] leading-tight mt-0.5 max-w-[14rem] truncate">
                    {b.description}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>
    </Reveal>
  );
}
