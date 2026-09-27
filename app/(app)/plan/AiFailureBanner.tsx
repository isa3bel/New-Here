"use client";

import { useState } from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "@/app/_components/motion";

// Shown at the top of /plan when at least one AI surface (pre_move or
// week_one) failed this render. Two options:
//   - "Try again" → reload the page (which re-attempts the AI call)
//   - "Use generic plan" → dismiss the banner client-side. The page
//     already renders fine with generic content; this just hides the
//     prompt. Dismiss is per-session only — refresh shows it again if
//     AI is still failing.
export function AiFailureBanner() {
  const [dismissed, setDismissed] = useState(false);
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduce
              ? undefined
              : { opacity: 0, height: 0, marginTop: 0 }
          }
          transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5"
        >
          <div className="flex items-start gap-3">
            <WarningIcon className="h-6 w-6 flex-shrink-0 text-amber-600" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900">
                We couldn&apos;t personalize your plan right now.
              </p>
              <p className="mt-1 text-sm text-amber-800">
                The personalization service is unreachable. You can refresh to
                try again, or continue with a generic plan for now — every task
                still works, it just won&apos;t reference your city by name.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-sm font-medium px-3 py-1.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200"
                >
                  ↻ Try again
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  className="text-sm font-medium px-3 py-1.5 rounded-full border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors duration-200"
                >
                  Use generic plan
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.14A1.5 1.5 0 0 0 3.38 20.5h17.24a1.5 1.5 0 0 0 1.27-2.5L13.71 3.86a1.5 1.5 0 0 0-2.42 0z" />
    </svg>
  );
}
