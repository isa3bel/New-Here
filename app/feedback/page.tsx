import Link from "next/link";

import { Reveal } from "@/app/_components/motion";
import { getCurrentUser } from "@/lib/auth";

import { FeedbackForm } from "./FeedbackForm";

export const metadata = {
  title: "Send feedback — New Here",
};

// Public page — anyone (signed in or not) can submit feedback. The
// server action stores user_id + user_email when the visitor happens
// to be signed in, and leaves them null otherwise. Spam mitigation
// relies on input validation + length caps in the action; we can add
// a captcha later if abuse shows up.
export default async function FeedbackPage() {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-col flex-1 items-center">
      <div className="w-full max-w-2xl px-6 py-12">
        <Link
          href="/"
          className="text-sm text-[var(--muted-foreground)] transition-colors hover:underline"
        >
          ← Home
        </Link>

        <Reveal className="mt-6">
          <header>
            <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
              Feedback
            </p>
            <h1 className="text-3xl font-semibold tracking-tight mt-2">
              Send us a note
            </h1>
            <p className="mt-2 text-[var(--muted-foreground)]">
              We&apos;re in early beta — every bug, gripe, and idea makes the
              next version better. Submissions land directly in our internal
              dashboard.
            </p>
          </header>
        </Reveal>

        {!user && (
          <Reveal delay={0.05}>
            <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted-foreground)]">
              You can send feedback without signing in. If you&apos;d like a
              reply, drop your email in the message and we&apos;ll get back to
              you.
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-10">
          <FeedbackForm />
        </Reveal>
      </div>
    </main>
  );
}
