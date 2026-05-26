import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HireX — AI-Powered Recruitment", template: "%s | HireX" },
  description:
    "Stop drowning in CVs. HireX reads every application, scores it against your job requirements, and tells you exactly who to call.",
  keywords: [
    "recruitment",
    "AI hiring",
    "CV screening",
    "ATS",
    "applicant tracking",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { font-family: 'Space Grotesk', system-ui, sans-serif; }
        `}</style>
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111118",
              color: "#f9fafb",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "13px",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#f9fafb" },
            },
            error: { iconTheme: { primary: "#ef4444", secondary: "#f9fafb" } },
          }}
        />
      </body>
    </html>
  );
}
