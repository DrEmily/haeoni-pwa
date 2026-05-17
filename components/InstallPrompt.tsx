"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "haeoni-install-dismissed";
const DISMISS_HOURS = 24; // 닫으면 24시간 동안 다시 안 띄움

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState<"android" | "ios">("android");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 이미 PWA로 설치되어 standalone으로 열린 경우 표시 안 함
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (standalone) return;

    // 최근에 닫았으면 일정 시간 동안 표시 안 함
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (Date.now() - dismissedAt < DISMISS_HOURS * 60 * 60 * 1000) return;

    // iOS Safari 감지 (beforeinstallprompt 미지원)
    const ua = navigator.userAgent.toLowerCase();
    const isIos =
      /iphone|ipad|ipod/.test(ua) && !/crios|fxios|edgios/.test(ua);

    if (isIos) {
      setVariant("ios");
      setShow(true);
      return;
    }

    // Android Chrome/Edge: beforeinstallprompt 캡처
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVariant("android");
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferred(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="홈 화면에 추가"
      className="
        fixed left-0 right-0 mx-auto z-50
        bottom-[calc(env(safe-area-inset-bottom,0px)+12px)]
        w-[calc(100%-24px)] max-w-[440px]
        rounded-2xl border border-sky-200 bg-white shadow-card-hover
        p-3.5 pr-2 animate-slide-up
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
            bg-gradient-to-br from-sky-400 to-sky-600 text-xl
            shadow-soft
          "
          aria-hidden
        >
          🌊
        </div>

        <div className="flex-1 min-w-0">
          {variant === "android" ? (
            <>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                해온이 홈 화면에 추가
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                앱처럼 한 번 탭으로 열기
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                홈 화면에 추가하기
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Smartphone size={11} aria-hidden />
                공유 → "홈 화면에 추가" 선택
              </p>
            </>
          )}
        </div>

        {variant === "android" && (
          <button
            onClick={handleInstall}
            className="
              flex items-center gap-1.5 px-3.5 py-2 rounded-xl
              bg-sky-500 hover:bg-sky-600 active:bg-sky-700 active:scale-[0.97]
              text-white text-xs font-semibold
              transition-all duration-150 flex-shrink-0 shadow-soft
            "
          >
            <Download size={14} aria-hidden />
            설치
          </button>
        )}

        <button
          onClick={handleDismiss}
          className="
            p-2 -mr-1 text-slate-400 hover:text-slate-600
            active:bg-slate-100 rounded-lg transition-colors
            flex-shrink-0
          "
          aria-label="닫기"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
