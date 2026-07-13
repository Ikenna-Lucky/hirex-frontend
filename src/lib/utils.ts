import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Turns an API/network error into a message safe to show a user.
 *
 * - No response at all (offline, CORS, DNS, connection refused) → generic
 *   connectivity message.
 * - 502/503/504 (gateway/server temporarily down — e.g. a cold-starting
 *   Neon DB or Render instance) → "try again in a moment" message.
 * - Anything else → the server's own message, falling back to `fallback`.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  const error = err as AxiosError<ApiResponse>;

  if (!error?.response) {
    return "Can't reach the server right now. Check your connection and try again.";
  }

  const status = error.response.status;
  if (status === 502 || status === 503 || status === 504) {
    return "The server is temporarily unavailable — it may just be waking up. Please try again in a few seconds.";
  }

  return error.response.data?.message ?? fallback;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(
  amount: number | string,
  currency = "NGN",
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-accent-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 75)
    return "bg-accent-500/10 text-accent-400 border-accent-500/20";
  if (score >= 50)
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}
