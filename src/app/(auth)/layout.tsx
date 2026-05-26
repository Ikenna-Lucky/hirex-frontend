import Link from "next/link";
import { Brain, BarChart3, Mail } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen lg:h-screen flex overflow-hidden"
      style={{ backgroundColor: "#04040e" }}
    >
      {/* ─── Left Brand Panel ───────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[460px] xl:w-[500px] flex-shrink-0 flex-col relative overflow-hidden"
        style={{ backgroundColor: "#07071a" }}
      >
        {/* Floating orbs */}
        <div
          className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full pointer-events-none animate-orb-float"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-[-5%] right-[-5%] w-72 h-72 rounded-full pointer-events-none animate-orb-float-reverse"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Right border gradient */}
        <div
          className="absolute inset-y-0 right-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center flex-shrink-0">
            <span className="text-2xl font-black tracking-tight text-white">
              Hire<span className="text-accent-400">X</span>
            </span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center py-10">
            <p className="text-[10px] font-bold tracking-[0.25em] text-brand-400 uppercase mb-5">
              AI Recruitment Platform
            </p>
            <h2 className="text-[2.5rem] xl:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight mb-5">
              Every great hire
              <br />
              starts here.
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-[300px]">
              Stop drowning in CVs. HireX scores every applicant against your
              requirements and tells you who to call first.
            </p>

            {/* Proof points */}
            <div className="space-y-3">
              {[
                { Icon: Brain, text: "AI scores every CV in under 60 seconds" },
                {
                  Icon: BarChart3,
                  text: "Ranked pipeline — highest fit first",
                },
                { Icon: Mail, text: "Candidates auto-notified at every stage" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5">
                  <div
                    className="w-9 h-9 rounded-xl border border-brand-600/20 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(124,58,237,0.1)" }}
                  >
                    <Icon className="w-[16px] h-[16px] text-brand-400" />
                  </div>
                  <span className="text-[13px] text-gray-400">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div
            className="flex-shrink-0 pt-6 border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <p className="text-[11px] text-gray-700">
              Trusted by fast-growing companies across Africa
            </p>
          </div>
        </div>
      </div>

      {/* ─── Right Form Panel ───────────────────────────────── */}
      <div
        className="flex-1 flex flex-col min-h-screen lg:min-h-0 lg:overflow-y-auto"
        style={{ backgroundColor: "#04040e" }}
      >
        {/* Mobile header */}
        <header
          className="lg:hidden flex items-center px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <Link href="/">
            <span className="text-xl font-black tracking-tight text-white">
              Hire<span className="text-accent-400">X</span>
            </span>
          </Link>
        </header>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>

        {/* Footer */}
        <footer
          className="flex-shrink-0 py-5 text-center text-[11px] border-t"
          style={{ color: "#2a2a3a", borderColor: "rgba(255,255,255,0.04)" }}
        >
          © {new Date().getFullYear()} HireX · All rights reserved
        </footer>
      </div>
    </div>
  );
}
