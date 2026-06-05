import Link from "next/link";
import { Brain, BarChart3, Mail } from "lucide-react";
import HeroParticles from "@/components/HeroParticles";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "#04040e" }}
    >
      {/* ── Floating centered card ── */}
      <div
        className="w-full max-w-[1040px] flex rounded-3xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.02) inset, 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.06)",
        }}
      >
        {/* ─── Left — Form panel ─────────────────────────────── */}
        <div
          className="flex-1 flex flex-col min-w-0 min-h-0"
          style={{ backgroundColor: "#08081a" }}
        >
          {/* Logo */}
          <div className="px-8 md:px-10 pt-8 flex-shrink-0">
            <Link href="/">
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  fontFamily: "'Syne', system-ui, sans-serif",
                  lineHeight: 1,
                }}
              >
                Hire<span style={{ color: "#a78bfa" }}>X</span>
              </span>
            </Link>
          </div>

          {/* Form content — scrollable when taller than panel */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 md:px-12 py-10 min-h-0">
            {children}
          </div>

          {/* Footer */}
          <div className="px-8 md:px-10 pb-6 flex-shrink-0">
            <p className="text-[11px]" style={{ color: "#1e1e2e" }}>
              © {new Date().getFullYear()} HireX · All rights reserved
            </p>
          </div>
        </div>

        {/* ─── Right — Visual panel ──────────────────────────── */}
        <div
          className="hidden lg:flex w-[460px] xl:w-[500px] flex-shrink-0 relative overflow-hidden"
          style={{ backgroundColor: "#06061a" }}
        >
          {/* Live particle canvas */}
          <HeroParticles />

          {/* Dark gradient overlay so text reads clearly */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,6,26,0.55) 0%, rgba(6,6,26,0.3) 60%, rgba(6,6,26,0.6) 100%)",
            }}
          />

          {/* Left edge separator */}
          <div
            className="absolute inset-y-0 left-0 w-px pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-10">
            {/* Top badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-600/20 self-start"
              style={{ backgroundColor: "rgba(124,58,237,0.08)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-[10px] font-bold text-brand-400 tracking-widest uppercase">
                AI Recruitment
              </span>
            </div>

            {/* Center — typographic statement */}
            <div>
              <h2 className="text-[2.4rem] xl:text-[2.75rem] font-black text-white leading-[1.08] tracking-tight mb-5">
                Every great hire
                <br />
                starts with one{" "}
                <span className="shimmer-gradient">decision.</span>
              </h2>
              <p
                className="text-[14px] leading-relaxed max-w-[300px]"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Stop drowning in CVs. HireX scores every applicant and tells you
                exactly who to call first.
              </p>
            </div>

            {/* Bottom — proof points */}
            <div className="space-y-3">
              {[
                { Icon: Brain, text: "AI scores every CV in under 60 seconds" },
                {
                  Icon: BarChart3,
                  text: "Ranked pipeline — highest fit first",
                },
                { Icon: Mail, text: "Candidates notified at every stage" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border border-brand-600/20 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(124,58,237,0.1)" }}
                  >
                    <Icon className="w-[14px] h-[14px] text-brand-400" />
                  </div>
                  <span
                    className="text-[12px]"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
