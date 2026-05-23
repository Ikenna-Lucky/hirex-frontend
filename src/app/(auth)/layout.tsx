import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-600/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/5 blur-3xl pointer-events-none rounded-full" />

      {/* Minimal nav */}
      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-1">
          <span className="text-xl font-extrabold tracking-tight text-white">
            Hire<span className="text-accent-400">X</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} HireX. All rights reserved.
      </footer>
    </div>
  );
}
