import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
  CheckCircle2,
  Mail,
  Clock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-gray-100">
      {/* ─── Navbar ───────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-surface-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 rounded-full px-4 py-1.5 text-sm text-brand-400 mb-8">
            <Brain className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Stop reading CVs.{" "}
            <span className="gradient-text">Start hiring people.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            HireX reads every application, scores each candidate against your
            job requirements, and surfaces who&apos;s worth calling — before
            you&apos;ve had your morning coffee.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40"
            >
              Start hiring smarter
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 font-medium px-7 py-3.5 rounded-xl transition-all"
            >
              Browse open roles
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required to start. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ─── Stats strip ──────────────────────────────────── */}
      <section className="border-y border-white/5 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "< 60s", label: "CV scored in under a minute" },
            { value: "0–100", label: "Precision match score per candidate" },
            { value: "5×", label: "Faster shortlisting vs manual review" },
            { value: "100%", label: "Candidates notified automatically" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything your hiring team needs.{" "}
              <span className="text-gray-500">Nothing they don&apos;t.</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built for teams that take hiring seriously but refuse to let it
              consume their entire week.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                color: "brand",
                title: "AI CV Scoring",
                description:
                  "Every CV is analysed against your job description. Candidates get a 0–100 match score with a breakdown of strengths and gaps — no bias, no guesswork.",
              },
              {
                icon: BarChart3,
                color: "accent",
                title: "Ranked Pipeline",
                description:
                  "Candidates are ranked by fit, not by who applied first. Move them through stages — screening, interview, offer — with one click.",
              },
              {
                icon: Mail,
                color: "brand",
                title: "Automatic Notifications",
                description:
                  "Every stage change fires a professional, branded email to the candidate. Applied, shortlisted, rejected, offered — they always know where they stand.",
              },
              {
                icon: Zap,
                color: "accent",
                title: "Async Processing",
                description:
                  "CV scoring happens in the background via a dedicated queue. Your candidates get a response the moment they apply. You get results in under a minute.",
              },
              {
                icon: Clock,
                color: "brand",
                title: "Application Deadlines",
                description:
                  "Set a closing date on any job post. Applications stop automatically. No more fielding CVs for a role you already filled three weeks ago.",
              },
              {
                icon: CheckCircle2,
                color: "accent",
                title: "Audit Trail",
                description:
                  "Every stage move is logged with who made it and when. Full hiring history for every candidate, every role, forever.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="group p-6 rounded-2xl bg-surface-900 border border-white/5 hover:border-brand-600/30 transition-all hover:bg-surface-900/80"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    feat.color === "brand"
                      ? "bg-brand-600/10 text-brand-400"
                      : "bg-accent-500/10 text-accent-400"
                  }`}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-surface-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From post to hire in four steps
            </h2>
            <p className="text-gray-400">
              No implementation. No training. Just results.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Post your job",
                description:
                  "Write your job description once. HireX uses it as the benchmark every CV is scored against.",
              },
              {
                step: "02",
                title: "Candidates apply",
                description:
                  "They submit their CV through your public job page. They get an instant confirmation. You get a queue that fills itself.",
              },
              {
                step: "03",
                title: "AI scores every CV",
                description:
                  "Gemini reads each CV against your job description and returns a match score, a summary, and a breakdown of fit. Automatically. In the background.",
              },
              {
                step: "04",
                title: "You hire the right person",
                description:
                  "Open your dashboard to a ranked list of candidates. Move the best ones forward. The rest get a respectful, professional rejection — sent by HireX.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 p-6 rounded-2xl bg-surface-900 border border-white/5"
              >
                <span className="text-3xl font-black gradient-text shrink-0 w-12">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent pricing. No surprises.
            </h2>
            <p className="text-gray-400">
              All plans include AI scoring, email notifications, and the full
              pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                className={`relative p-6 rounded-2xl border flex flex-col ${
                  plan.highlight
                    ? "bg-brand-600/5 border-brand-600/40 glow-brand"
                    : "bg-surface-900 border-white/5"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-accent-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`text-center text-sm font-semibold py-3 rounded-xl transition-all ${
                    plan.highlight
                      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/25"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} HireX. Built for the companies that
            move fast.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/jobs" className="hover:text-white transition-colors">
              Job Board
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1">
      <span className="text-xl font-extrabold tracking-tight text-white">
        Hire<span className="text-accent-400">X</span>
      </span>
    </Link>
  );
}
