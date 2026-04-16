# CLAUDE.md — allcll-frontend

세종대학교 수강신청 도우미 **올클(ALLCLL)** 의 프론트엔드 모노레포입니다.

## 프로젝트 개요

- **서비스**: 실시간 여석 확인, 수강신청 연습, 시간표 커스텀, 관심 과목 경쟁률 확인
- **패키지 매니저**: pnpm 9.15.4 (반드시 pnpm 사용)
- **주요 기술**: React 18, TypeScript 5, TailwindCSS 4, Vite 7

## 패키지 구조 (Monorepo)

```
packages/
├── client/       @allcll/client      — 학생용 메인 웹 앱
├── admin/        @allcll/admin       — 관리자 대시보드
├── allcll-ui/    @allcll/allcll-ui   — 올클 전용 디자인 시스템
├── sejong-ui/    @allcll/sejong-ui   — 세종대 스타일 UI 라이브러리
├── common/       @allcll/common      — 패키지 간 공유 컴포넌트·유틸
├── e2e/          @allcll/e2e         — Playwright E2E 테스트
├── mock-server/  @allcll/mock-server — MSW 기반 Mock API 서버
└── nginx/                            — 배포용 Nginx 설정
```

## 자주 쓰는 명령어

```bash
pnpm run client      # 메인 서비스 개발 서버
pnpm run admin       # 관리자 페이지 개발 서버
pnpm run allcllui    # allcll-ui Storybook
pnpm run sejongui    # sejong-ui Storybook
pnpm run test        # Playwright E2E 테스트
pnpm run prettier    # 전체 패키지 포맷팅
```

## 아키텍처 — Feature-Sliced Design (FSD)

`packages/client/src/` 는 FSD 레이어 구조를 따릅니다. import 방향은 위 → 아래만 허용됩니다.

```
app       — 전역 설정, Provider, 라우팅, 에러 핸들링
pages     — 라우트 단위 페이지 컴포넌트
widgets   — 여러 기능을 조합한 독립적 UI 블록
features  — 사용자 행동/기능 단위 비즈니스 로직
entities  — 핵심 비즈니스 데이터 모델 (subject, timetable, user 등)
shared    — 도메인 없는 공용 코드 (api 클라이언트, lib, config, ui)
```

각 슬라이스 내부 구조: `ui/` · `model/` · `api/` · `lib/`

**import 규칙**
- `shared`는 어떤 레이어도 import 하면 안 됨
- `entities`는 `shared`만 import 가능
- `features`는 `entities`, `shared` import 가능, 상위 레이어 불가
- `app`은 모든 레이어를 import 가능하지만 다른 레이어에서 import 하면 안 됨

## 브랜치 전략

| 유형 | 브랜치 형식 | PR 대상 |
|------|------------|---------|
| 기능 개발 | `feature/브랜치명` | `develop` |
| 버그 수정 | `fix/브랜치명` | `develop` |
| 리팩터링 | `refactor/브랜치명` | `develop` |
| 긴급 수정 | hotfix | `main` |

- `main`, `develop`에 직접 커밋 금지
- PR 머지: 일반 PR → **Squash and merge** / `main ← develop` → **Create a merge commit**

## 커밋 컨벤션

```
<type>: <description>
```

| type | 용도 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 포맷팅, 세미콜론 등 코드 변경 없음 |
| `refactor` | 코드 리팩터링 |
| `test` | 테스트 코드 |
| `chore` | 빌드, 패키지 매니저 설정 |

## 코드 컨벤션

- **Airbnb JavaScript 컨벤션** 준수
- ESLint + Prettier 자동 적용 (husky + lint-staged로 커밋 시 실행)
- 포맷팅: `pnpm run prettier`

## 주요 라이브러리

| 역할 | 라이브러리 |
|------|-----------|
| 서버 상태 관리 | TanStack Query v5 |
| 클라이언트 상태 관리 | Zustand v5 |
| 라우팅 | React Router v7 |
| 스타일링 | TailwindCSS v4 |
| 로컬 DB | Dexie (IndexedDB) |
| BaaS | Supabase |
| 에러 추적 | Sentry |
| 분석 | Amplitude, Microsoft Clarity, Google Analytics 4 |
| E2E 테스트 | Playwright |
| Mock API | MSW |
