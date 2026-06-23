import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HireX collects, uses, and protects your data. NDPR compliant.",
};

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen text-gray-100"
      style={{ backgroundColor: "#04040e" }}
    >
      {/* ─── Minimal Navbar ─────────────────────────────── */}
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

          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </nav>
      </div>

      {/* ─── Content ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-medium mb-3" style={{ color: "#a78bfa" }}>
            Last updated: June 2025
          </p>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            HireX (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your personal information. This policy
            explains what data we collect, how we use it, and your rights under
            the Nigeria Data Protection Regulation (NDPR) and applicable law.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <Section title="1. Who We Are">
            <p>
              HireX is an AI-powered recruitment platform that helps companies
              screen and manage job applications. Our registered address and
              contact details are available at the bottom of this page. For
              data-related enquiries, contact us at{" "}
              <a
                href="mailto:privacy@hirex.ng"
                className="underline"
                style={{ color: "#a78bfa" }}
              >
                privacy@hirex.ng
              </a>
              .
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p className="mb-3">
              We collect different categories of data depending on how you use
              HireX:
            </p>
            <SubHeading>Company accounts (recruiters)</SubHeading>
            <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
              <li>
                Company name, email address, and password (hashed with Argon2id)
              </li>
              <li>Company logo, website, industry, size, and description</li>
              <li>
                Subscription and billing information (processed by Paystack)
              </li>
              <li>
                Login timestamps and failed login attempts (for account
                security)
              </li>
            </ul>
            <SubHeading>Candidates</SubHeading>
            <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
              <li>Full name, email address, and phone number</li>
              <li>CV / résumé (PDF, stored securely on Cloudinary)</li>
              <li>LinkedIn and portfolio URLs (optional)</li>
              <li>Cover letter (optional)</li>
            </ul>
            <SubHeading>Automatically collected</SubHeading>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>
                Error logs and crash reports via Sentry (no personal data in
                stack traces)
              </li>
              <li>
                API request logs (IP address, endpoint, timestamp) for security
                and debugging
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <p className="mb-3">We use the data we collect to:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Provide and operate the HireX platform</li>
              <li>Score and rank candidate applications using AI</li>
              <li>
                Send candidates transactional emails about their application
                status
              </li>
              <li>Process subscription payments via Paystack</li>
              <li>Prevent fraud, abuse, and unauthorised access</li>
              <li>Fix bugs and improve platform performance</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3 text-gray-400">
              We do not sell your data to third parties. We do not use your data
              to train AI models beyond the scope of scoring applications for
              the job they were submitted for.
            </p>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <p>
              We process personal data under the following legal bases as
              recognised by the NDPR:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1 mt-3">
              <li>
                <strong className="text-gray-200">Contract</strong> — processing
                necessary to provide the service you signed up for
              </li>
              <li>
                <strong className="text-gray-200">Legitimate interests</strong>{" "}
                — security monitoring, fraud prevention, and platform
                improvement
              </li>
              <li>
                <strong className="text-gray-200">Consent</strong> — where you
                have explicitly opted in (e.g. marketing emails, if applicable)
              </li>
              <li>
                <strong className="text-gray-200">Legal obligation</strong> —
                where we are required to retain records by law
              </li>
            </ul>
          </Section>

          <Section title="5. Data Sharing">
            <p className="mb-3">
              We share data only with trusted sub-processors required to operate
              the platform:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>
                <strong className="text-gray-200">Neon</strong> — PostgreSQL
                database hosting (EU/US region)
              </li>
              <li>
                <strong className="text-gray-200">Cloudinary</strong> — CV and
                logo file storage
              </li>
              <li>
                <strong className="text-gray-200">Render</strong> — API and
                worker server hosting
              </li>
              <li>
                <strong className="text-gray-200">Paystack</strong> — payment
                processing (governed by Paystack&apos;s own privacy policy)
              </li>
              <li>
                <strong className="text-gray-200">Resend</strong> —
                transactional email delivery
              </li>
              <li>
                <strong className="text-gray-200">Sentry</strong> — error
                monitoring (anonymised crash reports only)
              </li>
              <li>
                <strong className="text-gray-200">OpenAI</strong> — AI-powered
                CV scoring (CV text and job description only; not stored by
                OpenAI for training per their data processing agreement)
              </li>
            </ul>
            <p className="mt-3 text-gray-400">
              All sub-processors are bound by data processing agreements and are
              required to handle data in accordance with applicable law.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>
                Company account data is retained for as long as the account is
                active, plus 30 days after deletion to allow recovery from
                accidental deletions.
              </li>
              <li>
                Candidate CVs and application data are retained until the
                company account that received the application is deleted.
              </li>
              <li>
                Authentication tokens (refresh tokens) expire after 30 days and
                are purged automatically.
              </li>
              <li>Error logs are retained for 90 days.</li>
            </ul>
          </Section>

          <Section title="7. Cookies & Authentication">
            <p>
              HireX uses{" "}
              <strong className="text-gray-200">httpOnly cookies</strong> to
              store authentication tokens. These cookies cannot be accessed by
              JavaScript in the browser, which protects against XSS attacks. We
              do not use third-party tracking cookies or advertising cookies.
            </p>
            <p className="mt-3 text-gray-400">
              The cookies we set are strictly necessary for the platform to
              function. You cannot opt out of these without logging out.
            </p>
          </Section>

          <Section title="8. Your Rights Under the NDPR">
            <p className="mb-3">
              As a data subject under the Nigeria Data Protection Regulation,
              you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>
                <strong className="text-gray-200">Access</strong> — request a
                copy of the personal data we hold about you
              </li>
              <li>
                <strong className="text-gray-200">Rectification</strong> —
                correct inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-gray-200">Erasure</strong> — request
                deletion of your personal data (see section 9 below)
              </li>
              <li>
                <strong className="text-gray-200">Restriction</strong> — ask us
                to limit how we process your data in certain circumstances
              </li>
              <li>
                <strong className="text-gray-200">Portability</strong> — receive
                your data in a structured, machine-readable format
              </li>
              <li>
                <strong className="text-gray-200">Objection</strong> — object to
                processing based on legitimate interests
              </li>
            </ul>
            <p className="mt-3 text-gray-400">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:privacy@hirex.ng"
                className="underline"
                style={{ color: "#a78bfa" }}
              >
                privacy@hirex.ng
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="9. Account Deletion">
            <p>
              You can permanently delete your HireX account and all associated
              data at any time. To do so, go to{" "}
              <strong className="text-gray-200">
                Settings → Account → Delete Account
              </strong>{" "}
              in your dashboard. You will be asked to confirm your password
              before deletion proceeds.
            </p>
            <p className="mt-3 text-gray-400">
              Deletion is irreversible and will permanently remove:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1 mt-2">
              <li>Your company profile and all company data</li>
              <li>All job listings you have posted</li>
              <li>
                All applications and candidate data associated with your jobs
              </li>
              <li>Your subscription record</li>
              <li>All authentication tokens</li>
            </ul>
            <p className="mt-3 text-gray-400">
              If you are unable to log in to initiate deletion yourself, email{" "}
              <a
                href="mailto:privacy@hirex.ng"
                className="underline"
                style={{ color: "#a78bfa" }}
              >
                privacy@hirex.ng
              </a>{" "}
              and we will process your request within 14 days.
            </p>
          </Section>

          <Section title="10. Data Security">
            <p>We take security seriously. Key measures include:</p>
            <ul className="list-disc list-inside text-gray-400 space-y-1 mt-3">
              <li>Passwords hashed with Argon2id (memory-hard algorithm)</li>
              <li>
                Authentication via short-lived httpOnly cookies (15-minute
                access tokens)
              </li>
              <li>Account lockout after 5 consecutive failed login attempts</li>
              <li>All data in transit encrypted with TLS 1.2+</li>
              <li>
                Database access restricted to application servers via
                allowlisted IPs
              </li>
              <li>
                Error monitoring with Sentry to detect and fix issues quickly
              </li>
            </ul>
            <p className="mt-3 text-gray-400">
              If you discover a security vulnerability, please disclose it
              responsibly to{" "}
              <a
                href="mailto:security@hirex.ng"
                className="underline"
                style={{ color: "#a78bfa" }}
              >
                security@hirex.ng
              </a>
              .
            </p>
          </Section>

          <Section title="11. Children">
            <p>
              HireX is not intended for use by anyone under the age of 18. We do
              not knowingly collect personal data from minors. If you believe we
              have inadvertently collected such data, please contact us
              immediately.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this policy from time to time. When we do, we will
              update the &quot;Last updated&quot; date at the top of this page
              and, where required by law, notify you by email. Continued use of
              HireX after a policy update constitutes your acceptance of the
              revised policy.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <p>
              For any questions, concerns, or requests relating to this policy
              or your personal data, contact our Data Protection Officer:
            </p>
            <div
              className="mt-4 p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-gray-300 font-medium">HireX Data Protection</p>
              <p className="text-gray-400 text-sm mt-1">
                Email:{" "}
                <a
                  href="mailto:privacy@hirex.ng"
                  style={{ color: "#a78bfa" }}
                  className="underline"
                >
                  privacy@hirex.ng
                </a>
              </p>
            </div>
          </Section>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────── */}
      <div
        className="border-t py-8 text-center"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} HireX. All rights reserved.{" "}
          <Link
            href="/privacy"
            className="hover:text-gray-400 transition-colors underline"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4" style={{ color: "#e5e7eb" }}>
        {title}
      </h2>
      <div className="text-gray-400 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-200 font-medium mt-4 mb-1">{children}</p>;
}
