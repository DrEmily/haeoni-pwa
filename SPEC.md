# SPEC — 해온이 PWA (Phase 1)

_Phase 1 요구사항 정리. 1쪽 분량. 이 문서 OK 받은 뒤 디자인·코드로 진행._

---

## 한 줄 정체성

**텔레그램이 매일 아침 깨워주고, 낮에 다시 확인하고 싶을 땐 홈 화면 아이콘 한 번.**

해온이 봇의 자매 웹앱. 차분한 한국 하늘색을 모티프로, **1초 이내 정보 도달**과 **모바일 첫 화면 1장에 모든 것**을 목표로 합니다.

---

## 사용자 시나리오 (Phase 1)

1. **아침 산책 전** — 홈 화면 PWA 아이콘 탭 → 1초 안에 오늘 기온·강수·바람 확인
2. **양양 출발 전** — 양양 카드 보고 수온까지 확인 (서핑/바다 가능 여부 가늠)
3. **오프라인** — 마지막 캐시 데이터를 그대로 표시 (PWA 강점)

**비-목표 (Phase 1에서 안 함):** 로그인 / 푸시 알림 / 히스토리 그래프 / 임의 지역 추가 / 다국어

---

## 화면 구성

화면은 **메인 1개**로 시작. 정보가 한 화면에 다 들어와야 합니다.

```
┌─────────────────────────────┐
│ 🌊 해온이                   │   ← 헤더 (시그니처 + 날짜)
│  2026-05-17 (월)            │
├─────────────────────────────┤
│ 📍 서울                     │
│  7 ~ 14℃                    │   ← 기온 (큰 숫자)
│  강수 30% · 바람 2.6 m/s    │
├─────────────────────────────┤
│ 📍 양양                     │
│  5 ~ 12℃                    │
│  강수 60% · 바람 4.1 m/s    │
├─────────────────────────────┤
│ 🌊 양양 동해 수온           │
│  저층 25m                   │
│   ╭───────╮                 │
│   │ 6.5°  │                 │   ← 가장 큰 숫자, sea-deep blue
│   ╰───────╯                 │
│  측정 05-17 06:30 KST       │
├─────────────────────────────┤
│        ⟲ 새로고침           │
└─────────────────────────────┘
   출처: 기상청 / NIFS
```

3개 카드(서울 / 양양 / 양양 수온) + 헤더 + 새로고침. 그게 전부입니다.

---

## 데이터 흐름

```
브라우저(PWA)
    │ fetch (SWR)
    ▼
Next.js Route Handler
    /api/weather/[city]     ← 5분 캐시 (revalidate=300)
    /api/sea-temp           ← 30분 캐시 (revalidate=1800)
    │
    ├─► 기상청 단기예보 API   (KMA_API_KEY, server-side만)
    └─► NIFS 양양 페이지      (인증키 없음, HTML 파싱)
```

- API 키는 **서버 사이드에만** 보관 (`.env.local`, Vercel 환경변수)
- 브라우저에서 외부 API 직접 호출 안 함 → CORS 회피 + 키 보안
- Python의 `kma_client.py`, `nifs_client.py` 로직을 TypeScript로 포팅

---

## 디자인 방향 — "차분한 한국 하늘"

### 색 (메인 = 밝은 하늘색)

| 역할 | 토큰 | 값 |
|---|---|---|
| Primary (메인 하늘색) | `sky-400` | `#38bdf8` |
| Surface (카드) | `white` | `#ffffff` |
| Background | `sky-50` | `#f0f9ff` |
| 본문 텍스트 | `slate-900` | `#0f172a` |
| 보조 텍스트 | `slate-500` | `#64748b` |
| 수온 강조 (바다 깊이) | `sky-700` | `#0369a1` |
| 구분선 | `slate-200` | `#e2e8f0` |
| 경고 (수온 급변 등, Phase 2) | `amber-500` | `#f59e0b` |

대비비 검증: `slate-900` on `white` = 19:1 (WCAG AAA), `sky-700` on `white` = 8.5:1 (AA 통과).
밝은 하늘색은 본문에 쓰지 않고 **강조선·아이콘·로딩 표시** 등 UI 요소에만 사용.

### 타이포

- **본문 폰트**: **Pretendard** (한글 가독성 최고, 무료, CDN)
- **숫자 강조** (기온·수온): `tabular-nums` + `font-weight 700`
- **크기 단계** (4단계만): `32 / 24 / 16 / 14 / 12` (수온 / 기온 / 본문 / 보조 / 캡션)
- **줄 간격**: 본문 1.6, 헤딩 1.2

### 레이아웃 (모바일 우선)

- 기준 너비: **360–414px** (iPhone SE ~ Pro Max)
- 데스크톱: `max-width: 480px` 중앙 정렬 (가족·동료 채널 → 대화면 최적화 비-목표)
- **8pt 그리드**: 4 · 8 · 12 · 16 · 24 · 32px만 사용
- 카드 내부 패딩 16px, 카드 사이 간격 12px
- 터치 타깃 ≥ 44px (iOS HIG)

### 모션

- **페이지 진입**: 카드가 8px 아래에서 위로 슬라이드 + opacity 0→1, 250ms `ease-out`, 카드별 50ms stagger
- **새로고침**: 회전 360° 1회 (loading 중에만)
- **데이터 갱신**: 숫자에 살짝 깜빡임 (200ms)
- **과한 애니메이션 금지** — "차분함"이 정체성

### 아이콘·이모지

- 라이브러리: **lucide-react** (단순 라인 아이콘)
- 이모지는 **헤더 시그니처 🌊**, **섹션 마커 📍** 에만 절제 사용
- 라인 아이콘과 이모지를 같은 화면에서 혼용하지 않음 (시각적 통일감)

### 상태 화면

- **로딩**: 카드 형태 스켈레톤 (`sky-100` 박스 + shimmer 200ms)
- **데이터 없음**: 회색 `"데이터 없음"` 텍스트 + 작은 새로고침 아이콘
- **네트워크 오류**: 화면 상단 토스트 1줄 — `"연결을 확인해주세요"`
- **단정 표현 금지**: "외출 자제하세요", "마스크 쓰세요" 같은 행동 추천 안 함 (해온이 봇의 PROMPT.md 정책을 PWA도 그대로 계승)

### 접근성 체크리스트

- 모든 텍스트 대비비 WCAG AA 이상
- 터치 타깃 44×44px 이상
- `prefers-reduced-motion` 존중 (애니메이션 자동 비활성)
- `aria-label`로 아이콘에 의미 부여
- 모바일 키보드 사용 안 함 (입력 없음)

---

## 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js 14** (App Router) | Vercel 최적화, 서버사이드 fetch 자연스러움 |
| 언어 | **TypeScript** | 타입 안전 |
| 스타일 | **Tailwind CSS** | 디자인 토큰화 빠름 |
| 컴포넌트 | **shadcn/ui** (Card, Skeleton만) | 무료, 코드 직접 보유 |
| 폰트 | **Pretendard** | 한글 최적, 무료 |
| 아이콘 | **lucide-react** | 일관된 라인 스타일 |
| 데이터 | **SWR** | revalidate·offline 캐시 자동 |
| PWA | **serwist** (next-pwa 후속) | manifest + service worker |
| 호스팅 | **Vercel** | git push 자동 배포 + edge cache |
| DB | **없음 (Phase 1)** | localStorage로 즐겨찾기 충분 |

---

## 디렉토리 (예정)

```
haeoni-pwa/
├── SPEC.md                       ← 이 문서
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # 메인 화면
│   ├── api/
│   │   ├── weather/[city]/route.ts
│   │   └── sea-temp/route.ts
│   └── globals.css               # Tailwind + 디자인 토큰
├── components/
│   ├── Header.tsx
│   ├── WeatherCard.tsx
│   ├── SeaTempCard.tsx
│   ├── RefreshButton.tsx
│   └── ui/                       # shadcn 컴포넌트
├── lib/
│   ├── kma.ts                    # Python kma_client.py 포팅
│   └── nifs.ts                   # Python nifs_client.py 포팅
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── service-worker.ts (serwist)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Phase 1 완료 정의 (Definition of Done)

- [ ] 메인 화면 1개에 서울·양양 날씨 + 양양 수온이 정상 표시
- [ ] PWA로 홈 화면 추가 가능 (manifest + service worker)
- [ ] Lighthouse PWA 점수 ≥ 90, 접근성 ≥ 95, 성능 ≥ 90
- [ ] 모바일(iPhone 13, Galaxy S 기준)·태블릿·데스크톱 모두 깨짐 없음
- [ ] 오프라인 시 마지막 캐시 데이터 표시
- [ ] Vercel preview URL 생성 + 김박사님 텔레그램으로 공유

---

## 진행 단계 (이 SPEC 다음)

1. **본 SPEC 검토 + 승인** ← 지금
2. **디자인 wireframe** (Figma 또는 추가 마크다운, 김박사님 선택)
3. **로컬 보일러플레이트** — `npx create-next-app@latest`
4. **lib/kma.ts·nifs.ts 포팅** — Python 로직 그대로 TypeScript로
5. **컴포넌트 + 메인 화면** — Pretendard 폰트, sky 팔레트 적용
6. **PWA 변환** — manifest + service worker
7. **로컬 검증** — Lighthouse, 오프라인 테스트
8. **GitHub push → Vercel 자동 배포**

각 단계는 최소 단위로 분할해 진행하며, 매 단계 끝에 김박사님 확인을 받습니다.
