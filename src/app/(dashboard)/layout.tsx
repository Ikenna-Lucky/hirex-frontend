"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseMetal,
  CreditCard,
  GearSix,
  List,
  SignOut,
  SquaresFour,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { authApi } from "@/lib/api";
import { clearStoredCompany, getStoredCompany } from "@/lib/auth";
import type { StoredCompany } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/dashboard/jobs", label: "Roles", icon: BriefcaseMetal },
  { href: "/dashboard/candidates", label: "Candidates", icon: UsersThree },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: GearSix },
];

function CompanyAvatar({
  logoUrl,
  initials,
  size,
  radius,
  fontSize,
}: {
  logoUrl?: string | null;
  initials: string;
  size: number;
  radius: number | string;
  fontSize: number;
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt="Company logo"
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center bg-violet-600 text-white"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize,
        fontWeight: 800,
      }}
    >
      {initials}
    </div>
  );
}

function Logo() {
  return (
    <Link href="/dashboard" className="inline-flex items-center">
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [company, setCompany] = useState<StoredCompany | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredCompany();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setCompany(stored);
  }, [router, pathname]);

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      /* Ignore logout network failures and clear local session. */
    }
    clearStoredCompany();
    router.replace("/login");
  };

  if (!company) return null;

  const initials = company.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const activeLabel =
    NAV.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href),
    )?.label ?? "Dashboard";

  return (
    <div className="font-inter flex h-screen overflow-hidden bg-[#07080d] text-slate-100">
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[272px] flex-shrink-0 flex-col border-r border-white/[0.07] bg-[#0b0c13] transition-transform duration-200 md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200 md:hidden"
            aria-label="Close menu"
          >
            <X weight="bold" size={18} />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.035] p-3">
            <CompanyAvatar
              logoUrl={company.logoUrl}
              initials={initials}
              size={38}
              radius={8}
              fontSize={12}
            />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold leading-tight text-white">
                {company.name}
              </p>
              <p className="mt-1 truncate text-[12px] text-slate-600">
                {company.email}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          <p className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-700">
            Main menu
          </p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-[14px] font-semibold transition ${
                  active
                    ? "border-violet-400/20 bg-violet-500/[0.13] text-violet-200"
                    : "border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-200"
                }`}
              >
                <Icon
                  weight={active ? "fill" : "regular"}
                  size={18}
                  className="flex-shrink-0"
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-[14px] font-semibold text-slate-600 transition hover:border-red-400/10 hover:bg-red-400/[0.07] hover:text-red-300"
          >
            <SignOut weight="duotone" size={18} className="flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#090a10]/95 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200 md:hidden"
              aria-label="Open menu"
            >
              <List weight="bold" size={20} />
            </button>
            <div>
              <p className="text-[13px] font-semibold text-slate-500">HireX</p>
              <h1 className="text-[15px] font-bold leading-tight text-slate-200">
                {activeLabel}
              </h1>
            </div>
          </div>

          <CompanyAvatar
            logoUrl={company.logoUrl}
            initials={initials}
            size={34}
            radius="50%"
            fontSize={11}
          />
        </header>

        <main className="flex-1 overflow-y-auto bg-[#07080d]">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-5 md:px-8 md:py-7">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
