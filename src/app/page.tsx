import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import {
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
  CheckCircle2,
  Mail,
  Clock,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-gray-100 overflow-x-hidden"
      style={{ backgroundColor: "#04040e" }}
    >
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[880px]">
        <nav
          className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{
            backgroundColor: "rgba(6,6,18,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02) inset, 0 12px 40px rgba(0,0,0,0.55)",
          }}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex-shrink-0">
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

          {/* ── Center links ── */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it works" },
              { href: "#pricing", label: "Pricing" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] font-medium text-gray-500 hover:text-white transition-colors duration-150 px-4 py-2 rounded-xl hover:bg-white/[0.05]"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right CTAs ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Thin divider — desktop only */}
            <div
              className="hidden md:block w-px h-4 mx-1"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />

            <Link
              href="/login"
              className="hidden sm:block text-[13px] font-medium text-gray-500 hover:text-white transition-colors duration-150 px-3 py-2 rounded-xl hover:bg-white/[0.05]"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-white px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                boxShadow:
                  "0 2px 14px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </div>

      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-28 pb-24 overflow-hidden">
        {/* ── Background layers ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Soft brand glow — top right */}
          <div
            className="absolute top-[-18%] right-[-6%] w-[750px] h-[750px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 58%)",
            }}
          />

          {/* Soft accent glow — bottom left */}
          <div
            className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 60%)",
            }}
          />

          {/* Fine grid — masked to center-right */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.011) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.011) 1px, transparent 1px)",
              backgroundSize: "58px 58px",
              maskImage:
                "radial-gradient(ellipse 70% 55% at 65% 45%, black 10%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 55% at 65% 45%, black 10%, transparent 75%)",
            }}
          />

          {/* ── Flowing particles (canvas) ── */}
          <HeroParticles />
        </div>

        {/* ── Hero content — single column, spacious ── */}
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Chapter marker — desktop only */}
          <div className="anim-1 hidden md:flex items-center gap-3 mb-12">
            <span
              className="text-[9px] font-bold tracking-[0.35em] uppercase"
              style={{ color: "rgba(255,255,255,0.13)" }}
            >
              01
            </span>
            <div
              className="h-px w-4"
              style={{ backgroundColor: "rgba(124,58,237,0.7)" }}
            />
            <span className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.25em]">
              AI Recruitment Platform
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            />
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand-600/20 animate-badge-glow"
              style={{ backgroundColor: "rgba(124,58,237,0.07)" }}
            >
              <Sparkles className="w-2.5 h-2.5 text-brand-400" />
              <span className="text-[9px] font-bold text-brand-400 tracking-wide uppercase">
                Gemini Powered
              </span>
            </div>
          </div>
          {/* Mobile badge — compact replacement */}
          <div className="anim-1 flex md:hidden items-center gap-2 mb-8">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-600/20"
              style={{ backgroundColor: "rgba(124,58,237,0.07)" }}
            >
              <Sparkles className="w-3 h-3 text-brand-400" />
              <span className="text-[10px] font-bold text-brand-400 tracking-wide uppercase">
                AI Recruitment · Gemini Powered
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="anim-2 leading-[1.06] tracking-tight">
            <span
              className="block font-light text-gray-500"
              style={{ fontSize: "clamp(2rem, 5.8vw, 5.2rem)" }}
            >
              Hire the right person.
            </span>
            <span
              className="block font-black text-white mt-2"
              style={{ fontSize: "clamp(2rem, 5.8vw, 5.2rem)" }}
            >
              Not just the <span className="shimmer-gradient">next one.</span>
            </span>
          </h1>

          {/* Subtext with left accent rule */}
          <div className="anim-3 flex items-start gap-5 mt-10 mb-12 max-w-[500px]">
            <div
              className="w-px flex-shrink-0 self-stretch"
              style={{ backgroundColor: "rgba(52,211,153,0.4)" }}
            />
            <p className="text-[15px] text-gray-500 leading-[1.8]">
              Every CV scored the moment it lands. Candidates ranked by fit, not
              luck. You make the call in minutes — not days.
            </p>
          </div>

          {/* CTAs */}
          <div className="anim-4 flex flex-wrap items-center gap-4 mb-14">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 text-white text-[14px] font-bold px-7 py-3.5 rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                boxShadow:
                  "0 4px 24px rgba(124,58,237,0.38), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Start hiring smarter
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-[14px] text-gray-500 hover:text-white px-6 py-3.5 rounded-xl border border-white/[0.07] hover:border-white/[0.13] transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.025)" }}
            >
              See how it works
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </Link>
          </div>

          {/* Stats + social proof row */}
          <div
            className="anim-5 flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12 pt-8 border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            {/* Mini stats */}
            <div className="flex items-center gap-6 sm:gap-10">
              {[
                { n: "< 60s", l: "per CV scored" },
                { n: "0–100", l: "fit score" },
                { n: "5×", l: "faster to hire" },
              ].map((s) => (
                <div key={s.n} className="flex flex-col gap-0.5">
                  <span className="text-[1.1rem] sm:text-[1.3rem] font-black gradient-text leading-none tracking-tight">
                    {s.n}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-700">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #04040e)",
          }}
        />
      </section>

      {/* ─── Marquee ticker ─────────────────────────────────── */}
      <div
        className="border-y border-white/[0.05] py-4 overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.01)" }}
      >
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {[
            "AI CV Scoring",
            "Ranked Pipeline",
            "Auto Notifications",
            "Background Processing",
            "Application Deadlines",
            "Audit Trail",
            "Gemini Powered",
            "Instant Confirmations",
            "Stage Management",
            "Email Alerts",
            "Fit Score 0–100",
            "Smart Shortlisting",
            "AI CV Scoring",
            "Ranked Pipeline",
            "Auto Notifications",
            "Background Processing",
            "Application Deadlines",
            "Audit Trail",
            "Gemini Powered",
            "Instant Confirmations",
            "Stage Management",
            "Email Alerts",
            "Fit Score 0–100",
            "Smart Shortlisting",
          ].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 mx-5 text-[11px] font-semibold text-gray-700 uppercase tracking-[0.1em]"
            >
              <span className="w-1 h-1 rounded-full bg-brand-600/50 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Stats ──────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          {[
            { value: "< 60s", label: "to score a CV", sub: "from submission" },
            {
              value: "0–100",
              label: "precision match score",
              sub: "per candidate",
            },
            {
              value: "5×",
              label: "faster shortlisting",
              sub: "vs manual review",
            },
            {
              value: "100%",
              label: "auto-notified",
              sub: "every stage change",
            },
          ].map((s) => (
            <div
              key={s.value}
              className="flex flex-col justify-center px-4 py-6 md:px-7 md:py-8"
              style={{ backgroundColor: "#04040e" }}
            >
              <p className="text-3xl font-black gradient-text mb-1 tracking-tight">
                {s.value}
              </p>
              <p className="text-[13px] font-medium text-gray-400 leading-snug">
                {s.label}
              </p>
              <p className="text-[11px] text-gray-700 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features bento ─────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px w-6"
              style={{ backgroundColor: "rgba(124,58,237,0.5)" }}
            />
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.22em]">
              Features
            </span>
          </div>
          <div className="flex flex-col md:items-start md:justify-between gap-4 mb-10">
            <h2 className="text-2xl md:text-[1.875rem] font-bold text-white leading-tight tracking-tight max-w-2xl">
              Built for the way great teams actually hire.
            </h2>
            <p className="text-[14px] text-gray-600 max-w-xs leading-relaxed">
              No bloated HR suite. No six-month onboarding. Just results.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div
              className="bento-card md:col-span-2 rounded-2xl p-7 border border-white/[0.06] relative overflow-hidden"
              style={{ backgroundColor: "#09090f" }}
            >
              <div
                className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
                }}
              />
              <div
                className="w-10 h-10 rounded-xl border border-brand-600/20 flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(124,58,237,0.09)" }}
              >
                <Brain className="w-[18px] h-[18px] text-brand-400" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">
                AI CV Scoring
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-md">
                Every CV analysed against your exact job description. Each
                candidate gets a{" "}
                <span className="text-gray-300 font-medium">
                  0–100 fit score
                </span>{" "}
                with strengths and gaps — no bias, no guesswork, no hours wasted
                on the wrong people.
              </p>
            </div>

            <div
              className="bento-card rounded-2xl p-7 border border-white/[0.06] relative overflow-hidden"
              style={{ backgroundColor: "#09090f" }}
            >
              <div
                className="absolute bottom-0 left-0 w-36 h-36 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
                }}
              />
              <div
                className="w-10 h-10 rounded-xl border border-accent-500/20 flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(16,185,129,0.07)" }}
              >
                <BarChart3 className="w-[18px] h-[18px] text-accent-400" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">
                Ranked Pipeline
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Candidates sorted by fit, not by who applied first. Move them
                through stages in one click.
              </p>
            </div>

            <div
              className="bento-card rounded-2xl p-7 border border-white/[0.06] relative overflow-hidden"
              style={{ backgroundColor: "#09090f" }}
            >
              <div
                className="w-10 h-10 rounded-xl border border-brand-600/20 flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(124,58,237,0.09)" }}
              >
                <Zap className="w-[18px] h-[18px] text-brand-400" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">
                Background Processing
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Scoring runs in a queue. Candidates get instant confirmation.
                Results in under a minute.
              </p>
            </div>

            <div
              className="bento-card md:col-span-2 rounded-2xl p-7 border border-white/[0.06] relative overflow-hidden"
              style={{ backgroundColor: "#09090f" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.05) 0%, transparent 60%)",
                }}
              />
              <div
                className="w-10 h-10 rounded-xl border border-accent-500/20 flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(16,185,129,0.07)" }}
              >
                <Mail className="w-[18px] h-[18px] text-accent-400" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">
                Automatic Notifications
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-md">
                Every stage change fires a professional email to the candidate.
                Applied, shortlisted, rejected, offered —{" "}
                <span className="text-gray-300 font-medium">
                  they always know where they stand
                </span>
                .
              </p>
            </div>

            <div
              className="bento-card rounded-2xl p-7 border border-white/[0.06]"
              style={{ backgroundColor: "#09090f" }}
            >
              <div
                className="w-10 h-10 rounded-xl border border-brand-600/20 flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(124,58,237,0.09)" }}
              >
                <Clock className="w-[18px] h-[18px] text-brand-400" />
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">
                Auto-Close Deadlines
              </h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Set a closing date. Applications stop automatically. No more CVs
                for a role you filled weeks ago.
              </p>
            </div>

            <div
              className="bento-card md:col-span-2 rounded-2xl p-7 border border-white/[0.06] flex flex-col justify-between"
              style={{ backgroundColor: "#09090f" }}
            >
              <div>
                <div
                  className="w-10 h-10 rounded-xl border border-accent-500/20 flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(16,185,129,0.07)" }}
                >
                  <CheckCircle2 className="w-[18px] h-[18px] text-accent-400" />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">
                  Full Audit Trail
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed max-w-md">
                  Every stage move logged with who made it and when. Full hiring
                  history for every candidate, every role, forever.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Start using HireX free{" "}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px w-6"
              style={{ backgroundColor: "rgba(124,58,237,0.5)" }}
            />
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.22em]">
              How it works
            </span>
          </div>
          <h2 className="text-2xl md:text-[1.875rem] font-bold text-white tracking-tight mb-10 max-w-md leading-tight">
            From post to hire. Four steps.
          </h2>

          <div className="grid md:grid-cols-2 gap-2.5">
            {[
              {
                n: "01",
                title: "Post your job",
                body: "Write your description once. HireX treats every word as the benchmark all CVs get scored against. The more specific you are, the smarter the AI.",
                tint: "from-brand-600/10 to-transparent",
              },
              {
                n: "02",
                title: "Candidates apply",
                body: "They upload their CV through your public job page and get instant confirmation. You get a queue that fills itself — no email threads, no lost attachments.",
                tint: "from-accent-500/8 to-transparent",
              },
              {
                n: "03",
                title: "Gemini scores every CV",
                body: "Google Gemini analyses each application against your requirements. Match score, summary, strengths, gaps — automatically, in the background, in under 60 seconds.",
                tint: "from-brand-600/10 to-transparent",
              },
              {
                n: "04",
                title: "You hire the right person",
                body: "Open your dashboard to a ranked list. Move the best forward. The rest receive a professional rejection — sent automatically the moment you decide.",
                tint: "from-accent-500/8 to-transparent",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bento-card relative rounded-2xl p-7 border border-white/[0.06] overflow-hidden"
                style={{ backgroundColor: "#09090f" }}
              >
                <span
                  className="absolute top-3 right-5 text-[5rem] font-black leading-none select-none pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.022)" }}
                >
                  {step.n}
                </span>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.tint} pointer-events-none rounded-2xl`}
                />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold text-brand-400/50 tracking-[0.2em] uppercase mb-3 block">
                    Step {step.n}
                  </span>
                  <h3 className="text-[15px] font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px w-6"
              style={{ backgroundColor: "rgba(124,58,237,0.5)" }}
            />
            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.22em]">
              Pricing
            </span>
          </div>
          <div className="flex flex-col md:items-start md:justify-between gap-4 mb-10">
            <h2 className="text-2xl md:text-[1.875rem] font-bold text-white tracking-tight max-w-lg leading-tight">
              Start free. Scale when you're ready.
            </h2>
            <p className="text-[14px] text-gray-600 max-w-lg leading-relaxed">
              Post your first role at no cost — no credit card needed. Every
              plan includes full AI scoring, email notifications, and the
              complete hiring pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* ── Free tier ── */}
            <div
              className="bento-card relative flex flex-col rounded-2xl border p-6"
              style={{
                backgroundColor: "#09090f",
                borderColor: "rgba(124,58,237,0.2)",
              }}
            >
              {/* "Start here" ribbon */}
              <div
                className="absolute -top-[1px] left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3.5 py-1 rounded-full"
                style={{
                  background: "rgba(124,58,237,0.8)",
                  boxShadow: "0 0 12px rgba(124,58,237,0.4)",
                }}
              >
                Start here
              </div>

              <div className="mb-5 mt-2">
                <h3 className="text-[15px] font-bold text-white mb-1">Free</h3>
                <p className="text-[11px] text-gray-600 mb-4">
                  Try before you commit
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white tracking-tight">
                    ₦0
                  </span>
                  <span className="text-[12px] text-gray-600">/mo</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {[
                  { text: "1 job post (lifetime)", muted: true },
                  { text: "AI-powered CV scoring", muted: false },
                  { text: "Hiring pipeline", muted: false },
                  { text: "Candidate emails", muted: false },
                ].map(({ text, muted }) => (
                  <li
                    key={text}
                    className="flex items-center gap-2.5 text-[13px] text-gray-500"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: muted
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(124,58,237,0.12)",
                        border: muted
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(124,58,237,0.25)",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: muted
                            ? "rgba(255,255,255,0.2)"
                            : "rgb(167,139,250)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: muted ? "rgba(255,255,255,0.25)" : undefined,
                      }}
                    >
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="text-center text-[13px] font-semibold py-2.5 rounded-xl transition-all"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(109,40,217,0.15))",
                  color: "#a78bfa",
                  border: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                Get started free
              </Link>
            </div>

            {/* ── Paid plans ── */}
            {[
              {
                name: "Starter",
                price: "₦15,000",
                tagline: "For teams that hire occasionally",
                features: [
                  "5 active job posts",
                  "AI CV scoring",
                  "Email notifications",
                  "Hiring pipeline",
                  "Email support",
                ],
                highlight: false,
              },
              {
                name: "Growth",
                price: "₦35,000",
                tagline: "For growing teams with regular needs",
                features: [
                  "20 active job posts",
                  "AI CV scoring",
                  "Email notifications",
                  "Hiring pipeline",
                  "Advanced analytics",
                  "Priority support",
                ],
                highlight: true,
              },
              {
                name: "Scale",
                price: "₦75,000",
                tagline: "Unlimited hiring for high-growth orgs",
                features: [
                  "Unlimited job posts",
                  "AI CV scoring",
                  "Email notifications",
                  "Hiring pipeline",
                  "Advanced analytics",
                  "Dedicated support",
                ],
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="bento-card relative flex flex-col rounded-2xl border p-6"
                style={{
                  backgroundColor: plan.highlight
                    ? "rgba(124,58,237,0.06)"
                    : "#09090f",
                  borderColor: plan.highlight
                    ? "rgba(124,58,237,0.35)"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: plan.highlight
                    ? "0 0 40px rgba(124,58,237,0.1)"
                    : undefined,
                }}
              >
                {plan.highlight && (
                  <>
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 60%)",
                      }}
                    />
                    <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-3.5 py-1 rounded-full shadow-lg shadow-brand-600/30">
                      Most popular
                    </div>
                  </>
                )}
                <div className="relative z-10 mb-5">
                  <h3 className="text-[15px] font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-gray-600 mb-4">
                    {plan.tagline}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-[12px] text-gray-600">/mo</span>
                  </div>
                </div>
                <ul className="relative z-10 space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-[13px] text-gray-500"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-accent-500/30 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(16,185,129,0.07)" }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="relative z-10 text-center text-[13px] font-semibold py-2.5 rounded-xl transition-all"
                  style={
                    plan.highlight
                      ? { backgroundColor: "rgb(124,58,237)", color: "white" }
                      : {
                          backgroundColor: "rgba(255,255,255,0.04)",
                          color: "rgb(209,213,219)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="relative rounded-2xl overflow-hidden p-8 md:p-14 text-center border border-brand-600/15"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(91,33,182,0.08) 40%, rgba(16,185,129,0.06) 100%)",
              backgroundColor: "#0a0816",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div
              className="absolute top-[-30%] left-[20%] w-72 h-72 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
              }}
            />
            <div
              className="absolute bottom-[-30%] right-[15%] w-56 h-56 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)",
              }}
            />

            <div className="relative z-10">
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.22em] mb-4">
                Get started today
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                Ready to hire <span className="gradient-text">smarter?</span>
              </h2>
              <p className="text-[14px] text-gray-600 mb-8 max-w-md mx-auto">
                Join companies that have stopped drowning in CVs and started
                making better hires, faster.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-gray-100 text-surface-950 text-[14px] font-bold px-7 py-3.5 rounded-xl transition-all shadow-2xl shadow-black/30"
              >
                Start for free today <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 text-[11px] text-gray-700">
                Free plan included — no credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-12 px-6 mt-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div>
              <Logo />
              <p className="text-[13px] text-gray-700 mt-3 max-w-[180px] leading-relaxed">
                AI-powered recruitment for companies that move fast.
              </p>
            </div>
            <div className="flex gap-8 sm:gap-14">
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] mb-4">
                  Product
                </p>
                <div className="space-y-3">
                  <Link
                    href="#features"
                    className="block text-[13px] text-gray-600 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#pricing"
                    className="block text-[13px] text-gray-600 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/jobs"
                    className="block text-[13px] text-gray-600 hover:text-white transition-colors"
                  >
                    Job Board
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.15em] mb-4">
                  Account
                </p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block text-[13px] text-gray-600 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block text-[13px] text-gray-600 hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-gray-800">
              © {new Date().getFullYear()} HireX. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-[11px] text-gray-700 hover:text-gray-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <p className="text-[11px] text-gray-800">
                Built for companies that refuse to hire slowly.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
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
  );
}
