"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { removeToken, getStoredCompany } from "@/lib/auth";
import { authApi } from "@/lib/api";
import type { StoredCompany } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

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
    const s = getStoredCompany();
    if (!s) {
      router.replace("/login");
      return;
    }
    setCompany(s);
  }, [router]);

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
      className="h-screen flex overflow-hidden"
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
          <Link href="/dashboard" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              }}
            >
              <span className="text-[14px] font-black text-white">H</span>
            </div>
            <span className="text-[20px] font-bold text-white tracking-tight">
              HireX
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
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
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              }}
            >
              {initials}
            </div>
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
                <Icon className="w-5 h-5 flex-shrink-0" />
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
            <LogOut className="w-5 h-5 flex-shrink-0" />
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
              <Menu className="w-5 h-5" />
            </button>
            <span
              className="text-[16px] font-semibold"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {activeLabel}
            </span>
          </div>

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
          >
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
