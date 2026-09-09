import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const workflow = [
  {
    icon: Briefcase,
    title: "Post the role once",
    body: "Write the job description, requirements, salary range, and deadline. HireX turns that into the scoring brief.",
  },
  {
    icon: FileText,
    title: "Collect applications cleanly",
    body: "Candidates apply through a public job page with their CV, cover note, links, and contact details in one place.",
  },
  {
    icon: Sparkles,
    title: "Rank by fit",
    body: "Every CV is scored against the role so your team sees the strongest matches before the inbox gets noisy.",
  },
  {
    icon: Mail,
    title: "Move people forward",
    body: "Shortlist, interview, offer, or reject candidates while keeping applicants updated as their stage changes.",
  },
];

const productPoints = [
  {
    icon: BarChart3,
    title: "A ranked pipeline, not a spreadsheet",
    body: "See scores, stages, notes, and CV links together, then filter candidates by the decision you need to make.",
  },
  {
    icon: Search,
    title: "Search across your talent pool",
    body: "Find applicants by name, email, role, or latest application instead of digging through email attachments.",
  },
  {
    icon: ShieldCheck,
    title: "Built around recruiter control",
    body: "AI explains fit signals and gaps, but your team still owns the hiring decision and candidate movement.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "NGN 0",
    detail: "1 role post",
    features: ["CV scoring", "Hiring pipeline", "Candidate emails"],
  },
  {
    name: "Starter",
    price: "NGN 15,000",
    detail: "5 active roles",
    features: ["Everything in Free", "More active posts", "Email support"],
  },
  {
    name: "Growth",
    price: "NGN 35,000",
    detail: "20 active roles",
    featured: true,
    features: [
      "Advanced analytics",
      "Priority support",
      "Best for growing teams",
    ],
  },
  {
    name: "Scale",
    price: "NGN 75,000",
    detail: "Unlimited roles",
    features: ["Dedicated support", "High-volume hiring", "Full pipeline access"],
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden text-gray-100"
      style={{ backgroundColor: "#05060a" }}
    >
      <LandingNavbar />

      <section className="relative px-4 pb-14 pt-28 sm:px-6 md:pb-16 md:pt-[7.5rem]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-1.5 text-[12px] font-semibold text-gray-300 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Built for teams screening real CV volume
            </div>

            <h1
              className="font-black leading-[1.04] tracking-tight text-[#f4f6fb]"
              style={{ fontSize: "clamp(2.35rem, 4.65vw, 4.45rem)" }}
            >
              Hire from a ranked shortlist, not a crowded inbox.
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-400 md:text-[17px] md:leading-8">
              Post a role, collect CVs, and let HireX score every applicant
              against the job before your team starts reviewing.
            </p>

            <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[14px] font-bold text-surface-950 transition hover:bg-gray-100"
              >
                Post your first role
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[14px] font-semibold text-gray-300 transition hover:border-white/20 hover:text-white"
              >
                View public job board
              </Link>
            </div>

          </div>

          <ProductPreview />
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-28 border-y border-white/[0.06] bg-white/[0.015] px-4 py-14 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Product"
            tone="green"
            title="The work recruiters repeat every week, made easier."
          >
            <>
              HireX is not trying to replace hiring judgment. It clears the
              pile so good judgment has room to work.
            </>
          </SectionHeader>

          <div className="grid gap-3 md:grid-cols-3">
            {productPoints.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-6"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10">
                  <Icon className="h-5 w-5 text-violet-300" />
                </div>
                <h3 className="text-[16px] font-bold text-white">{title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-gray-500">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Workflow"
            tone="violet"
            title="From job post to shortlist without the manual CV marathon."
          />

          <div className="grid gap-3 md:grid-cols-4">
            {workflow.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className="rounded-lg border border-white/[0.07] bg-[#0c0d13] p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                    <Icon className="h-4 w-4 text-emerald-300" />
                  </div>
                  <span className="text-[12px] font-black text-white/20">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white">{title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-gray-500">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-28 border-y border-white/[0.06] bg-[#080910] px-4 py-16 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Pricing"
            tone="green"
            title="Start with one role. Upgrade when hiring picks up."
          >
            <>
              Every plan includes scoring, candidate profiles, stage tracking,
              and a public application page.
            </>
          </SectionHeader>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pricing.map((plan) => (
              <article
                key={plan.name}
                className="flex rounded-lg border p-5"
                style={{
                  background: plan.featured ? "#101425" : "#0d0f16",
                  borderColor: plan.featured
                    ? "rgba(52,211,153,0.28)"
                    : "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex min-h-[260px] w-full flex-col">
                  {plan.featured && (
                    <span className="mb-4 w-fit rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                      Most useful
                    </span>
                  )}
                  <h3 className="text-[16px] font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-3 text-[26px] font-black text-white">
                    {plan.price}
                  </p>
                  <p className="mt-1 text-[13px] text-gray-500">
                    {plan.detail}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2 text-[13px] leading-5 text-gray-400"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="mt-7 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-white/[0.08]"
                  >
                    Get started
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-white/[0.07] bg-[#0d0f16] p-7 md:p-9">
          <div className="flex max-w-4xl flex-col items-start gap-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-300">
              HireX
            </p>
            <h2 className="max-w-3xl text-2xl font-black tracking-tight text-white md:text-4xl">
              Give every applicant a fair first review, then spend your time on
              the best conversations.
            </h2>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-[14px] font-black text-surface-950 transition hover:bg-emerald-300"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <Logo />
          <div className="flex flex-wrap gap-5 text-[13px] text-gray-500">
            <Link href="#features" className="hover:text-white">
              Product
            </Link>
            <Link href="#how-it-works" className="hover:text-white">
              Workflow
            </Link>
            <Link href="#pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </div>
          <p className="text-[12px] text-gray-600">
            Copyright {new Date().getFullYear()} HireX.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  tone,
  children,
}: {
  eyebrow: string;
  title: string;
  tone: "green" | "violet";
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-9 max-w-3xl">
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.22em] ${
          tone === "green" ? "text-emerald-400" : "text-violet-300"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {children && (
        <p className="mt-4 max-w-2xl text-[14px] leading-7 text-gray-500">
          {children}
        </p>
      )}
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto mt-9 max-w-6xl">
      <div className="absolute -inset-5 rounded-[32px] bg-violet-600/10 blur-2xl" />
      <div className="absolute inset-x-12 -top-8 h-24 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0b0d14] p-2 shadow-2xl shadow-black/50 md:p-3">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <p className="hidden text-[11px] font-semibold text-gray-500 sm:block">
            app.hirex.ai/dashboard
          </p>
        </div>

        <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-[#090a10] sm:aspect-[16/9] lg:aspect-[16/8.7]">
          <img
            src="/images/hirex-dashboard.png"
            alt="HireX recruiter dashboard showing job stats, recent jobs, billing prompt, and pipeline overview"
            className="h-full w-full object-cover object-left-top"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05060a]/65 to-transparent" />
        </div>
      </div>
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
