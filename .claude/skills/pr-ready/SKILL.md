---
name: pr-ready
description: PR 올리기 직전 종합 검증. 빌드 + ESLint + 절대 규칙 6가지 셀프 리뷰 + 커밋 메시지 형식 + mutation 누락 + PR 본문 *초안* 생성. PR 자동 생성/푸시는 안 함 — 사용자가 *왜* 부분을 채운 후 직접 gh pr create. "PR 준비 다 됐어?", "PR 올리기 직전 점검" 같은 요청에는 사용하지 말 것 — 사용자가 명시적으로 /pr-ready 를 입력해야 실행됨.
disable-model-invocation: true
allowed-tools: Read Glob Grep Bash(git *) Bash(pnpm run build-client*) Bash(pnpm run build-admin*) Bash(pnpm -F * run lint*) Bash(node *)
---

PR 올리기 직전의 7단계 종합 검증. **PR 자동 생성/푸시는 안 함** — 본문 *초안*만 보여주고 사람이 *왜*를 채워서 직접 `gh pr create`.

## 실행 순서

### 1. 브랜치 타깃 검증

```bash
git rev-parse --abbrev-ref HEAD                    # 현재 브랜치
git log --oneline develop..HEAD 2>/dev/null | head # develop 와의 차이
git log --oneline main..HEAD 2>/dev/null | head    # main 와의 차이
```

판단:
- 브랜치 prefix `feature/`, `fix/`, `refactor/` → **타깃: `develop`**
- 브랜치 prefix `hotfix/` → **타깃: `main`**
- 그 외 → 사용자에게 물어보기

`develop` / `main` 으로부터 분기한 게 맞는지 확인. 분기점이 잘못됐으면 ⚠️.

### 2. 빌드 검증

변경 파일 분석:

```bash
git diff --name-only $(git merge-base HEAD develop)..HEAD 2>/dev/null || \
git diff --name-only HEAD~5..HEAD
```

- `packages/client/src/**/*.{ts,tsx,js,jsx}` 변경 있음 → `pnpm run build-client` 실행
- `packages/admin/src/**/*.{ts,tsx,js,jsx}` 변경 있음 → `pnpm run build-admin` 실행
- 둘 다 없으면 빌드 스킵 (md/json 만 변경된 경우)

빌드 실패 시 STOP. 에러 메시지 출력 후 *"수정 후 다시 /pr-ready"* 안내.

빌드 통과 시 ✅ 와 빌드 시간 출력.

### 3. ESLint 검증

루트 lint-staged 가 staged 파일에 ESLint --fix 를 자동 실행하므로 (husky pre-commit), 보강 차원에서 변경된 패키지의 lint 를 실행.

```bash
# 변경된 패키지 식별 후
pnpm -F @allcll/client run lint        # client 변경 시
pnpm -F @allcll/admin run lint         # admin 변경 시
```

⚠️ `packages/client/package.json` 의 lint script 가 깨져 있을 수 있음 (`"eslint allcll_admin_frontend"` 같은 잘못된 디렉토리). 그 경우 별도 PR 로 `"eslint ."` 으로 수정 안내.

실패 시 ❌. 다만 lint-staged 가 이미 staged 에 적용했으므로 깨끗한 상태가 정상.

### 4. 절대 규칙 6가지 셀프 리뷰

`/review` 의 점검 로직을 동일하게 실행. 결과를 ✅/⚠️/❌ 로 통합 출력.

자세한 점검 항목은 `.claude/skills/review/SKILL.md` 참조.

### 5. 커밋 메시지 형식 검증

```bash
git log --oneline $(git merge-base HEAD develop)..HEAD --format='%s'
```

각 커밋 제목이 다음 형식인지 확인:

```
^(feat|fix|hotfix|refactor|chore|docs|style|test)(\([^)]+\))?:\s.+
```

또는 QA 형식: `^fix:\[QA-\d+\]\s.+`

벗어난 커밋이 있으면 ⚠️. 다만 *"squash and merge"* 가 기본 (`CONTRIBUTING.md`)이라 PR 머지 시 합쳐지므로 PR 제목만 형식 맞으면 OK.

### 6. Mutation 누락 검증

변경 파일에서:
- 신규 `useMutation(` 호출이 있는데 같은 훅 안에 `invalidateQueries` / `removeQueries` / `setQueryData` 가 없음 → ⚠️ *"의도적 생략인지 확인"*
- 신규 `persist({` 호출의 `name:` 값이 기존 store 와 중복 → ❌
- 신규 `setInterval` / `setTimeout` / `EventSource` / `addEventListener` 가 `useEffect` 안에 있는데 cleanup return 없음 → ⚠️

근거: `git log` 의 `fix: 배너 화면 이탈 시 confetti interval 중단`, `fix: 졸업 재검사 시 수강 이력 쿼리 캐시 제거` 등.

### 7. PR 본문 초안 생성

다음 형식으로 출력 (그대로 커밋하지 말고 사람이 *왜* 부분을 채울 것):

```
## 작업 내용

<!-- 무엇을 했는가 + 왜 했는가 를 함께 적어주세요. -->
TODO: *왜* 이 변경이 필요했는지 한두 문장으로

### Claude가 추출한 사실 정보 (참고용 — 그대로 본문에 포함하지 마세요)
- 변경 파일: N개
- 추가/삭제 라인: +X / -Y
- 주요 변경 영역: <slice 또는 디렉토리 추정>
- 관련 커밋:
  - <sha> <subject>

## 변경 사항 및 리뷰 포인트

<!-- 리뷰어가 특히 봐줬으면 하는 부분, 의도적인 트레이드오프, 같이 검토하고 싶은 결정 -->
TODO: 이 PR 에서 *결정한 부분* (왜 이 패턴? 왜 이 위치?)

## 체크리스트

- [x] `pnpm run build-client` 통과 (자동 검증됨)
- [x] 절대 규칙 6가지 준수 (자동 검증됨)
- [ ] 커밋 메시지 형식 — 이상 있음 / 정상
- [ ] 머지 타깃 — develop / main
- [ ] mutation invalidate / cleanup 누락 점검 — 자동 점검 결과 첨부

## QA / 이슈

<!-- "Fixes #N" 또는 "QA-XXX" 적으면 자동 링크됨 -->
```

### 8. 다음 단계 안내

```
## /pr-ready 검증 완료

✅ 빌드 통과 (build-client 45s)
✅ ESLint 통과
✅ 절대 규칙 6가지 모두 통과
⚠️ 디자인 시스템 우선 사용 — raw <button> 신규 1건 (검토 필요)
✅ 커밋 메시지 형식
✅ mutation invalidate

### 다음 단계 (사람이 직접 수행)
1. 위 PR 본문 초안의 TODO 부분 (*왜*) 을 직접 채우기
2. git push origin <branch>   # husky pre-push 가 빌드 재검증
3. gh pr create --base develop --title "feat: ..." --body "$(채운 본문)"
```

## 절대 하지 말아야 할 것

- **`gh pr create` 자동 실행 금지** — 본문 초안만 출력. PR 생성 결정은 사람.
- **`git push` 자동 실행 금지** — 사람이 결정.
- **빌드 실패 시 무시하고 진행 금지** — STOP 하고 에러 출력.
- **본문에 *왜* 부분을 자동 추측해서 채우기 금지** — TODO 로 남겨두기. 자동 생성 본문은 *"AI가 채운 거겠지"* 하고 리뷰어가 안 읽게 됨.
- **`packages/{allcll-ui,sejong-ui}/` 변경 감지 시 단순 경고가 아닌 STOP** — 절대 규칙 #3 위반.

## 빈도

모든 PR 에 공통 — 피처 사이클과 무관하게 *항상 필요한 검증*. 빌드가 30초~1분 걸리므로 PR 직전에만.

## 보완 안내 (만약 마주치면)

- **`packages/client/package.json` 의 lint script 가 `"eslint allcll_admin_frontend"` 로 깨져 있음** → 별도 PR 로 `"eslint ."` 수정. 다른 4개 패키지는 모두 `"eslint ."` (admin/allcll-ui/sejong-ui/common 실측).
- **PR CI 에 lint 단계 없음** — `.github/workflows/pr-ci.yml` 이 build + preview 만 함. husky pre-commit 의 lint-staged 가 보완 중. 더 엄격하게 가려면 별도 PR 로 CI 에 lint job 추가.
