import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/db";

import { MobileTabBar, Sidebar } from "./Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id) : null;
  const onboarded = profile !== null;

  if (!onboarded) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar />

      {/* Mobile-only top bar: brand mark, sticky rather than fixed */}
      <div className="lg:hidden sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-sm px-4 py-3">
        <Link href="/" className="font-semibold text-sm">
          🌿 New Here
        </Link>
      </div>

      <div className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</div>

      <MobileTabBar />
    </div>
  );
}
