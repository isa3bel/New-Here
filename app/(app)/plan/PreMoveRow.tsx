"use client";

import { useEffect, useState, useTransition } from "react";

import { AnimatePresence, motion, useReducedMotion } from "@/app/_components/motion";
import { markForYouCompletedAction } from "@/app/actions";
import { uniqByUrl } from "@/lib/ai/sanitize";
import type { ForYouItem } from "@/lib/for-you-data";

type Props = {
  item: ForYouItem;
  interest: string;
  completed: boolean;
};

// Mirrors the Stagger/StaggerItem variant shape in
// app/_components/motion.tsx. Kept local because this component's root
// must stay a real <li> (its parent renders a <ul>), while StaggerItem
// renders a <div> — Framer still propagates "hidden"/"show" from the
// ancestor Stagger wrapper down to this variant regardless of the tag.
const LIST_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Click the row → expands inline to reveal the rich content the model
// generated (longDescription, all links, meta tags). Click again → collapse.
//
// Single action: "✓ done" — flags this pre-move recommendation as
// already taken care of. Stored as a completed task so it shows up in
// the user's history and any badges that depend on it. Rendered as a
// <span role="button"> because it lives inside the parent <button>
// (the row expander) and browsers won't render nested actual <button>s.
export function PreMoveRow({ item, interest, completed }: Props) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<"done" | null>(null);
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(t);
  }, [feedback]);

  const handleMarkDone = () => {
    setFeedback("done");
    startTransition(() => markForYouCompletedAction({ item, interest }));
  };

  return (
    <motion.li
      variants={LIST_ITEM_VARIANTS}
      className={`rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-colors duration-200 ${
        completed ? "opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--background)] transition-colors duration-200"
      >
        <span className="text-lg flex-shrink-0" aria-hidden>
          {item.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              completed ? "line-through" : ""
            }`}
          >
            {item.title}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] truncate">
            {item.shortDescription}
          </p>
        </div>
        <Chevron expanded={expanded} />

        {completed ? (
          <span
            className="text-xs h-7 px-2.5 rounded-full font-medium bg-[var(--accent)] text-[var(--accent-foreground)] inline-flex items-center flex-shrink-0"
            aria-label="Already done"
          >
            ✓ Done
          </span>
        ) : (
          <RowButton
            onActivate={handleMarkDone}
            disabled={pending}
            label="Mark already done"
          >
            ✓ done
          </RowButton>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="details"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 border-t border-[var(--border)] bg-[var(--background)]">
              <p className="text-sm leading-relaxed">{item.longDescription}</p>

              {(item.meta?.cost ||
                item.meta?.schedule ||
                item.meta?.location ||
                item.date) && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.date && <MetaChip label="When" value={item.date} />}
                  {item.meta?.cost && (
                    <MetaChip label="Cost" value={item.meta.cost} />
                  )}
                  {item.meta?.schedule && (
                    <MetaChip label="Schedule" value={item.meta.schedule} />
                  )}
                  {item.meta?.location && (
                    <MetaChip label="Where" value={item.meta.location} />
                  )}
                </ul>
              )}

              {item.links.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {uniqByUrl(item.links).map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-[var(--accent)] hover:underline"
                      >
                        {l.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            key="feedback"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 py-1.5 border-t border-[var(--border)] bg-[var(--background)] text-xs text-[var(--muted-foreground)] flex items-center gap-2">
              <span className="text-[var(--accent)]">✓</span>
              <span>Marked done — check Week 1 for the entry.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

// Small chevron that rotates 180° on expand instead of swapping glyphs.
function Chevron({ expanded }: { expanded: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 flex-shrink-0 text-[var(--muted-foreground)]"
      aria-hidden
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <path d="M5 7.5l5 5 5-5" />
    </motion.svg>
  );
}

function RowButton({
  onActivate,
  disabled,
  label,
  children,
}: {
  onActivate: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const base =
    "text-xs h-7 px-2.5 rounded-full font-medium transition inline-flex items-center flex-shrink-0";
  const styles =
    "border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer";
  const disabledStyles = disabled ? "opacity-60 cursor-not-allowed" : "";
  return (
    <span
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) return;
        onActivate();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onActivate();
        }
      }}
      className={`${base} ${styles} ${disabledStyles}`}
    >
      {children}
    </span>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <li className="inline-flex items-baseline gap-1 rounded-full bg-[var(--card)] border border-[var(--border)] px-2.5 py-0.5 text-xs">
      <span className="text-[var(--muted-foreground)]">{label}:</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}
