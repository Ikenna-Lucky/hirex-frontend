function Bone({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

/**
 * Route-level fallback for /dashboard/* — shown briefly while a page
 * segment is loading in. Most pages also render their own tailored
 * skeleton once mounted; this just covers the gap before that.
 */
export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Bone style={{ width: 160, height: 24 }} />
        <Bone style={{ width: 100, height: 36 }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-2.5"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Bone style={{ width: 60, height: 12 }} />
            <Bone style={{ width: 90, height: 22 }} />
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Bone style={{ width: 140, height: 16 }} />
        </div>
        <div className="p-6 space-y-4">
          {[0, 1, 2].map((i) => (
            <Bone key={i} style={{ width: "100%", height: 48 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
