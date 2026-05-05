# CLAUDE.md

세종대학교 수강신청 도우미 **올클(ALLCLL)** 프론트엔드. Vite + React 18 + FSD 모노레포.

이 파일은 매 세션 시작 시 자동 로드된다 (Anthropic Claude Code 공식 동작).
세부 규약은 `.claude/rules/*.md`로 분리되어 있고, 일부는 path-scoped로 해당 파일을 만질 때만 로드된다.

@README.md
@CONTRIBUTING.md

---

## 기술 스택

- 모노레포: pnpm workspace (Node 24, pnpm 9.15.4)
- 프론트엔드: **React 18.3.1** + TypeScript 5.9 (strict) + Vite 7
- 상태/데이터: TanStack Query v5, Zustand 5 (+ persist), Dexie 4 (IndexedDB)
- 스타일: Tailwind 4
- 백엔드 통신: REST + SSE (`shared/api/api.ts`의 6개 함수만 사용)
- 디자인 시스템: 자체 패키지 `@allcll/allcll-ui`(일반), `@allcll/sejong-ui`(시뮬레이션 전용)
- 모니터링: Sentry, GA4, Microsoft Clarity, Amplitude

근거: 루트 `package.json`, `packages/client/package.json`, `vite.config.ts`.

## 모노레포 지도

```
packages/
├── client/        # 학생용 메인 웹앱 (@allcll/client) — 주 작업 영역, FSD 구조
├── admin/         # 어드민 대시보드 (@allcll/admin) — 일반 React 구조 (components/hooks/layouts/pages/utils)
├── allcll-ui/     # 일반 디자인 시스템 ⛔ 직접 수정 금지
├── sejong-ui/     # 세종대 수강신청 화면 흉내용 UI ⛔ 직접 수정 금지
├── common/        # 패키지 간 공유 (@allcll/common)
├── mock-server/   # MSW 기반 mock 서버
├── e2e/           # Playwright e2e
└── nginx/         # 배포 설정
```

`packages/client/src/`는 **FSD(Feature-Sliced Design) 6 레이어**: `app → pages → widgets → features → entities → shared`. 자세한 import 방향은 `.claude/rules/fsd-architecture.md`.

`packages/admin/src/`는 FSD가 아닌 일반 React 구조. 슬라이스 단위 규약은 적용되지 않지만 *"src 안에 barrel `index.ts` 만들지 않기"* 규칙은 동일하게 유지 (현재 admin/src 안 barrel 0개).

## 명령어

근거: 루트 `package.json` scripts.

```bash
pnpm install                  # 의존성 (루트에서 1회)
pnpm run client               # client dev (https://localhost)
pnpm run admin                # admin dev
pnpm run build-client         # client 프로덕션 빌드 — 커밋 전 필수
pnpm run build-admin          # admin 프로덕션 빌드
pnpm run test                 # e2e (Playwright)
pnpm run allcllui             # allcll-ui Storybook
pnpm run sejongui             # sejong-ui Storybook
pnpm run prettier             # 포매팅
```

## 절대 규칙 (NEVER)

이 규칙들을 위반하는 PR은 머지하지 않는다. 모두 검증 가능하다.

1. **`fetch()` 직접 호출 금지** — `shared/api/api.ts`의 6개 함수(`fetchOnAPI` / `fetchJsonOnAPI` / `fetchDeleteJsonOnAPI` / `fetchEventSource` / `fetchJsonOnPublic` / `fetchTextOnPublic`)만 사용. base URL과 credentials가 통일됨.
2. **`packages/client/src/` 와 `packages/admin/src/` 안에 barrel `index.ts` 생성 금지** — 어떤 폴더에도 `index.ts` 를 만들지 않음. 외부 노출은 항상 직접 모듈 경로 import (`@/entities/user/model/useAuth`). 현재 두 src 안에 barrel은 0개. (예외: 디자인 시스템 패키지 진입점인 `packages/{allcll-ui,sejong-ui,common}/index.ts` 는 정당한 사용 — 외부 패키지가 import 하는 진입점이라 필요)
3. **`packages/allcll-ui/`, `packages/sejong-ui/` 소스 수정 금지** — 디자인 시스템 변경은 별도 PR/리뷰 필요. client 작업 중 절대 변경하지 말 것.
4. **레이어 역방향 import 금지** (client/FSD 한정) — `entities → features/widgets/pages` 금지, `shared → 모든 상위` 금지. 자세한 표는 `.claude/rules/fsd-architecture.md`. (기존 위반 사례 **10건** — entities 4 + features 2 + shared 4 — 은 점진 개선 대상이지 따라할 패턴이 아님)
5. **빌드 실패 상태 커밋 금지** — `pnpm run build-client` (또는 admin 변경 시 `build-admin`) 통과 후에만 푸시. husky pre-push 가 자동 검증함. CI(`pr-ci.yml`)도 검증하지만 로컬에서 먼저 통과시킬 것.
6. **simulation UI 격리 위반 금지** — 세종대 수강신청 화면 흉내(`widgets/simulation/{modal/SimulationModal,Processing,WaitingModal,CaptchaInput}`, `widgets/simulation/table/{Registered,NoneRegistered}Table`, `SimulationSearchForm`, `pages/simulation/*`)는 `@allcll/sejong-ui`만, 외곽 UI(튜토리얼/결과/세팅)는 `@allcll/allcll-ui`만. 자세한 위젯 분류는 `.claude/rules/allcll-ui.md`.

## 환경변수

`packages/client/vite.config.ts`, `import.meta.env` grep, `.github/workflows/build-deploy.yml` 기반.

| 변수 | 용도 |
|---|---|
| `VITE_API_BASE_URL` | API base URL (`shared/api/api.ts`) |
| `VITE_BASE` | 라우팅 base path |
| `VITE_TARGET_HOST` | dev 프록시 대상 (기본 `localhost:8080`) |
| `VITE_USE_MOCK` | `'true'`면 MSW 활성화 |
| `VITE_DEV_SERVER` | dev 서버 플래그 (Sentry/Clarity 분기) |
| `VITE_SENTRY_DSN`, `VITE_GOOGLE_ANALYTICS_ID`, `VITE_CLARITY_PROJECT_ID` | 운영 트래킹 |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_TABLE_NAME` | Supabase |

## Path alias

근거: `packages/client/tsconfig.json`.

- `@/*` → `src/*`
- `@public/*` → `public/*`
- `@allcll/common` (워크스페이스 직접 import)

## 커밋 메시지

근거: `CONTRIBUTING.md` + `git log` 실측.

`<type>: <한국어 설명>` 형식. type 종류:

- `feat` — 새 기능
- `fix` — 버그 수정 (QA 연동은 `fix:[QA-XXX] ...`)
- `hotfix` — 긴급 수정 (`main` 직접 PR)
- `refactor` — 리팩터링
- `chore` — 빌드/패키지/설정 등 잡무
- `docs` — 문서
- `style` — 포맷팅 (코드 변경 없음)
- `test` — 테스트 코드

## 새 기능 작업 흐름

1. **레이어 결정** (client만 해당) — `.claude/rules/fsd-architecture.md` 판단표 참조.
2. **유사 슬라이스 읽기** — 쿼리/뮤테이션은 `entities/user/model/useAuth.ts`, API 함수는 `entities/user/api/user.ts`, features 조합은 `features/graduation/model/useGraduationDashboard.ts`, 테이블 컬럼 store는 `features/wish/model/useWishTableColumnStore.ts` 참고.
3. **UI — 디자인 시스템 우선 사용** — 새 UI 만들기 전에 **반드시** `@allcll/allcll-ui` (시뮬레이션 본 화면이면 `@allcll/sejong-ui`) 카탈로그를 먼저 검토. raw `<button>`/`<input>`/`<select>` + Tailwind 직접 만들기 전에 `Button`/`Input`/`TextField`/`Dialog` 등이 적합한지 확인. Use case 매핑 표는 `.claude/rules/allcll-ui.md` 참조.
4. **코드 작성** — `.claude/rules/coding-patterns.md` 따르기 (API/RQ/Zustand/타입).
5. **빌드 검증** — `pnpm run build-client` 통과. (`pre-push` 가 자동 검증)
6. **커밋** — 위 prefix + 한국어.
7. **PR** — feature/fix → `develop`, hotfix → `main`. 본문은 `## 작업 내용` / `## 변경 사항 및 리뷰 포인트` (`.github/PULL_REQUEST_TEMPLATE.md`).

## 모르는 게 있을 때

- 코드를 추측하지 말고 먼저 읽는다.
- 비슷한 기존 코드가 있는지 grep으로 확인 (예: 새 mutation을 만들 때 `grep -r "useMutation" src/`).
- 그래도 애매하면 사용자에게 묻기.

## Claude Code 운영 팁

- `/init` — 처음 클론하면 한 번 실행해서 초안 받고 다듬기 (Anthropic 공식 권장).
- `/memory` — 현재 세션이 어떤 CLAUDE.md/rules 파일을 로드했는지 확인.
- `CLAUDE.local.md` — 개인 sandbox URL이나 테스트 데이터는 여기에. `.gitignore` 처리됨.
- `~/.claude/CLAUDE.md` — 본인 머신 전체 공통 선호 (선택).

## 사용 가능한 명령어 (Skills)

이 프로젝트에 등록된 슬래시 커맨드 3개:

- **`/pr-ready`** — PR 올리기 직전 종합 검증. 빌드 + 린트 + 절대 규칙 6가지 + 커밋 형식 + PR 본문 *초안* 생성. **PR 자동 생성은 안 함** — 본문은 사람이 *왜*를 채워야 함. 모든 PR에 공통적인 검증이라 피처 사이클과 무관하게 사용됨.
- **`/review`** — 절대 규칙 6가지로 현재 변경사항 셀프 리뷰. `/pr-ready` 의 부분 집합 — 작업 중간에 가볍게 점검할 때.
- **`/new-api <entities-slice> <verb-noun>`** — entities 슬라이스에 새 API 함수 + react-query 훅 보일러플레이트 추가. 예: `/new-api wishes getDetail`. `shared/api/api.ts` 의 6개 함수 중 적합한 것 자동 선택, 같은 도메인 기존 API 개수에 따라 queryKey 패턴(단일 상수 vs graduation factory) 자동 권장. 빈도 월 1.5건 (6개월 9개 새 API 파일).

모두 `disable-model-invocation: true` — 사용자가 명시적으로 입력해야 실행됨. `.claude/skills/<name>/SKILL.md` 로 정의.

## Claude 사용 시 주의사항

git log에 한 가지 명백한 패턴이 있어서 짚어둡니다:

- `f14c0a8a feat: 에러 핸들링 아키텍처 Layer 1~4 구현 및 테스트 페이지 추가` (Claude로 큰 변경)
- `21123874 Revert "feat: 에러 핸들링 아키텍처 Layer 1~4..."` (다음 커밋에서 통째로 revert)

**Claude는 작은 변경의 자동화에는 강하고, 큰 아키텍처 변경에는 약합니다.** Claude로 작업할 때:

1. **한 번에 여러 레이어를 동시에 바꾸는 큰 변경은 피하세요.** *"에러 핸들링을 4단계로 다 바꿔줘"* 같은 요청은 검토가 어려워 통째로 되돌리게 됩니다.
2. **변경을 작은 단위로 쪼개세요.** 한 PR이 200~500줄을 넘기면 위험 신호입니다.
3. **Claude가 만든 코드는 *왜* 그렇게 짰는지 사람이 이해할 수 있어야 합니다.** 이해 안 되는 부분은 Claude한테 *"이건 왜 이렇게 했어?"* 물어보고, 답이 만족스럽지 않으면 채택하지 마세요.

이 가이드라인은 강제 룰이 아닙니다. 다만 *"Claude로 큰 변경 → 통째 revert"* 패턴이 한 번 발생했으니 의식하고 작업하는 게 좋습니다.

## 자동화된 검증 (husky)

빌드 검증은 husky pre-push hook 으로 처리됩니다 (`.husky/pre-push`). git push 시점에 변경 파일을 보고 `packages/client/src/` 또는 `packages/admin/src/` 의 `.ts`/`.tsx`/`.js`/`.jsx` 변경이 있으면 빌드를 자동으로 돌리고, 실패하면 push 를 거부합니다.

**왜 pre-commit 이 아니라 pre-push 인가**: 빌드가 30초~1분 걸려서 매 커밋마다 돌리면 부담이 큽니다. push 시점이 *"다른 사람이 본다"* 의 결정 지점이라 검증의 자연스러운 위치입니다. WIP 커밋은 자유롭게 여러 번 하고, push 시점에 한 번만 검증.

**왜 Claude Code 의 Stop hook 이 아닌가**: husky 가 사람과 Claude 모두를 보호합니다. Stop hook 은 Claude 만 보호하니 이중 시스템이 됩니다. 이미 husky 인프라가 있으므로 거기를 보강하는 게 단순합니다.

기존 `.husky/pre-commit` 의 lint-staged 는 그대로 유지 (커밋 시점의 빠른 형식 정리 + ESLint --fix). pre-push 가 더 무거운 빌드 검증.

자세한 운영은 `.claude/README.md` 참조.
