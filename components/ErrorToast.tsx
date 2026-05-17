"use client";

import { AlertCircle } from "lucide-react";

export function ErrorToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2
        rounded-full bg-slate-900/90 backdrop-blur-sm
        px-4 py-2 text-xs text-white shadow-lg
        animate-pop-in
      "
    >
      <AlertCircle size={14} className="text-amber-400" aria-hidden />
      {message}
    </div>
  );
}
