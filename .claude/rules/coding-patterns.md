# 코딩 패턴 규칙

근거: `shared/api/api.ts`, `entities/user/{api,model}`, `entities/subjects/api/subjects.ts`, `shared/model/createColumnStore.ts`, `features/wish/model/useWishTableColumnStore.ts`, `widgets/live/board/model/useLiveTableColumnStore.ts`, `app/main.tsx`, `admin/src/main.tsx`.

## API — `shared/api/api.ts`의 6개 함수

근거: `packages/client/src/shared/api/api.ts` 1~83라인.

직접 `fetch()` 호출 금지(현 코드베이스에 0건). base URL과 `credentials: 'include'`가 통일됨.

```ts
fetchOnAPI(url, options): Promise<Response>                            // 수동 ok 체크
fetchJsonOnAPI<T>(url, options): Promise<T>                            // !ok 시 throw
fetchDeleteJsonOnAPI<T>(url, body?, options?): Promise<T | null>       // DELETE, 204→null
fetchEventSource(url, options?): EventSource                           // SSE
fetchJsonOnPublic<T>(url, options?): Promise<T>                        // 정적 public JSON
fetchTextOnPublic(url, options?): Promise<string>                      // 정적 public 텍스트
```

**API 함수 작성 패턴** (근거: `entities/user/api/user.ts`):

```ts
// GET — fetchJsonOnAPI 1줄
export const getMe = async (): Promise<UserResponse> =>
  fetchJsonOnAPI<UserResponse>('/api/auth/me');

// POST / 응답 void — fetchOnAPI 후 ok 검증
export const postLogin = async (body: LoginRequest): Promise<void> => {
  const response = await fetchOnAPI('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await response.text());
};
```

규칙: URL은 `/api/...` 또는 정적 public 경로(도메인은 `VITE_API_BASE_URL`이 prepend). 응답 타입은 같은 슬라이스 `model/types.ts`. 함수명은 HTTP 동사(`getMe`, `postLogin`, `updateMe`, `deleteMe`) 또는 `fetch...`.

## React Query 패턴

근거: `entities/user/model/useAuth.ts`.

```ts
const AUTH_QUERY_KEY = ['auth', 'me'];   // 모듈 상수

export function useMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => postLogin(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY }),
    // onError는 사용처에서 처리 (useAuth.ts 주석)
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY }),  // 로그아웃은 remove
  });
}
```

### queryKey 규칙 (실측 grep)

- 튜플 배열 — `['auth', 'me']`, `['subjects', semester]`, `['timetableData', timetableId]`
- 첫 요소는 도메인 — `'auth'`, `'subjects'`, `'timetableData'`, `'timetableList'`, `'pinnedSubjects'`, `'preRealSeats'`, `'departments'`, `'faq'`, `'privacyPolicy'`, `'serviceSemester'`
- 모듈 상수로 빼서 mutation invalidate에서 재참조
- 큰 도메인은 key factory 사용 가능 (`graduationQueryKeys.all`/`.check()`/`.courses()`)

#### 새 API 추가할 때 어느 패턴을 쓸지

데이터: 6개월간 새 API 파일 9개 추가됨. 일관성 부재가 부채가 됨.

판단 기준:
- **단순 단일 쿼리** (한 엔드포인트에서 데이터 한 번 가져오면 끝) → 모듈 상수. 예: `const PRIVACY_QUERY_KEY = ['privacyPolicy'] as const`
- **2개 이상 변형이 있는 도메인** (`/check`, `/courses`, `/criteria` 같이 같은 도메인의 여러 endpoint) → key factory. graduation 패턴 따라가기.
- **파라미터 있는 단일 쿼리** (`['timetableData', id]`) → 인라인 튜플도 허용. 다만 mutation에서 invalidate하는 곳이 2곳 이상이면 모듈 상수로.

graduation 패턴 (참고용 — 실측: factory 는 `model/useGraduation.ts` 안에 있음. `api/` 가 아님):
```ts
// entities/graduation/model/useGraduation.ts
export const graduationQueryKeys = {
  all: ['graduation'] as const,
  check: () => [...graduationQueryKeys.all, 'check'] as const,
  certificationCriteria: () => [...graduationQueryKeys.all, 'certificationCriteria'] as const,
  departments: () => [...graduationQueryKeys.all, 'departments'] as const,
  criteriaCategories: () => [...graduationQueryKeys.all, 'criteriaCategories'] as const,
  courses: () => [...graduationQueryKeys.all, 'courses'] as const,
};
```

→ `invalidateQueries({ queryKey: graduationQueryKeys.all })` 으로 도메인 전체 무효화 가능. 새 API 도메인 추가 시 이 패턴 우선 검토. factory 는 훅과 함께 `model/` 에 둠 (실측).

### 캐시 정리

- 데이터 살아있어야 함 → `invalidateQueries`
- 더 이상 의미 없음(로그아웃/탈퇴) → `removeQueries`
- optimistic update → `cancelQueries` 후 `setQueryData`

## QueryClient 설정

근거: `client/src/app/main.tsx` 12라인, `admin/src/main.tsx` 9~17라인.

| | client | admin |
|---|---|---|
| `retry` | (기본 3) | `1` |
| `refetchOnWindowFocus` | (기본 true) | `false` |
| `staleTime` | (기본 0) | `30_000` |

→ 새 코드에서 staleTime 임의 변경 금지. 훅 단위로만 (예: `useMe`의 `Infinity`).

## Zustand — `createColumnStore` 팩토리

근거: `shared/model/createColumnStore.ts` + 두 사용처.

테이블 헤더 표시/숨김 영구 저장은 항상 이 팩토리. 직접 `create + persist` 다시 짜지 말 것.

```ts
// 팩토리: localStorage 키는 `${tableType}-table-head-store`
export const createColumnStore = <T>(tableType: string, defaults: HeadTitle<T>[]) => ...

// 사용 (features/wish/model/useWishTableColumnStore.ts)
const WishesColumns: HeadTitle<Wishes & IPreRealSeat>[] = [
  { title: '학수번호', visible: true, key: 'subjectCode' },
  // ...
];
export const useWishesTableStore = createColumnStore('wishes', WishesColumns);
//  → localStorage: 'wishes-table-head-store'
```

규칙: `tableType`은 **유일해야 함**. 기존 `'wishes'`, `'live'`와 충돌 금지. `key`는 `T`의 실제 필드명(TypeScript 검증).

### 일반 Zustand store

- `create<I...Store>()((set, get) => ({ ... }))`. `I` 접두사는 자주 쓰이나 강제 아님.
- 영구 저장 시 `persist` + 명시적 `name`(슬라이스 이름 포함해 충돌 방지).

## 타입 위치 규칙

| 타입 | 위치 |
|---|---|
| 여러 슬라이스 공유 (`Subject`, `Wishes`, `SimulationSubject`, `With<T,K>`, `SimulationStatusType`) | `shared/model/types.ts` |
| 단일 도메인 (`LoginRequest`, `UpdateMeRequest`, `UserResponse`) | `entities/<slice>/model/types.ts` |
| 컴포넌트 Props | 컴포넌트 파일 내부 |
| API 응답 래퍼 | API 파일 내부 (`SubjectResponse`는 `subjects.ts` 안) |

`shared/model/types.ts` 상단 TODO대로 도메인별 분리 진행 중. 신규는 슬라이스 안에.

## 네이밍

- **인터페이스/타입**: `I` 접두사 + 무접두사 혼재 (`IButton` vs `Subject`). 강제 안 함 — 주변 파일과 일관성 우선.
- **컴포넌트**: `PascalCase.tsx`, **훅**: `useXxx.ts`, **API 파일**: `<slice>.ts` 또는 도메인 단어
- **JSDoc**: 훅/API에 한 줄 + 메서드/엔드포인트 (`useAuth.ts` 패턴)
  ```ts
  /**
   * GET /api/auth/me
   * 사용자 정보 조회 훅입니다.
   */
  ```

## PR 체크리스트

근거: `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `git log` 패턴.

- [ ] **빌드 통과** — `pnpm run build-client`(또는 `build-admin`) 로컬 통과
- [ ] **타깃 브랜치** — feature/fix → `develop`, hotfix → `main`
- [ ] **커밋 메시지** — `feat:`/`fix:`/`hotfix:`/`refactor:`/`chore:`/`docs:`/`style:`/`test:` + 한국어. QA 연동은 `fix:[QA-XXX] ...` (CONTRIBUTING.md 7종 + git log `hotfix`)
- [ ] **PR 본문** — `## 작업 내용` / `## 변경 사항 및 리뷰 포인트` (템플릿)
- [ ] **레이어 import 방향** — entities에서 features/widgets/pages 호출 금지
- [ ] **direct `fetch()` 미사용** — 6개 함수만
- [ ] **barrel `index.ts` 미생성** — 직접 모듈 경로 유지
- [ ] **`packages/{allcll-ui,sejong-ui}/` 미수정** — 별도 PR
- [ ] **디자인 시스템 우선 사용** — 새 UI 작성 시 `@allcll/allcll-ui`(또는 시뮬레이션이면 `@allcll/sejong-ui`) 카탈로그를 먼저 검토. raw `<button>`/`<input>` 등 사용 전에 `Button`/`Input`/`TextField` 등이 적합한지 확인. 자세한 가이드는 `.claude/rules/allcll-ui.md` 의 *"새 UI 만들기 전에"* 섹션.
- [ ] **simulation UI 격리** — 위젯별 표 (`.claude/rules/allcll-ui.md`)
- [ ] **Mutation `onSuccess` invalidate/remove** 누락 없음
- [ ] **새 persist store는 unique key** — `'wishes'`, `'live'` 충돌 금지
- [ ] **lint-staged 통과** — husky pre-commit (수동 회피 금지)

## 자주 하는 실수 (반복 등장)

근거: `git log` hotfix/fix 패턴.

1. **빌드 깨고 푸시** — `hotfix: 미사용 변수 제거`, `hotfix: 중복 속성 선언 제거`. 로컬 빌드 통과 후에만 푸시.
2. **응답 파싱 가정** — `hotfix:[QA-143] 201 응답 파싱 오류`. 204/201은 본문 없을 수 있음. `fetchDeleteJsonOnAPI`만 204 자동 처리.
3. **mutation 후 invalidate 누락** — `fix: 졸업 재검사 시 수강 이력 쿼리 캐시 제거`. mutation은 onSuccess까지 한 세트.
4. **cleanup 누락** — `fix: 배너 화면 이탈 시 confetti interval 중단`. setInterval/EventSource는 useEffect cleanup.

## 권장 개선 (별도 PR)

1. ~~**husky `pre-push`에 `pnpm run build-client`**~~ → **적용 완료** (`.husky/pre-push` 도입). 변경 파일 가지치기 포함 (md/json 만 변경 시 빌드 스킵).
2. **`@tanstack/eslint-plugin-query`** — queryKey/exhaustive-deps 자동 검증
3. **`eslint-plugin-boundaries`** — FSD 레이어 import 방향 ESLint 강제 (다만 기존 위반 10건 미해결 → 도입 즉시 CI red. 위반 정리가 선행 필요)
4. **API 시그니처 통일** — POST+ok 검증 보일러플레이트를 wrapper로 추출. `/new-api` skill 이 보일러플레이트는 자동 생성하나, 함수 자체의 통일은 별도 작업.
5. **타입 도메인 분리** — `shared/model/types.ts` TODO대로 entities로 점진 이동 (`shared/model/types.ts` line 1: `// Fixme: 타입 도메인 별로 쪼개서 타입 각자 관리하기`)
6. ~~**Claude Code hooks 도입**~~ → **채택 안 함**. husky pre-push 가 사람과 Claude 모두를 보호하므로 충분. Claude Code Stop hook 은 Claude 만 보호 → 이중 시스템.
7. **CI 에 lint job 추가** — `.github/workflows/pr-ci.yml` 이 빌드 + preview 만 실행. lint 단계 추가하면 형식 깨진 코드가 PR 단계에서도 잡힘. husky pre-commit `lint-staged` 와 보완 관계.
8. **PR CI 에 typecheck job 분리** — 현재 `tsc -b && vite build` 가 한 번에 돔. 분리하면 빌드 통과/실패 원인 식별 용이.
