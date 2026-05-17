"use client";

import { Skeleton } from "./Skeleton";
import { CountUp } from "./CountUp";
import { WaveBg } from "./WaveBg";
import type { SeaTemp } from "@/lib/types";

export function SeaTempCard({ sea, delay = 0 }: { sea: SeaTemp; delay?: number }) {
  const { primary, observed_at } = sea;
  const sub = primary.depth
    ? `${primary.layer} · ${primary.depth}`
    : primary.layer;

  return (
    <article
      className="
        group animate-slide-up relative overflow-hidden
        rounded-2xl border border-sky-200/80
        p-5 shadow-soft
        transition-all duration-200 ease-out
        hover:-translate-y-0.5 hover:shadow-card-hover
        active:translate-y-0 active:scale-[0.985]
        cursor-default
      "
      style={{
        animationDelay: `${delay}ms`,
        background:
          "linear-gradient(180deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)",
      }}
    >
      <WaveBg />

      <div className="relative">
        <div className="flex items-center gap-1.5">
          <span className="text-base" aria-hidden>🌊</span>
          <h2 className="text-sm font-medium text-slate-700">
            동해 수온 · 양양 관측소
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">{sub}</p>

        <div className="mt-5 mb-2 flex items-end justify-center gap-0.5">
          {primary.temp_celsius !== null ? (
            <>
              <span className="text-[56px] leading-none font-bold text-sky-700 animate-pop-in">
                <CountUp
                  value={primary.temp_celsius}
                  decimals={1}
                  duration={800}
                />
              </span>
              <span className="text-2xl font-semibold text-sky-600 pb-1">℃</span>
            </>
          ) : (
            <span className="text-2xl text-slate-400">데이터 없음</span>
          )}
        </div>

        {observed_at ? (
          <p className="text-center text-xs text-slate-500 tabular pb-1">
            측정 {observed_at} KST
          </p>
        ) : (
          <div className="h-4" aria-hidden />
        )}
      </div>
    </article>
  );
}

export function SeaTempCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white border border-sky-200/80 p-5 shadow-soft">
      <Skeleton className="h-4 w-44 mb-2" />
      <Skeleton className="h-3 w-24 mb-5" />
      <div className="flex justify-center my-2">
        <Skeleton className="h-14 w-36" />
      </div>
      <Skeleton className="h-3 w-32 mx-auto mt-4" />
    </article>
  );
}
