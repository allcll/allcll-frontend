# `.claude/` 디렉토리 가이드

이 폴더는 [Claude Code](https://code.claude.com/) 에이전트의 동작을 우리 프로젝트에 맞게 커스터마이징하는 설정입니다. 팀원이라면 한 번씩 읽어보세요.

## 폴더 구성

```
.claude/
├── README.md                   # 이 파일
├── rules/                      # 팀 공통 규약 (모든 세션 또는 path-scoped)
│   ├── allcll-ui.md            # 디자인 시스템 카탈로그 (.tsx 작업 시)
│   ├── coding-patterns.md      # API/RQ/Zustand/PR 패턴 (항상)
│   ├── fsd-architecture.md     # FSD 레이어 규칙 (항상)
│   └── simulation.md           # 시뮬레이션 도메인 (simulation/ 작업 시)
└── skills/                     # 팀 공통 슬래시 커맨드
    ├── review/SKILL.md         # /review — PR 셀프 리뷰
    ├── new-slice/SKILL.md      # /new-slice — FSD 슬라이스 스캐폴딩
    └── pr-ready/SKILL.md       # /pr-ready — PR 직전 종합 검증
```

루트의 `CLAUDE.md` 도 함께 매 세션 자동 로드됩니다.

빌드 검증은 husky pre-push hook 으로 처리됩니다 (`.husky/pre-push` 위치, Claude Code 와는 별개 시스템). 이유는 *"빌드 검증 (husky pre-push)"* 섹션 참조.

## 우리가 사용하는 Claude Code 메커니즘

근거: [Anthropic Claude Code Docs — Extend Claude Code](https://code.claude.com/docs/en/features-overview)

| 메커니즘 | 우리 사용 여부 | 위치 |
|---|---|---|
| **CLAUDE.md** — 매 세션 항상 로드 | ✅ 사용 중 | `/CLAUDE.md` |
| **`.claude/rules/`** — 항상 또는 path-scoped 로드 | ✅ 사용 중 (4개) | `.claude/rules/*.md` |
| **Skills** — `/명령어`로 호출, 호출 시에만 로드 | ✅ 사용 중 (3개) | `.claude/skills/*/SKILL.md` |
| **Hooks** — Claude 이벤트 hook | ❌ 사용 안 함 (husky 로 대체) | — |
| **Subagents** — 격리된 컨텍스트로 작업 위임 | ⏸️ 트리거 발생 시 추가 예정 | — |
| **MCP** — 외부 서비스 연결 | ❌ 현재 불필요 | — |

각 메커니즘이 컨텍스트에 어떻게 로드되는지의 차이는 [features-overview](https://code.claude.com/docs/en/features-overview#understand-context-costs)에 정리되어 있음. 핵심 요약:

- `CLAUDE.md` + `rules/` (paths 없는 것) → 매 세션 풀로드
- `rules/` (paths 있는 것) → 매칭 파일 만질 때만 로드
- `skills/` 본문 → 호출 시에만 로드 (description만 매 세션 로드)

## 메커니즘별 사용 가이드

### CLAUDE.md (root)

매 세션 항상 로드되는 "항상 알아야 할" 규칙. 200줄 이내 권장. 자세한 내용은 파일 상단 참조.

근거: [공식 docs — Memory](https://code.claude.com/docs/en/memory)

### .claude/rules/

CLAUDE.md를 보조하는 도메인별 규약. 두 가지 모드:

1. **항상 로드** (frontmatter 없음) — `coding-patterns.md`, `fsd-architecture.md`
2. **Path-scoped 로드** (`paths:` frontmatter) — `allcll-ui.md`(`.ts`/`.tsx` 작업 시), `simulation.md`(simulation/ 작업 시)

규칙을 추가하려면:
- 항상 필요한 규칙 → `.claude/rules/<topic>.md` 생성, frontmatter 없이
- 특정 영역에서만 필요한 규칙 → `paths:` frontmatter 추가:

```yaml
---
paths:
  - "packages/client/src/features/**"
---
```

근거: [공식 docs — Path-specific rules](https://code.claude.com/docs/en/memory#path-specific-rules)

### .claude/skills/

`/명령어`로 호출하는 재사용 가능한 워크플로. 각 skill은 **디렉토리** + `SKILL.md` 형태(파일 1개가 아님 주의).

```
.claude/skills/
├── review/SKILL.md
├── pr-ready/SKILL.md
└── new-api/SKILL.md
```

#### 등록된 명령어 3개

**`/pr-ready`** — PR 올리기 직전 종합 검증. 7단계 점검:
1. 브랜치 타깃 검증
2. `pnpm run build-client` 실행
3. ESLint 검증
4. 절대 규칙 6가지 셀프 리뷰
5. 커밋 메시지 형식 검증
6. mutation 누락 검증 (invalidateQueries 등)
7. PR 본문 *초안* 생성

**중요**: PR을 자동으로 올리지 않습니다. 본문 *초안*만 보여주고, 사용자가 *왜* 부분을 채워서 직접 `gh pr create` 합니다.

**예상 빈도**: 모든 PR에 공통적으로 사용 가능. 피처 사이클과 무관하게 *항상 필요한 검증*.

**`/review [--strict]`** — 절대 규칙 6가지로 현재 변경사항 셀프 리뷰. `/pr-ready` 의 부분 집합. 작업 중간에 가볍게 점검할 때 사용.

**`/new-api <entities-slice> <verb-noun>`** — entities 슬라이스에 새 API 함수 + react-query 훅 보일러플레이트 추가. 예: `/new-api wishes getDetail`. 동작:
- `shared/api/api.ts` 의 6개 함수(`fetchJsonOnAPI` / `fetchOnAPI` / `fetchDeleteJsonOnAPI` / `fetchEventSource` / `fetchJsonOnPublic` / `fetchTextOnPublic`) 중 HTTP method 에 맞는 것 자동 선택
- 같은 슬라이스 `model/` 의 기존 useQuery 개수를 grep 해서 queryKey 패턴 자동 권장 (0개 → 단일 상수, 1개 이상 → graduation factory 패턴)
- mutation 의 onSuccess 에 `invalidateQueries` (생성/수정) 또는 `removeQueries` (삭제/탈퇴) 자동 분기
- types.ts 에 인터페이스 추가 + api/$slice.ts 함수 추가 + model 훅 추가

**예상 빈도**: 월 약 1.5건 (`coding-patterns.md` 의 *"6개월간 새 API 파일 9개"* 데이터). `/review`, `/pr-ready` 다음으로 자주 쓰임. 공식 가이드 *"같은 작업을 세 번 이상 반복하면 만든다"* 충족.

**왜 `/new-slice` 가 아닌 `/new-api` 인가**: 슬라이스 추가는 분기 1건(낮음)인데 새 API 추가는 월 1.5건(약 4-5배). 그리고 진짜 부채는 *queryKey 패턴 일관성 부재* (graduation factory / auth 단일 상수 / timetable 인라인 / 임의 문자열 4가지 혼재) — `/new-api` 가 결정 기준을 자동 적용해 표준화. 슬라이스 추가는 빈도가 낮고 *비슷한 슬라이스 복사*로 5분 안에 끝나므로 skill 화 가치 약함.

#### 새 skill 추가 절차

1. `.claude/skills/<skill-name>/` 디렉토리 생성
2. 그 안에 `SKILL.md` 작성. 최소 frontmatter:
   ```yaml
   ---
   description: 이 skill이 무엇을 하는지 (Claude가 자동 호출 여부 판단에 사용)
   ---
   ```
3. 자주 쓰는 옵션:
   - `disable-model-invocation: true` — 사용자만 호출 가능 (자동 실행 방지)
   - `argument-hint: "[arg]"` — autocomplete 힌트
   - `arguments: foo bar` — 위치 인자 이름 (`$foo`, `$bar`로 참조)
   - `allowed-tools: Read Bash(git *)` — 사전 승인할 도구
   - `` !`shell command` `` — skill 본문에 실행 결과 자동 주입
4. 라이브 변경 감지 — 파일 수정 즉시 반영 (Claude Code 재시작 불필요)

근거: [공식 docs — Skills](https://code.claude.com/docs/en/skills)

## 빌드 검증 (husky pre-push)

빌드 검증은 Claude Code 의 hook 시스템을 안 쓰고 husky pre-push 로 처리합니다. 위치는 `.husky/pre-push`.

**왜 husky 인가**: 우리 프로젝트는 이미 husky 를 사용 중입니다 (`.husky/pre-commit` 의 lint-staged). 이미 모든 팀원이 합의된 도구가 있으니 거기를 보강하는 게 자연스럽고, husky 는 사람도 Claude 도 모두 보호합니다 (Claude Code 의 Stop hook 은 Claude 만 보호).

**왜 pre-commit 이 아니라 pre-push 인가**: 우리 빌드(`pnpm run build-client`)가 30초~1분 걸려서 매 커밋마다 돌리면 부담이 큽니다. push 시점이 *"다른 사람이 본다"* 의 결정 지점이라 검증의 자연스러운 위치입니다. WIP 커밋은 자유롭게 여러 번 하고, push 시점에 한 번만 검증.

**스크립트 동작**:
1. push 되는 커밋들에서 변경 파일 추출
2. `packages/client/src/` 의 `.ts`/`.tsx` 변경이 있으면 → `pnpm run build-client` 실행
3. `packages/admin/src/` 변경이 있으면 → `pnpm run build-admin` 실행
4. 변경이 코드 파일이 아니거나 다른 패키지면 → 빌드 스킵 (md/json 만 변경됐는데도 빌드 3분 도는 일 방지)

**우회**: 긴급한 경우 `git push --no-verify` 로 우회 가능. 다만 PR CI 가 잡습니다.

## 디버깅

### Skill이 호출 안 됨

```
/review 실행해도 아무 일도 안 일어남
```

확인:
1. `/memory` 같은 슬래시 커맨드가 작동하는가? (Claude Code 자체 문제)
2. `.claude/skills/review/SKILL.md` 파일이 정확히 그 경로에 있는가? (디렉토리 이름 = 명령어 이름)
3. YAML frontmatter의 `---` 구분자가 정확한가?
4. `disable-model-invocation: true`인 skill은 사용자가 직접 `/review` 입력해야 함

### pre-push hook 이 실행 안 됨

```
빌드가 깨졌는데 push 가 그대로 됨
```

확인:
1. `.husky/pre-push` 가 존재하는가?
2. 실행 권한이 있는가? (`chmod +x .husky/pre-push`)
3. `pnpm install` 후 husky 가 init 됐는가? (`prepare` script 가 자동 실행하지만, 안 됐으면 `npx husky init`)
4. `--no-verify` 로 우회되지 않았는가?

## 향후 추가 후보 (트리거 발생 시)

[공식 docs](https://code.claude.com/docs/en/features-overview#build-your-setup-over-time)는 *"모든 걸 미리 만들지 말고 트리거가 생기면 추가"* 를 권장.

본인이 *자주 반복하는 작업*이 있으면 알려주세요. 데이터나 반복 경험으로 새 skill 을 만들 수 있습니다. 현재로서는 명백한 트리거가 있는 것만 만들어둔 상태이고, 트리거가 발생하면 그때 추가합니다.

## 참고

- 모든 설정의 근거는 각 파일 상단 또는 본문에 명시되어 있음
- Claude Code 공식 문서: https://code.claude.com/docs/
- 우리 프로젝트의 절대 규칙 6가지: 루트 `CLAUDE.md` 참조
