"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowCounterClockwise, House, Warning } from "@phosphor-icons/react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-slate-500">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300">
        <Warning weight="duotone" size={28} />
      </div>

      <h2 className="mb-2 text-[22px] font-bold text-white">
        Something went wrong
      </h2>

      <p className="mb-8 max-w-sm text-[14px] leading-6 text-slate-500">
        This page ran into a problem loading. Your data is safe. Try again, or
        head back to your overview.
      </p>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-5 py-2.5 text-[14px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
        >
          <ArrowCounterClockwise weight="bold" size={15} />
          Try again
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-5 py-2.5 text-[14px] font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          <House weight="duotone" size={15} />
          Go to overview
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-[11px] text-slate-700">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
