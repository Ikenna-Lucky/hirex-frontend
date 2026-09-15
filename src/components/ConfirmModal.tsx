"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onCancel}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="relative w-full max-w-[420px] rounded-lg border border-white/[0.08] bg-[#0d0f16] p-5 shadow-2xl shadow-black/70"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.06] hover:text-white"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg border ${
            danger
              ? "border-red-400/20 bg-red-400/10 text-red-300"
              : "border-violet-400/20 bg-violet-400/10 text-violet-300"
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h2
          id="confirm-modal-title"
          className="pr-8 text-[17px] font-bold leading-tight text-white"
        >
          {title}
        </h2>
        <p
          id="confirm-modal-message"
          className="mt-2 text-[13px] leading-6 text-slate-500"
        >
          {message}
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] px-4 text-[13px] font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-[13px] font-bold text-white shadow-lg transition ${
              danger
                ? "bg-red-600 shadow-red-950/25 hover:bg-red-500"
                : "bg-violet-600 shadow-violet-950/30 hover:bg-violet-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
