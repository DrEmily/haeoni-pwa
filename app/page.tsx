"use client";

import useSWR from "swr";
import { Header } from "@/components/Header";
import { WeatherCard, WeatherCardSkeleton } from "@/components/WeatherCard";
import { SeaTempCard, SeaTempCardSkeleton } from "@/components/SeaTempCard";
import { RefreshButton } from "@/components/RefreshButton";
import { ErrorToast } from "@/components/ErrorToast";
import type { Weather, SeaTemp } from "@/lib/types";

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error("fetch failed");
  return r.json();
};

const SWR_OPTS = { refreshInterval: 0, revalidateOnFocus: false };

export default function HomePage() {
  const seoul = useSWR<Weather>("/api/weather/seoul", fetcher, SWR_OPTS);
  const yangyang = useSWR<Weather>("/api/weather/yangyang", fetcher, SWR_OPTS);
  const sea = useSWR<SeaTemp>("/api/sea-temp", fetcher, SWR_OPTS);

  const loading = seoul.isLoading || yangyang.isLoading || sea.isLoading;
  const error = seoul.error || yangyang.error || sea.error;

  const handleRefresh = () => {
    seoul.mutate();
    yangyang.mutate();
    sea.mutate();
  };

  return (
    <div className="space-y-3">
      <Header />

      {/* 모바일: 1열 / 480px+ : 서울·양양 2열 / 수온은 항상 한 줄 가득 */}
      <section
        className="grid gap-3 xs:grid-cols-2 sm:grid-cols-2"
        aria-label="날씨"
      >
        {seoul.data ? (
          <WeatherCard locationName="서울" weather={seoul.data} delay={50} />
        ) : (
          <WeatherCardSkeleton />
        )}
        {yangyang.data ? (
          <WeatherCard locationName="양양" weather={yangyang.data} delay={100} />
        ) : (
          <WeatherCardSkeleton />
        )}
      </section>

      <section aria-label="수온">
        {sea.data ? (
          <SeaTempCard sea={sea.data} delay={180} />
        ) : (
          <SeaTempCardSkeleton />
        )}
      </section>

      <RefreshButton onClick={handleRefresh} loading={loading} />

      <footer className="pt-2 text-center">
        <p className="text-xs text-slate-400 tabular">출처 · 기상청 / NIFS</p>
      </footer>

      {error && <ErrorToast message="연결을 확인해주세요" />}
    </div>
  );
}
