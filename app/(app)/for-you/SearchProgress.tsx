"use client";

import { useEffect, useState } from "react";

import {
  AnimatePresence,
  motion,
  Stagger,
  StaggerItem,
  useReducedMotion,
} from "@/app/_components/motion";

// Loading state for AI-powered search. Drop this into a React <Suspense>
// fallback once the Claude + web_search backend is wired up. The stage
// messages rotate on a timer to communicate progress during the ~10–30s wait.
//
//   <Suspense fallback={<SearchProgress query={query} city={city} />}>
//     <SearchResults query={query} city={city} />
//   </Suspense>

const STAGES = [
  "Searching the web…",
  "Reading event listings on Luma and Eventbrite…",
  "Finding local organizations and studios…",
  "Looking for Reddit threads and Facebook groups…",
  "Checking city event calendars…",
  "Organizing results for you…",
];

const STAGE_MS = 2800;

export function SearchProgress({
  query,
  city,
}: {
  query: string;
  city?: string;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setStageIndex((s) => Math.min(s + 1, STAGES.length - 1));
    }, STAGE_MS);
    return () => clearInterval(id);
  }, []);

  const stage = STAGES[stageIndex];
  const progress = ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <section className="mt-10" aria-busy="true" aria-live="polite">
      {/* Same scoped-shimmer approach as app/(app)/plan/loading.tsx —
          kept local rather than in globals.css (out of scope for this
          pass) so both loading surfaces read as one system. */}
      <style>{`
        .skeleton-shimmer { position: relative; overflow: hidden; }
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: plan-skeleton-shimmer 1.6s ease-in-out infinite;
        }
        @keyframes plan-skeleton-shimmer {
          100% { transform: translateX(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer::after { animation: none; display: none; }
        }
      `}</style>
      <div className="rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[var(--card)] p-8">
        <div className="flex items-center gap-4">
          <Spinner />
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.p
                key={stage}
                className="font-medium"
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -4 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
              >
                {stage}
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Looking up &ldquo;{query}&rdquo;
              {city && ` in ${city}`} — this usually takes 10–30 seconds.
            </p>
          </div>
        </div>

        <div className="mt-5 h-1.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StaggerItem key={i}>
            <TileSkeleton />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-6 w-6 flex-shrink-0 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin"
      aria-hidden
    />
  );
}

// Tile cascades in via the parent Stagger/StaggerItem now, so it no
// longer needs its own animation-delay — the shimmer sweep underneath
// communicates "still working" for however long the tile stays a
// skeleton.
function TileSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-start gap-3">
        <div className="skeleton-shimmer h-8 w-8 rounded-full bg-[var(--muted)]" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-shimmer h-4 w-3/4 rounded bg-[var(--muted)]" />
          <div className="skeleton-shimmer h-3 w-1/3 rounded bg-[var(--muted)]" />
          <div className="skeleton-shimmer h-3 w-2/3 rounded bg-[var(--muted)] mt-3" />
          <div className="skeleton-shimmer h-3 w-1/2 rounded bg-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}
