"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  BriefcaseMetal,
  UsersThree,
  CreditCard,
  GearSix,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import { removeToken, getStoredCompany } from "@/lib/auth";
import { authApi } from "@/lib/api";
import type { StoredCompany } from "@/lib/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: SquaresFour },
  { href: "/dashboard/jobs", label: "Roles", icon: BriefcaseMetal },
  { href: "/dashboard/candidates", label: "Candidates", icon: UsersThree },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: GearSix },
];

/* ── Avatar: shows logo image or initials fallback ────────── */
function CompanyAvatar({
  logoUrl,
  initials,
  size,
  borderRadius,
  fontSize,
}: {
  logoUrl?: string | null;
  initials: string;
  size: number;
  borderRadius: number | string;
  fontSize: number;
}) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when logoUrl changes
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
          borderRadius,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
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

  // Re-read company from localStorage on every navigation so logo/name updates propagate
  useEffect(() => {
    const s = getStoredCompany();
    if (!s) {
      router.replace("/login");
      return;
    }
    setCompany(s);
  }, [router, pathname]);

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      /**/
    }
    removeToken();
    router.replace("/login");
  };

  if (!company) return null;

  const initials = company.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const activeLabel =
    NAV.find((n) =>
      n.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(n.href),
    )?.label ?? "Dashboard";

  return (
    <div
      className="font-inter h-screen flex overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ════════════════════════
          SIDEBAR  w-[280px]
      ════════════════════════ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-[280px] flex flex-col flex-shrink-0
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
        style={{
          background: "#0e0e1a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Logo ── */}
        <div
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{
            height: "68px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Link href="/dashboard">
            <span
              style={{
                fontSize: "21px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#fff",
                fontFamily: "'Syne', system-ui, sans-serif",
              }}
            >
              Hire<span style={{ color: "#a78bfa" }}>X</span>
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white/30 hover:text-white/60 transition-colors"
          >
            <X weight="bold" size={18} />
          </button>
        </div>

        {/* ── Company card ── */}
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <CompanyAvatar
              logoUrl={company.logoUrl}
              initials={initials}
              size={40}
              borderRadius={10}
              fontSize={13}
            />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-white truncate leading-tight">
                {company.name}
              </p>
              <p
                className="text-[12px] truncate mt-0.5"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {company.email}
              </p>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="mx-5 my-3"
          style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
        />

        {/* ── Nav label ── */}
        <p
          className="px-6 pb-2 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Main menu
        </p>

        {/* ── Nav items ── */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors"
                style={
                  active
                    ? {
                        background: "rgba(124,58,237,0.15)",
                        color: "#a78bfa",
                        border: "1px solid rgba(124,58,237,0.2)",
                      }
                    : {
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid transparent",
                      }
                }
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.85)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.45)";
                    (e.currentTarget as HTMLElement).style.background = "";
                  }
                }}
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

        {/* ── Sign out ── */}
        <div
          className="px-4 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <button
            onClick={signOut}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors"
            style={{
              color: "rgba(255,255,255,0.35)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#f87171";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(239,68,68,0.07)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(239,68,68,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.35)";
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.borderColor =
                "transparent";
            }}
          >
            <SignOut weight="duotone" size={18} className="flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ════════════════════════
          MAIN CONTENT
      ════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-8 flex-shrink-0"
          style={{
            height: "68px",
            background: "rgba(10,10,15,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-white/40 hover:text-white/70 transition-colors"
            >
              <List weight="bold" size={20} />
            </button>
            <span
              className="text-[16px] font-semibold"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {activeLabel}
            </span>
          </div>

          <CompanyAvatar
            logoUrl={company.logoUrl}
            initials={initials}
            size={36}
            borderRadius="50%"
            fontSize={12}
          />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
