# 해온이 PWA

서울·양양의 오늘 날씨와 양양 동해 수온을 한 화면에 보여주는 모바일 우선 PWA.
해온이 텔레그램 봇의 자매 웹앱입니다.

## 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 준비
cp .env.local.example .env.local
# .env.local 파일을 열어 KMA_API_KEY 값을 채워 넣으세요
# (해온이 텔레그램 봇의 .env 와 같은 키 사용 가능)

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속.

## 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Pretendard
- SWR (data fetching + revalidate)
- lucide-react (icons)

## 디자인 토큰

- Primary: `sky-400` (#38bdf8)
- 수온 강조: `sky-700` (#0369a1)
- 배경: `sky-50`
- 본문: `slate-900`
- 폰트: Pretendard Variable
- 그리드: 8pt

자세한 사양은 `SPEC.md` 참조.

## 디렉토리

```
app/
├── layout.tsx        # 루트 레이아웃 (메타 + 폰트)
├── page.tsx          # 메인 화면
├── globals.css       # Tailwind + 폰트 임포트
└── api/
    ├── weather/[city]/route.ts  # 기상청 프록시
    └── sea-temp/route.ts        # NIFS 프록시
components/           # WeatherCard, SeaTempCard, Header, Skeleton ...
lib/                  # kma.ts, nifs.ts (Python 모듈 포팅)
public/               # manifest.json, 아이콘
```

## 배포

GitHub 푸시 → Vercel 자동 연동. 환경변수 `KMA_API_KEY`를 Vercel 프로젝트 설정에 추가.
