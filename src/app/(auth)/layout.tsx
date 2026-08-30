import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
              Back home
              <ArrowRight className="h-3.5 w-3.5" />
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
                Your hiring command center, ready when you are.
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-7 text-gray-500">
                Review roles, candidate volume, scoring queues, and plan limits
                without leaving the dashboard.
              </p>

              <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0d14] p-2 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">
                    HireX dashboard
                  </span>
                </div>
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#090a10]">
                  <img
                    src="/images/hirex-dashboard.png"
                    alt="HireX dashboard preview"
                    className="h-full w-full object-cover object-left-top"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.05]" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070813] to-transparent" />
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
