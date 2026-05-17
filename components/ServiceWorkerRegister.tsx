"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.hostname === "localhost") return; // 개발 시엔 skip
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("SW 등록 실패:", err));
  }, []);
  return null;
}
