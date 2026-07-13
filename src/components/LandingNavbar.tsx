"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
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
      className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-[padding] duration-500 ease-out"
      style={{ padding: scrolled ? "20px 20px 0" : "0px" }}
    >
      <nav
        className="flex items-center justify-between w-full transition-all duration-500 ease-out"
        style={{
          maxWidth: scrolled ? "880px" : "100%",
          padding: scrolled ? "12px 20px" : "18px 32px",
          borderRadius: scrolled ? "16px" : "0px",
          backgroundColor: scrolled ? "rgba(6,6,18,0.85)" : "rgba(4,4,14,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          borderLeft: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          borderRight: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid transparent",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled
            ? "0 0 0 1px rgba(255,255,255,0.02) inset, 0 12px 40px rgba(0,0,0,0.55)"
            : "none",
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

        {/* ── Center links ── */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {LINKS.map(({ href, label }) => (
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
  );
}
