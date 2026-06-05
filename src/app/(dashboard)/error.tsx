"use client";

import { useEffect } from "react";
import { Warning, ArrowCounterClockwise, House } from "@phosphor-icons/react";
import Link from "next/link";

/**
 * Next.js App Router error boundary for all /dashboard/* routes.
 * Rendered automatically when any dashboard page throws.
 */
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
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
      style={{ color: "rgba(255,255,255,0.6)" }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <Warning weight="duotone" size={28} style={{ color: "#f87171" }} />
      </div>

      <h2
        className="text-[22px] font-bold mb-2"
        style={{ color: "rgba(255,255,255,0.9)" }}
      >
        Something went wrong
      </h2>

      <p
        className="text-[14px] mb-8 max-w-sm leading-relaxed"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {error.message ||
          "An unexpected error occurred on this page. Your data is safe — this is just a display issue."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(124,58,237,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(124,58,237,0.15)";
          }}
        >
          <ArrowCounterClockwise weight="bold" size={15} />
          Try again
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.85)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.5)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.05)";
          }}
        >
          <House weight="duotone" size={15} />
          Go to overview
        </Link>
      </div>

      {error.digest && (
        <p
          className="mt-8 text-[11px] font-mono"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
