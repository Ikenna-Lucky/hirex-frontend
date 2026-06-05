"use client";

import React from "react";
import { Warning, ArrowCounterClockwise } from "@phosphor-icons/react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Generic React class-based error boundary.
 * Wrap any client subtree to prevent a crash from blanking the whole page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <Warning weight="duotone" size={24} style={{ color: "#f87171" }} />
          </div>
          <p
            className="text-[16px] font-semibold mb-1"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Something went wrong
          </p>
          <p
            className="text-[13px] mb-6 max-w-sm"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {this.state.error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={this.reset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(124,58,237,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(124,58,237,0.15)";
            }}
          >
            <ArrowCounterClockwise weight="bold" size={14} />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
