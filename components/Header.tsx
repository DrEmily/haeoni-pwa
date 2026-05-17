"use client";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function todayKST(): { date: string; weekday: string } {
  // 브라우저 로케일 시간이 KST가 아니어도 사용자가 보기엔 그곳 시각이 자연스러우므로
  // 클라이언트 로컬 시간을 사용. (정확한 KST 강제 표기는 데이터의 측정 시각에서 처리)
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return { date: `${yyyy}-${mm}-${dd}`, weekday: WEEKDAYS[d.getDay()] };
}

export function Header() {
  const { date, weekday } = todayKST();
  return (
    <header className="animate-slide-up pb-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl drop-shadow-sm" aria-hidden>
          🌊
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          해온이
        </h1>
      </div>
      <p className="mt-1 text-sm text-slate-500 tabular">
        {date} ({weekday})
      </p>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-sky-400/70 via-sky-300/40 to-transparent" />
    </header>
  );
}
