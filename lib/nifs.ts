/**
 * NIFS 양양 동해 수온 추출 (Python nifs_client.py 포팅).
 *
 * 페이지가 부서진 HTML이라 BeautifulSoup 다단 fallback 대신,
 * JS에서는 처음부터 정규식 기반 추출이 가장 안정적임.
 * 어제 Python에서도 'html.parser' 외엔 다 실패했던 것을 고려.
 *
 * 헤더에 한글 포함 금지 (Python 쪽 동일 정책 — 일관성 유지).
 */

import type { SeaTemp, SeaLayer } from "./types";

const NIFS_URL = "https://www.nifs.go.kr/nts/tem_obs.do";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const ACCEPT_LANGUAGE = "ko,en;q=0.9";
const ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";

const LAYER_PRIORITY = ["저층", "중층", "표층"] as const;

// 블록 시작 위치
const BLOCK_RE = /<div\s+class="temperature-wrap"/g;
// 블록 내부 패턴들 (g 플래그 없음 — search용)
const TIT_RE = /<div\s+class="tit[^"]*">\s*(표층|중층|저층)수온\s*<\/div>/;
const NUM_RE =
  /<div\s+class="num[^"]*">\s*(-?\d+(?:\.\d+)?)\s*<span>\s*℃\s*<\/span>/;
const UNIT_RE = /<div\s+class="unit[^"]*">\s*(\d+m)\s*<\/div>/;
const TIME_RE =
  /<div\s+class="time[^"]*">\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?)/;
// "기준"이 같은 div 안에 같이 있는 경우도 포착
const TIME_FALLBACK_RE = /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?)\s*기준/;

function parseLayersFromRegex(html: string): SeaLayer[] {
  const positions: number[] = [];
  let m: RegExpExecArray | null;
  // exec 반복으로 모든 블록 시작 위치 수집
  while ((m = BLOCK_RE.exec(html)) !== null) {
    positions.push(m.index);
  }
  BLOCK_RE.lastIndex = 0;
  if (positions.length === 0) return [];

  positions.push(html.length); // sentinel
  const layers: SeaLayer[] = [];
  for (let i = 0; i < positions.length - 1; i++) {
    const block = html.slice(positions[i], positions[i + 1]);
    const titM = block.match(TIT_RE);
    const numM = block.match(NUM_RE);
    const unitM = block.match(UNIT_RE);

    const layer = titM?.[1] ?? null;
    const depth = unitM?.[1] ?? null;
    let tempC: number | null = null;
    let active = false;
    if (numM) {
      const v = parseFloat(numM[1]);
      if (!Number.isNaN(v)) {
        tempC = v;
        active = true;
      }
    }
    layers.push({ layer, depth, temp_celsius: tempC, active });
  }
  return layers;
}

function selectPrimary(layers: SeaLayer[]) {
  for (const pref of LAYER_PRIORITY) {
    for (const l of layers) {
      if (l.layer === pref && l.active) {
        return { ...l, layer: pref } as Required<SeaLayer>;
      }
    }
  }
  // 모두 비활성 → 저층 메타 유지 + temp=null
  const bottom = layers.find((l) => l.layer === "저층");
  if (bottom)
    return {
      ...bottom,
      layer: "저층",
      temp_celsius: null,
      active: false,
    } as Required<SeaLayer>;
  return {
    layer: "저층",
    depth: null,
    temp_celsius: null,
    active: false,
  } as Required<SeaLayer>;
}

function extractObservedAt(html: string): string | null {
  const m1 = html.match(TIME_RE);
  if (m1) return m1[1];
  const m2 = html.match(TIME_FALLBACK_RE);
  if (m2) return m2[1];
  return null;
}

export async function fetchSeaTemperature(
  locCode = "byy87"
): Promise<SeaTemp> {
  const url = new URL(NIFS_URL);
  url.searchParams.set("loc_code", locCode);

  let resp: Response;
  try {
    resp = await fetch(url.toString(), {
      next: { revalidate: 1800 }, // 30분 캐시
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": ACCEPT_LANGUAGE,
        Accept: ACCEPT,
      },
    });
  } catch (e: any) {
    throw new Error(`NIFS fetch failed: ${e?.message ?? e}`);
  }

  if (!resp.ok) throw new Error(`NIFS HTTP ${resp.status}`);

  const html = await resp.text();
  const layers = parseLayersFromRegex(html);
  const primary = selectPrimary(layers);
  const observed_at = extractObservedAt(html);

  return {
    station_name: "양양",
    observed_at,
    primary: {
      layer: primary.layer ?? "저층",
      depth: primary.depth,
      temp_celsius: primary.temp_celsius,
      active: primary.active,
    },
    all_layers: layers,
  };
}
