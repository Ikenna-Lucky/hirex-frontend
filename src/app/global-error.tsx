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
          {/* HireX mark */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(109,40,217,0.06))",
              border: "1px solid rgba(124,58,237,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <span
              style={{
                fontSize: 19,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontFamily: "'Syne', ui-sans-serif, system-ui, sans-serif",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              Hire<span style={{ color: "#a78bfa" }}>X</span>
            </span>
          </div>

          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 8,
            }}
          >
            We hit a snag
          </h1>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 28,
            }}
          >
            Something went wrong loading HireX. Nothing you did caused this —
            please refresh to try again.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
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

            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
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
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 11,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.15)",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
