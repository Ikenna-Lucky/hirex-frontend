"use client";

import { useEffect } from "react";

/**
 * Next.js App Router global error boundary — catches crashes in the root layout.
 * Must include its own <html> and <body> tags.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0a0a0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 400 }}>
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 28,
            }}
          >
            ⚠️
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 28,
            }}
          >
            {error.message ||
              "A critical error occurred. Please refresh the page to continue."}
          </p>

          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
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

          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 11,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
