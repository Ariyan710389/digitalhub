"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let listeners: ToastListener[] = [];
let toastsState: ToastItem[] = [];

function notify() {
  listeners.forEach((listener) => listener([...toastsState]));
}

export const toast = {
  show: (message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { id, message, type, duration };
    toastsState = [...toastsState, newToast];
    notify();

    if (duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, duration);
    }
  },
  success: (message: string, duration?: number) => toast.show(message, "success", duration),
  error: (message: string, duration?: number) => toast.show(message, "error", duration),
  warning: (message: string, duration?: number) => toast.show(message, "warning", duration),
  info: (message: string, duration?: number) => toast.show(message, "info", duration),
  dismiss: (id: string) => {
    toastsState = toastsState.filter((t) => t.id !== id);
    notify();
  },
};

const toastIcons = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-rose-400 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
  info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
};

const toastBorders = {
  success: "border-emerald-500/30",
  error: "border-rose-500/30",
  warning: "border-amber-500/30",
  info: "border-cyan-500/30",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: ToastListener = (updated) => setToasts(updated);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-xl bg-[#101A30]/95 backdrop-blur-md p-4 text-sm text-[#F8FAFC] shadow-2xl border transition-all animate-fade-in",
            toastBorders[t.type]
          )}
        >
          {toastIcons[t.type]}
          <div className="flex-1 font-medium leading-relaxed">{t.message}</div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-[#94A3B8] hover:text-[#F8FAFC] p-0.5 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
