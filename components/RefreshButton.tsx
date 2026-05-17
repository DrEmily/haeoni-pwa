"use client";

import { RefreshCw } from "lucide-react";

export function RefreshButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label="새로고침"
      className="
        mt-2 w-full rounded-2xl border border-sky-200 bg-white py-3
        text-sm font-medium text-slate-700
        flex items-center justify-center gap-2
        hover:bg-sky-50 hover:border-sky-300
        active:bg-sky-100 active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-150 ease-out shadow-soft
      "
    >
      <RefreshCw
        size={16}
        className={
          loading
            ? "animate-spin-slow text-sky-500"
            : "text-sky-500 transition-transform group-active:rotate-180"
        }
        aria-hidden
      />
      {loading ? "새로고침 중" : "새로고침"}
    </button>
  );
}
