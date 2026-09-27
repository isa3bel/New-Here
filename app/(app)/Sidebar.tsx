"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { motion } from "@/app/_components/motion";

type NavItem = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
};

function PlanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 3.5V2.5C9 1.67 9.67 1 10.5 1h3c.83 0 1.5.67 1.5 1.5v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.5 11l1.8 1.8L13 9.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 16.5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 20c1.2-3.6 4.2-5.5 7.5-5.5s6.3 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function FeedbackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h12a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H9l-4.2 3.6a.6.6 0 0 1-1-.46V5.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 9h8M8 12.2h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/plan", label: "New Here Plan", icon: PlanIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
  { href: "/feedback", label: "Send feedback", icon: FeedbackIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-[var(--border)] lg:bg-[var(--card)] lg:h-screen lg:sticky lg:top-0">
      <div className="flex h-full flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-6 text-lg font-semibold hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl" aria-hidden>
            🌿
          </span>
          <span>New Here</span>
        </Link>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "text-[var(--accent-foreground)]"
                        : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        className="absolute inset-0 rounded-xl bg-[var(--accent)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon className="relative z-10 h-[18px] w-[18px] flex-shrink-0" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 pb-4">
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
                <path d="M9 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.5 15.5 20 12l-4.5-3.5M20 12H9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Sign out</span>
            </button>
          </form>
        </div>

        <div className="px-6 pb-4 text-xs text-[var(--muted-foreground)]">
          Demo build · v0.1
        </div>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="mobile-active-dot"
                    className="absolute top-1 h-1 w-6 rounded-full bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 transition-colors duration-200 ${
                    active ? "text-[var(--accent)]" : "text-[var(--muted-foreground)]"
                  }`}
                />
                <span
                  className={`transition-colors duration-200 ${
                    active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {item.label === "New Here Plan" ? "Plan" : item.label === "Send feedback" ? "Feedback" : item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
