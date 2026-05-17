"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number | null;
  decimals?: number;
  duration?: number;
  fallback?: string;
  className?: string;
}

export function CountUp({
  value,
  decimals = 0,
  duration = 700,
  fallback = "—",
  className = "",
}: Props) {
  const [display, setDisplay] = useState<number>(value ?? 0);
  const prevRef = useRef<number>(value ?? 0);

  useEffect(() => {
    if (value === null) return;
    const start = prevRef.current;
    const target = value;
    if (start === target) {
      setDisplay(target);
      return;
    }
    const startTime = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(start + (target - start) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  if (value === null) {
    return <span className={className}>{fallback}</span>;
  }
  return <span className={`tabular ${className}`}>{display.toFixed(decimals)}</span>;
}
