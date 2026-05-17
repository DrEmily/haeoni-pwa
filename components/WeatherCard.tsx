"use client";

import { MapPin, CloudRain, Wind } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { CountUp } from "./CountUp";
import type { Weather } from "@/lib/types";

interface Props {
  locationName: string;
  weather: Weather;
  delay?: number;
}

function pickSway(speed: number | null): string {
  if (speed === null) return "";
  if (speed >= 5) return "animate-sway-strong";
  if (speed >= 2.5) return "animate-sway-medium";
  return "animate-sway-light";
}

export function WeatherCard({ locationName, weather, delay = 0 }: Props) {
  const { tmn, tmx, pop_max, wind_speed_avg } = weather;
  const hasRange = tmn !== null || tmx !== null;
  const swayCls = pickSway(wind_speed_avg);

  return (
    <article
      className="
        group animate-slide-up relative overflow-hidden
        rounded-2xl bg-white border border-slate-200/80
        p-5 shadow-soft
        transition-all duration-200 ease-out
        hover:-translate-y-0.5 hover:shadow-card-hover hover:border-sky-200
        active:translate-y-0 active:scale-[0.985]
        cursor-default
      "
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin
            size={14}
            className="text-sky-500 group-hover:text-sky-600 transition-colors"
            aria-hidden
          />
          <span className="text-sm font-medium text-slate-700">
            {locationName}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        {hasRange ? (
          <span className="text-[28px] font-bold leading-tight text-slate-900">
            <CountUp value={tmn} />
            <span className="text-slate-400 mx-1">~</span>
            <CountUp value={tmx} />
            <span className="text-slate-700">℃</span>
          </span>
        ) : (
          <span className="text-base text-slate-400">데이터 없음</span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <CloudRain size={14} className="text-sky-500" aria-hidden />
          <span className="text-slate-500">강수</span>
          <span className="font-medium text-slate-700 tabular">
            {pop_max !== null ? (
              <>
                <CountUp value={pop_max} />%
              </>
            ) : (
              "—"
            )}
          </span>
        </span>
        <span className="text-slate-300" aria-hidden>·</span>
        <span className="flex items-center gap-1.5">
          <Wind
            size={14}
            className={`text-sky-500 origin-center ${swayCls}`}
            aria-hidden
          />
          <span className="text-slate-500">바람</span>
          <span className="font-medium text-slate-700 tabular">
            {wind_speed_avg !== null ? (
              <>
                <CountUp value={wind_speed_avg} decimals={1} /> m/s
              </>
            ) : (
              "—"
            )}
          </span>
        </span>
      </div>
    </article>
  );
}

export function WeatherCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-soft">
      <Skeleton className="h-4 w-12 mb-3" />
      <Skeleton className="h-8 w-36 mb-4" />
      <Skeleton className="h-4 w-44" />
    </article>
  );
}
