"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * App-level error boundary for public routes (landing page, job board, etc.)
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
        padding: "24px",
        color: "rgba(255,255,255,0.6)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 20,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        H
      </div>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "rgba(255,255,255,0.9)",
          marginBottom: 8,
        }}
      >
        Something went wrong
      </h2>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.35)",
          marginBottom: 28,
          maxWidth: 360,
        }}
      >
        {error.message || "An unexpected error occurred. Please try again."}
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "1px solid rgba(124,58,237,0.3)",
            background: "rgba(124,58,237,0.15)",
            color: "#a78bfa",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try again
        </button>

        <Link
          href="/"
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            fontFamily: "inherit",
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
