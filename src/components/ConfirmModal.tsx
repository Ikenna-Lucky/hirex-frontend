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
  // lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl p-6 relative"
        style={{
          backgroundColor: "#0e0e24",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03) inset",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{
            backgroundColor: danger
              ? "rgba(239,68,68,0.1)"
              : "rgba(124,58,237,0.1)",
            border: danger
              ? "1px solid rgba(239,68,68,0.2)"
              : "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <AlertTriangle
            className="w-5 h-5"
            style={{ color: danger ? "#f87171" : "#a78bfa" }}
          />
        </div>

        {/* Text */}
        <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
        <p
          className="text-[13px] leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
            style={
              danger
                ? {
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow: "0 4px 16px rgba(220,38,38,0.3)",
                  }
                : {
                    background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  }
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
