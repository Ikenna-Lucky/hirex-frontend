"use client";

import React from "react";
import { ArrowCounterClockwise, Warning } from "@phosphor-icons/react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  error: Error | null;
}

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
        <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/10 text-red-300">
            <Warning weight="duotone" size={24} />
          </div>
          <p className="mb-1 text-[16px] font-bold text-white">
            Something went wrong
          </p>
          <p className="mb-6 max-w-sm text-[13px] leading-6 text-slate-500">
            This section could not load. Your data is safe. Try again in a
            moment.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
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
