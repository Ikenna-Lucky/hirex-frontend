import Link from "next/link";

/**
 * Custom 404 — shown for any route that doesn't match, anywhere in the app.
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04040e",
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
      {/* HireX mark */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(109,40,217,0.06))",
          border: "1px solid rgba(124,58,237,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <span
          style={{
            fontSize: 18,
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

      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#a78bfa",
          marginBottom: 12,
        }}
      >
        404
      </p>

      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "rgba(255,255,255,0.9)",
          marginBottom: 8,
        }}
      >
        We can&apos;t find that page
      </h1>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.35)",
          marginBottom: 28,
          maxWidth: 360,
        }}
      >
        It may have been moved, closed, or the link might be out of date.
        Let&apos;s get you back on track.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "1px solid rgba(124,58,237,0.3)",
            background: "rgba(124,58,237,0.15)",
            color: "#a78bfa",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            fontFamily: "inherit",
          }}
        >
          Go home
        </Link>

        <Link
          href="/jobs"
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
          Browse jobs
        </Link>
      </div>
    </div>
  );
}
