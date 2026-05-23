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
  ChevronRight,
} from "lucide-react";
import { removeToken, getStoredCompany } from "@/lib/auth";
import { authApi } from "@/lib/api";
import type { StoredCompany } from "@/lib/auth";

const NAV_LINKS = [
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    const stored = getStoredCompany();
    if (!stored) {
      router.replace("/login");
      return;
    }
    setCompany(stored);
  }, [router]);

  const handleSignOut = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    removeToken();
    router.replace("/login");
  };

  if (!company) return null; // prevents flash before redirect

  return (
    <div className="min-h-screen bg-surface-950 text-gray-100 flex">
      {/* ─── Mobile overlay ───────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ──────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-60 bg-surface-900 border-r border-white/5 flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-auto`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="text-lg font-extrabold tracking-tight text-white">
              Hire<span className="text-accent-400">X</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Company info */}
        <div className="px-4 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {company.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{company.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand-600/10 text-brand-400 border border-brand-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {isActive && (
                  <ChevronRight className="w-3 h-3 ml-auto text-brand-600/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden h-14 px-4 flex items-center gap-3 border-b border-white/5 bg-surface-900/80 backdrop-blur sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-base font-extrabold tracking-tight text-white">
            Hire<span className="text-accent-400">X</span>
          </span>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
