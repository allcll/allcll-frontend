---
name: review
description: 현재 작업 디렉토리/스테이지의 변경사항을 올클의 절대 규칙 6가지와 디자인 시스템 우선 사용 원칙으로 셀프 리뷰합니다. PR 직전 종합 검증인 /pr-ready 의 부분집합으로, 작업 중간에 가볍게 점검할 때 사용합니다. "리뷰해줘", "내가 짠 거 점검해줘" 같은 요청에는 사용하지 말 것 — 사용자가 명시적으로 /review 를 입력해야 실행됨.
disable-model-invocation: true
argument-hint: "[--strict]"
arguments: mode
allowed-tools: Read Glob Grep Bash(git diff*) Bash(git status*) Bash(git log*)
---

올클 프로젝트의 절대 규칙 6가지로 *현재 변경사항* 을 셀프 리뷰합니다. **PR 자동 차단/머지는 안 함** — 알림만 출력합니다.

## 인자

- `$mode` (= `$0`, 선택): `--strict` 면 디자인 시스템 우선 사용 점검에서 raw element 신규 추가가 있으면 경고가 아닌 ❌ 로 표시.
- 인자 없으면 일반 모드 (디자인 시스템 점검은 ⚠️ 로 표시).

## 실행 순서

### 1. 변경사항 수집

```bash
git diff --name-only HEAD                # working tree + staged
git diff --name-only --cached            # staged only
git diff HEAD                            # unified diff (실제 라인)
```

비교 기준:
- 브랜치가 `develop` 으로부터 나온 경우 → `git diff develop...HEAD`
- 그 외 → `git diff HEAD~1..HEAD` (직전 커밋과 비교)
- 변경 파일이 0개면 STOP. *"변경된 파일이 없습니다."* 출력 후 종료.

### 2. 절대 규칙 6가지 점검

각 항목별 결과를 ✅/⚠️/❌ 로 표기. 근거 라인을 함께 출력 (`packages/client/src/.../foo.ts:42`).

#### 규칙 1 — `fetch()` 직접 호출 금지

```bash
# 변경 파일들 중 .ts/.tsx 에서 fetch( 호출 검색 (단, shared/api/api.ts 제외)
git diff HEAD --unified=0 -- '*.ts' '*.tsx' | grep -nE '^\+.*\bfetch\('
```

검출 시 ❌. `shared/api/api.ts` 안의 fetch 는 정당하므로 제외. 발견된 라인 출력 후 *"`shared/api/api.ts`의 6개 함수(`fetchOnAPI` / `fetchJsonOnAPI` / `fetchDeleteJsonOnAPI` / `fetchEventSource` / `fetchJsonOnPublic` / `fetchTextOnPublic`)를 사용하세요"* 안내.

#### 규칙 2 — barrel `index.ts` 신규 생성 금지

```bash
git diff --name-only --diff-filter=A HEAD | grep -E 'packages/(client|admin)/src/.+/index\.ts$'
```

추가된 `packages/client/src/**/index.ts` 또는 `packages/admin/src/**/index.ts` 가 있으면 ❌. 디자인 시스템 패키지(`packages/{allcll-ui,sejong-ui,common}/index.ts`)는 정당하므로 제외.

#### 규칙 3 — `packages/allcll-ui/`, `packages/sejong-ui/` 소스 수정 금지

```bash
git diff --name-only HEAD | grep -E '^packages/(allcll-ui|sejong-ui)/(src|index\.ts)'
```

검출 시 ❌. *"디자인 시스템 변경은 별도 PR. 절대 규칙 #3 위반."* 안내.

#### 규칙 4 — FSD 레이어 역방향 import 금지 (client 한정)

변경된 `packages/client/src/**/*.{ts,tsx}` 에서 다음 패턴을 grep:

- `entities/**` 안의 파일이 `from '@/features/`, `from '@/widgets/`, `from '@/pages/` 를 import → ❌
- `features/**` 안의 파일이 `from '@/widgets/`, `from '@/pages/` 를 import → ❌
- `widgets/**` 안의 파일이 `from '@/pages/` 를 import → ❌
- `shared/**` 안의 파일이 `from '@/(entities|features|widgets|pages)/` 를 import → ❌

기존 위반 목록은 `.claude/rules/fsd-architecture.md` 의 *"알려진 위반 사례"* 표를 단일 출처로 사용. 그 표의 항목은 *신규 위반이 아닌 한* 무시 — 변경 파일 라인이 표에 있으면 ⚠️ (점진 개선 대상이라 안내만), 표에 없는 새 위반이면 ❌.

#### 규칙 5 — 빌드 실패 상태 커밋 금지

이 skill은 빌드를 실행하지 않음 (시간 소모). 대신:
- 변경 파일에 `packages/client/src/**` 또는 `packages/admin/src/**` 의 `.ts/.tsx` 가 있으면 *"husky pre-push 가 push 시점에 빌드 검증합니다. 미리 돌려보려면 `pnpm run build-client` (또는 `build-admin`)"* 안내.

#### 규칙 6 — simulation UI 격리

변경된 `widgets/simulation/**/*.tsx` 또는 `pages/simulation/**/*.tsx` 에서:

- *"세종대 화면 흉내"* 위젯(`SimulationModal`, `Processing`, `WaitingModal`, `CaptchaInput`, `RegisteredTable`, `NoneRegisteredTable`, `SimulationSearchForm`, `pages/simulation/*`)이 `@allcll/allcll-ui` 를 import → ❌
- *"외곽 UI"* 위젯(`SimulationResultModal`, `before/*`, `TimetableChip`)이 `@allcll/sejong-ui` 를 import → ❌

자세한 분류표는 `.claude/rules/allcll-ui.md` 의 격리표 참조.

### 3. 디자인 시스템 우선 사용 점검 (보조)

변경 파일에서 *신규 추가된* raw element 검출:

```bash
git diff HEAD --unified=0 -- 'packages/client/src/**/*.tsx' 'packages/admin/src/**/*.tsx' | \
  grep -nE '^\+.*<(button|input|select|textarea|dialog)\b'
```

검출되면 `--strict` 모드에서는 ❌, 일반 모드에서는 ⚠️.

메시지: *"이 raw element 가 디자인 시스템 카탈로그(`Button`/`Input`/`Popover+ListboxOption`/`Dialog`)로 대체 가능한지 검토하셨나요? 의도된 예외라면 OK."*

기존 코드의 raw element 는 무시 (신규 추가만 잡음).

### 4. 보조 점검

- **`useMutation` 신규 추가 시 `onSuccess` 에 `invalidateQueries` 또는 `removeQueries` 호출** — 변경 파일에 `useMutation(` 신규 추가가 있는데 같은 함수 안에 `invalidateQueries` / `removeQueries` / `setQueryData` / `removeQueries` 가 없으면 ⚠️ (의도적 생략일 수도 있음).
- **새 `persist` zustand store 의 `name:` 충돌** — 신규 `persist({ ..., name: '...' })` 추가 시 기존 `'wishes'`, `'live'`, `'tutorial'` 등과 중복인지 grep.
- **`SimulationStatusType` 추가/삭제 시 모달 분기 누락** — `shared/model/types.ts` 의 `SimulationStatusType` 변경이 있으면 `SimulationModal.tsx`, `Processing.tsx`, `WaitingModal.tsx` 의 분기 업데이트 여부 ⚠️.

### 5. 결과 출력

다음 형식으로 출력:

```
## /review 결과

변경 파일: N개
- packages/client/src/...

### 절대 규칙
✅ 1. fetch() 직접 호출 — 검출 없음
❌ 2. barrel index.ts — packages/client/src/features/foo/index.ts 신규 추가
   → 절대 규칙 #2 위반. 직접 모듈 경로 import 사용.
✅ 3. 디자인 시스템 소스 미수정
✅ 4. FSD 레이어 import 방향
ℹ️ 5. 빌드 검증 — push 시점에 자동 실행 (pre-push)
✅ 6. simulation UI 격리

### 보조 점검
⚠️ 디자인 시스템 우선 사용
   - packages/client/src/widgets/foo/Bar.tsx:42 raw <button> 신규 추가
   → @allcll/allcll-ui 의 Button 으로 대체 가능 검토.
✅ Mutation onSuccess invalidate
✅ persist store name 중복

### 다음 단계
- ❌ 항목 수정 후 다시 /review 또는 /pr-ready
- ⚠️ 항목은 의도된 예외인지 사람 판단
```

## 절대 하지 말아야 할 것

- **빌드/lint 실행 금지** — 시간 소모. `/pr-ready` 에서 처리.
- **PR 자동 차단/머지 금지** — 알림만 출력. 결정은 사람.
- **기존 코드 무차별 비판 금지** — 변경된 라인만 점검 (grep `^+`).
- **`--strict` 가 아닌 모드에서 raw element 를 ❌ 로 표시 금지** — 기본은 ⚠️.

## 빈도

작업 중간에 가볍게. 의도적으로 빠르게 만들어졌으니(빌드 X) 자주 돌려도 부담 없음.
