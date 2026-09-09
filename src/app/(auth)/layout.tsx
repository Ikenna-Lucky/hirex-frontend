import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";

const proofStats = [
  { value: "3", label: "CVs scored" },
  { value: "1", label: "Top fit found" },
  { value: "2", label: "Emails ready" },
];

const activity = [
  {
    icon: CheckCircle2,
    title: "Amara Okafor shortlisted",
    detail: "92% fit for Backend Engineer",
  },
  {
    icon: FileText,
    title: "Daniel King needs review",
    detail: "Strong React and dashboard experience",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen px-4 py-6 text-gray-100 sm:px-6 md:flex md:items-center md:justify-center md:p-8"
      style={{ backgroundColor: "#05060a" }}
    >
      <div
        className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 lg:grid-cols-[0.86fr_1.14fr]"
        style={{ backgroundColor: "#080910" }}
      >
        <div className="flex min-h-[620px] flex-col bg-[#080910]">
          <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
            <Logo />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 transition hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-8 md:px-10">
            {children}
          </div>

          <div className="px-6 pb-5 md:px-10 md:pb-6">
            <p className="text-[12px] text-gray-700">
              Copyright {new Date().getFullYear()} HireX. All rights reserved.
            </p>
          </div>
        </div>

        <aside className="relative hidden min-h-[620px] overflow-hidden border-l border-white/[0.07] bg-[#070813] lg:block">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-20 left-4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col p-8 xl:p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Recruiter workspace
            </div>

            <div className="mt-6">
              <h2 className="max-w-lg text-[2rem] font-black leading-[1.08] tracking-tight text-white xl:text-[2.25rem]">
                Pick up with the hiring work already organized.
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-7 text-gray-500">
                A focused snapshot of roles, scored CVs, shortlists, and
                messages waiting for your next decision.
              </p>

              <div className="mt-8 max-w-xl">
                <div className="rounded-lg border border-white/[0.09] bg-[#0b0d14]/85 p-5 shadow-2xl shadow-black/30">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">
                        Active role
                      </p>
                      <h3 className="mt-2 text-[19px] font-black text-white">
                        Backend Engineer
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["Lagos", "Full time", "12 Jun 2026"].map((item) => (
                          <span
                            key={item}
                            className="rounded-md border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-[11px] font-semibold text-gray-500"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-right">
                      <p className="text-3xl font-black text-white">92%</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                        top fit
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {proofStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-4"
                      >
                        <p className="text-2xl font-black text-white">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold leading-4 text-gray-500">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {activity.map(({ icon: Icon, title, detail }) => (
                    <div
                      key={title}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                        <Icon className="h-4 w-4 text-violet-200" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-white">
                          {title}
                        </p>
                        <p className="truncate text-[11px] text-gray-600">
                          {detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/">
      <span
        style={{
          fontSize: "22px",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          fontFamily: "'Syne', system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        Hire
        <span
          style={{
            color: "#a78bfa",
            fontFamily: "'Syne', system-ui, sans-serif",
          }}
        >
          X
        </span>
      </span>
    </Link>
  );
}
