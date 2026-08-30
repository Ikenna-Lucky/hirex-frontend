"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { href: "#features", label: "Product" },
  { href: "#how-it-works", label: "Workflow" },
  { href: "#pricing", label: "Pricing" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-300 ease-out"
      style={{ padding: scrolled ? "16px 20px 0" : "0px" }}
    >
      <nav
        className="flex w-full items-center justify-between transition-all duration-300 ease-out"
        style={{
          maxWidth: scrolled ? "1040px" : "100%",
          padding: scrolled ? "11px 16px" : "18px 32px",
          borderRadius: scrolled ? "18px" : "0px",
          backgroundColor: scrolled
            ? "rgba(6,7,14,0.86)"
            : "rgba(5,6,10,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderTop: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          borderRight: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          borderLeft: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "none",
        }}
      >
        <Link href="/" className="flex-shrink-0" aria-label="HireX home">
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

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-semibold text-gray-500 transition-colors duration-150 hover:bg-white/[0.045] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div
            className="hidden h-4 w-px md:block"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          />

          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-500 transition-colors duration-150 hover:bg-white/[0.045] hover:text-white sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-bold text-white transition-all duration-150 sm:px-4 sm:text-[13px]"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow:
                "0 8px 22px rgba(124,58,237,0.24), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            Post a role
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
