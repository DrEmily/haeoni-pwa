/**
 * 기상청 단기예보 API 클라이언트 (Python kma_client.py 포팅).
 *
 * KMA 발표 시각(KST): 02, 05, 08, 11, 14, 17, 20, 23.
 * 발표 후 10분 안전마진을 두고 base_time 결정.
 *
 * TMN/TMX 누락 시 TMP 시계열의 min/max로 fallback.
 */

import type { Weather } from "./types";

const KMA_BASE_URL =
  "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

const BASE_TIMES = [2, 5, 8, 11, 14, 17, 20, 23] as const;
const SAFETY_MARGIN_MIN = 10;

function nowKST(): Date {
  // 서버 타임존에 무관하게 KST 시점 계산
  const utcMs = Date.now();
  return new Date(utcMs + 9 * 60 * 60 * 1000);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function ymd(d: Date): string {
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`;
}

export function resolveBaseDatetime(): { baseDate: string; baseTime: string } {
  const now = nowKST();
  const cutoff = new Date(now.getTime() - SAFETY_MARGIN_MIN * 60 * 1000);

  const eligible = BASE_TIMES.filter((h) => h <= cutoff.getUTCHours());
  let baseHour: number;
  let baseDateD: Date;
  if (eligible.length > 0) {
    baseHour = Math.max(...eligible);
    baseDateD = cutoff;
  } else {
    baseHour = 23;
    baseDateD = new Date(cutoff.getTime() - 24 * 60 * 60 * 1000);
  }
  return { baseDate: ymd(baseDateD), baseTime: `${pad2(baseHour)}00` };
}

interface RawItem {
  fcstDate?: string;
  fcstTime?: string;
  category?: string;
  fcstValue?: string;
}

export function parseItems(items: RawItem[], targetDate: string): Weather {
  let tmn: number | null = null;
  let tmx: number | null = null;
  const pop: number[] = [];
  const wsd: number[] = [];
  const tmp: number[] = [];

  for (const it of items) {
    if (!it.fcstDate || !it.category || it.fcstValue == null) continue;
    if (it.fcstDate !== targetDate) continue;
    const v = Number(it.fcstValue);
    if (Number.isNaN(v)) continue;
    switch (it.category) {
      case "TMN":
        tmn = v;
        break;
      case "TMX":
        tmx = v;
        break;
      case "POP":
        pop.push(Math.round(v));
        break;
      case "WSD":
        wsd.push(v);
        break;
      case "TMP":
        tmp.push(v);
        break;
    }
  }

  if (tmn === null && tmp.length > 0) tmn = Math.min(...tmp);
  if (tmx === null && tmp.length > 0) tmx = Math.max(...tmp);

  return {
    tmn,
    tmx,
    pop_max: pop.length > 0 ? Math.max(...pop) : null,
    wind_speed_avg:
      wsd.length > 0
        ? Math.round((wsd.reduce((a, b) => a + b, 0) / wsd.length) * 10) / 10
        : null,
  };
}

export async function fetchShortTermForecast(
  nx: number,
  ny: number
): Promise<Weather> {
  const apiKey = process.env.KMA_API_KEY;
  if (!apiKey) throw new Error(".env.local 에 KMA_API_KEY가 없습니다");

  const { baseDate, baseTime } = resolveBaseDatetime();
  const today = ymd(nowKST());

  const url = new URL(KMA_BASE_URL);
  url.searchParams.set("serviceKey", apiKey);
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("dataType", "JSON");
  url.searchParams.set("base_date", baseDate);
  url.searchParams.set("base_time", baseTime);
  url.searchParams.set("nx", String(nx));
  url.searchParams.set("ny", String(ny));

  const resp = await fetch(url.toString(), {
    next: { revalidate: 300 }, // 5분 캐시
    headers: { Accept: "application/json" },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`KMA HTTP ${resp.status}: ${text.slice(0, 200)}`);
  }

  const ct = resp.headers.get("content-type") ?? "";
  if (ct.toLowerCase().includes("xml")) {
    const text = await resp.text();
    throw new Error(`KMA returned XML (auth/traffic issue): ${text.slice(0, 200)}`);
  }

  const payload = await resp.json();
  const code = payload?.response?.header?.resultCode;
  if (code !== "00") {
    const msg = payload?.response?.header?.resultMsg ?? "(no msg)";
    throw new Error(`KMA resultCode=${code} msg=${msg}`);
  }
  const items: RawItem[] = payload?.response?.body?.items?.item ?? [];
  return parseItems(items, today);
}
