import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HireX collects, uses, and protects your data. NDPR compliant.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07080d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <Logo />
          <Link
            href="/"
            className="text-[13px] font-bold text-slate-500 transition hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-12">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Last updated: June 2025
          </p>
          <h1 className="mt-3 text-[38px] font-black tracking-tight text-white md:text-[48px]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-slate-500">
            HireX is committed to protecting your personal information. This
            policy explains what data we collect, how we use it, and your rights
            under the Nigeria Data Protection Regulation (NDPR) and applicable
            law.
          </p>
        </header>

        <div className="space-y-8">
          <Section title="1. Who We Are">
            <p>
              HireX is an AI-powered recruitment platform that helps companies
              screen and manage job applications. For data-related enquiries,
              contact us at <PolicyLink href="mailto:privacy@hirex.ng">privacy@hirex.ng</PolicyLink>.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p>We collect different categories of data depending on how you use HireX.</p>
            <SubHeading>Company accounts</SubHeading>
            <List
              items={[
                "Company name, email address, and password hashed with Argon2id.",
                "Company logo, website, industry, size, and description.",
                "Subscription and billing information processed by Paystack.",
                "Login timestamps and failed login attempts for account security.",
              ]}
            />
            <SubHeading>Candidates</SubHeading>
            <List
              items={[
                "Full name, email address, and phone number.",
                "CV or resume PDF, stored securely on Cloudinary.",
                "LinkedIn and portfolio URLs when provided.",
                "Cover letter and application notes when provided.",
              ]}
            />
            <SubHeading>Automatically collected</SubHeading>
            <List
              items={[
                "Error logs and crash reports via Sentry.",
                "API request logs such as IP address, endpoint, and timestamp for security and debugging.",
              ]}
            />
          </Section>

          <Section title="3. How We Use Your Data">
            <List
              items={[
                "Provide and operate the HireX platform.",
                "Score and rank candidate applications using AI.",
                "Send candidates transactional emails about application status.",
                "Process subscription payments through Paystack.",
                "Prevent fraud, abuse, and unauthorised access.",
                "Fix bugs, improve performance, and comply with legal obligations.",
              ]}
            />
            <p>
              We do not sell your data. We do not use your data to train AI
              models beyond the scope of scoring applications for the job they
              were submitted for.
            </p>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <List
              items={[
                "Contract: processing necessary to provide the service you signed up for.",
                "Legitimate interests: security monitoring, fraud prevention, and platform improvement.",
                "Consent: where you have explicitly opted in.",
                "Legal obligation: where we are required to retain records by law.",
              ]}
            />
          </Section>

          <Section title="5. Data Sharing">
            <p>
              We share data only with trusted sub-processors required to operate
              the platform.
            </p>
            <List
              items={[
                "Neon: PostgreSQL database hosting.",
                "Cloudinary: CV and logo file storage.",
                "Render: API and worker server hosting.",
                "Paystack: payment processing.",
                "Resend: transactional email delivery.",
                "Sentry: error monitoring.",
                "OpenAI: AI-powered CV scoring using CV text and job description.",
              ]}
            />
            <p>
              Sub-processors are bound by data processing agreements and are
              required to handle data in accordance with applicable law.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <List
              items={[
                "Company account data is retained while the account is active, plus 30 days after deletion.",
                "Candidate CVs and application data are retained until the receiving company account is deleted.",
                "Authentication refresh tokens expire after 30 days and are purged automatically.",
                "Error logs are retained for 90 days.",
              ]}
            />
          </Section>

          <Section title="7. Cookies and Authentication">
            <p>
              HireX uses httpOnly cookies to store authentication tokens. These
              cookies cannot be accessed by JavaScript in the browser, which
              helps protect against XSS attacks. We do not use third-party
              tracking cookies or advertising cookies.
            </p>
          </Section>

          <Section title="8. Your Rights Under the NDPR">
            <List
              items={[
                "Access: request a copy of the personal data we hold about you.",
                "Rectification: correct inaccurate or incomplete data.",
                "Erasure: request deletion of your personal data.",
                "Restriction: ask us to limit how we process your data.",
                "Portability: receive your data in a structured, machine-readable format.",
                "Objection: object to processing based on legitimate interests.",
              ]}
            />
            <p>
              To exercise these rights, email <PolicyLink href="mailto:privacy@hirex.ng">privacy@hirex.ng</PolicyLink>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section title="9. Account Deletion">
            <p>
              You can permanently delete your HireX account and associated data
              from your dashboard settings. Deletion is irreversible and removes
              your company profile, jobs, applications, candidate data,
              subscription record, and authentication tokens.
            </p>
            <p>
              If you cannot log in, email <PolicyLink href="mailto:privacy@hirex.ng">privacy@hirex.ng</PolicyLink>.
              We will process your request within 14 days.
            </p>
          </Section>

          <Section title="10. Data Security">
            <List
              items={[
                "Passwords are hashed with Argon2id.",
                "Authentication uses short-lived httpOnly cookies.",
                "Accounts lock after repeated failed login attempts.",
                "Data in transit is encrypted with TLS.",
                "Database access is restricted to application servers.",
                "Sentry monitoring helps detect and resolve issues quickly.",
              ]}
            />
            <p>
              To report a security vulnerability, contact{" "}
              <PolicyLink href="mailto:security@hirex.ng">security@hirex.ng</PolicyLink>.
            </p>
          </Section>

          <Section title="11. Children">
            <p>
              HireX is not intended for anyone under the age of 18. We do not
              knowingly collect personal data from minors.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this policy from time to time. When we do, we will
              update the last updated date and, where required by law, notify
              users by email.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <div className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4">
              <p className="font-bold text-white">HireX Data Protection</p>
              <p className="mt-1 text-[14px] text-slate-500">
                Email: <PolicyLink href="mailto:privacy@hirex.ng">privacy@hirex.ng</PolicyLink>
              </p>
            </div>
          </Section>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-8 text-center text-[12px] text-slate-700">
        Copyright {new Date().getFullYear()} HireX. All rights reserved.
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="HireX home">
      <span
        style={{
          fontSize: "21px",
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/[0.07] pt-6">
      <h2 className="text-[20px] font-bold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-3 space-y-4 text-[14px] leading-7 text-slate-500">
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pt-1 text-[13px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </h3>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-3 h-1 w-1 flex-shrink-0 rounded-full bg-violet-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PolicyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-semibold text-violet-300 underline decoration-violet-300/30 underline-offset-4 transition hover:text-violet-200"
    >
      {children}
    </a>
  );
}
