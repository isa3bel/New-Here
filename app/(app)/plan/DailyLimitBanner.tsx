"use client";

import { Reveal } from "@/app/_components/motion";

// Shown at the top of /plan when the user has exhausted their daily
// AI generation cap. Takes priority over AiFailureBanner — when both
// are technically true, this one is the more specific + actionable
// message (the cap is the *reason* fresh suggestions aren't appearing,
// not a transient outage).
//
// No client interactivity beyond the entrance reveal. The cap resets at
// server-local midnight; we surface the current count + limit so the
// user knows where they stand.
export function DailyLimitBanner({
  count,
  limit,
}: {
  count: number;
  limit: number;
}) {
  return (
    <Reveal>
      <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ClockIcon className="h-6 w-6 flex-shrink-0 text-amber-600" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900">
              You&apos;ve hit today&apos;s personalization limit ({count}/
              {limit}).
            </p>
            <p className="mt-1 text-sm text-amber-800">
              You can keep marking things done and exploring what&apos;s
              already in your plan — fresh suggestions and load-more resume
              tomorrow. The cap keeps costs sustainable during the private
              beta.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
