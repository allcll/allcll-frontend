---
name: new-api
description: entities 슬라이스에 새 API 함수 + react-query 훅 보일러플레이트를 추가합니다. shared/api/api.ts 의 6개 함수 중 적합한 것을 자동 선택하고, 같은 도메인의 기존 API 개수에 따라 queryKey 패턴(단일 상수 vs factory)을 권장합니다. "새 API 추가", "[slice]에 [verb-noun] 엔드포인트 만들어줘" 같은 요청에는 사용하지 말 것 — 사용자가 명시적으로 /new-api 를 입력해야 실행됨.
disable-model-invocation: true
argument-hint: "<entities-slice> <verb-noun>"
arguments: slice name
allowed-tools: Read Glob Grep Bash(ls *) Bash(find *) Edit Write
---

올클의 API 패턴(`shared/api/api.ts`의 6개 함수 + 표준 react-query 훅)에 맞춰 새 API 함수와 훅 보일러플레이트를 자동 생성합니다.

근거: `entities/user/api/user.ts`, `entities/user/model/useAuth.ts`, `entities/graduation/{api,model}` 실측. `.claude/rules/coding-patterns.md` 의 결정 기준 자동 적용.

## 인자

- `$slice` (= `$0`): entities 슬라이스 이름 (예: `wishes`, `subjects`, `user`).
  - 슬라이스 단위로 API 추가 — features 측 mutation 은 이 skill 범위가 아님.
  - `pages` / `widgets` / `features` 는 본 skill 의 대상 아님 (entities 만).
- `$name` (= `$1`): HTTP verb prefix + 명사 (예: `getDetail`, `postReview`, `updatePin`, `deleteWish`).
  - verb prefix 강제: `get` / `post` / `put` / `patch` / `delete` / `fetch`.

예: `/new-api wishes getDetail` → `entities/wishes/api/wishes.ts` 에 `getDetail` 함수 + `model/useDetail.ts` 또는 기존 model 파일에 훅 추가.

## 사전 검증

1. **인자 검증**:
   - `$slice` 가 `packages/client/src/entities/$slice/` 에 존재하는지 `ls` 확인. 없으면 STOP. 사용자에게 *"`$slice` 슬라이스가 없습니다. 비슷한 슬라이스를 직접 만든 후 다시 시도하거나, 기존 슬라이스 이름을 확인하세요"* 안내.
   - `$name` 이 verb prefix(`get|post|put|patch|delete|fetch`) 로 시작하는지 정규식 확인. 아니면 STOP. 사용자에게 verb 추천.

2. **사용자 입력 수집** (대화로):
   - HTTP method (`GET` / `POST` / `PUT` / `PATCH` / `DELETE`) — `$name` prefix 로 자동 추정 후 확인.
   - endpoint URL (예: `/api/wishes/{id}`). `/api/...` 형태 강제 (정적 public 데이터면 다른 접두사).
   - request body 타입 (POST/PUT/PATCH 인 경우, 인터페이스 이름 또는 `void`).
   - response 타입 (인터페이스 이름 또는 `void`).

## 결정 기준 (자동 적용)

### 어느 fetch 헬퍼를 쓸지

근거: `shared/api/api.ts` 6개 함수.

| HTTP method | 응답 | 사용할 헬퍼 |
|---|---|---|
| GET | JSON | `fetchJsonOnAPI<T>(url)` 1줄 |
| POST/PUT/PATCH | JSON 응답 있음 | `fetchJsonOnAPI<T>` 또는 `fetchOnAPI` + 수동 `json()` |
| POST/PUT/PATCH | void/204 | `fetchOnAPI` + `if (!response.ok) throw new Error(await response.text())` |
| DELETE | JSON 또는 204 | `fetchDeleteJsonOnAPI<T>` (204 → null 자동) |
| (정적) GET | JSON | `fetchJsonOnPublic<T>` |
| (정적) GET | text | `fetchTextOnPublic` |
| (SSE) | EventSource | `fetchEventSource` |

직접 `fetch()` 호출 절대 금지 (절대 규칙 #1).

### queryKey 패턴 (단일 상수 vs factory)

근거: `coding-patterns.md` 의 결정 기준 + 실측 (`graduation` factory in `model/useGraduation.ts`).

- 같은 슬라이스 `model/` 안에 기존 useQuery 가 **0개** → 단일 모듈 상수 (`const FOO_QUERY_KEY = ['foo'] as const`).
- 같은 슬라이스 `model/` 안에 기존 useQuery 가 **1개** 이상 → factory 패턴 권장. 기존 단일 상수가 있으면 factory 로 마이그레이션 안내 (자동 변경 X — 별도 PR 권장).
- 파라미터 있는 단일 쿼리 (`['foo', id]`) → 인라인 튜플 허용. 다만 mutation 에서 invalidate 위치가 2곳 이상 예상되면 모듈 상수 권장.

자동 적용 로직:
```bash
# 같은 슬라이스 model/ 의 기존 useQuery 개수 grep
grep -rE "useQuery\s*\(" "packages/client/src/entities/$slice/model/" | wc -l
```

### mutation 의 onSuccess

근거: `entities/user/model/useAuth.ts` 패턴.

| mutation 종류 | onSuccess 동작 |
|---|---|
| 생성/수정 (POST/PUT/PATCH) | `invalidateQueries({ queryKey: ... })` |
| 삭제/탈퇴/로그아웃 | `removeQueries({ queryKey: ... })` |

자동 추정: `$name` 이 `delete` / `logout` / 명백한 *제거* 의미 → `removeQueries`. 그 외 → `invalidateQueries`. 사용자에게 확인.

### factory 위치

실측: graduation factory 는 `model/useGraduation.ts` 안에 있음 (api/ 아님). 같은 패턴 적용.

## 보일러플레이트 생성

### 1. API 함수 — `entities/$slice/api/$slice.ts`

기존 파일 있으면 추가, 없으면 새로 생성.

GET 예시:
```ts
import { fetchJsonOnAPI } from '@/shared/api/api.ts';
import { I${PascalName}Response } from '@/entities/$slice/model/types.ts';

/**
 * GET ${endpoint}
 * TODO: 무엇을 조회하는지 한 줄 설명
 */
export const $name = async (): Promise<I${PascalName}Response> => {
  return fetchJsonOnAPI<I${PascalName}Response>('${endpoint}');
};
```

POST/PUT/PATCH (void) 예시:
```ts
import { fetchOnAPI } from '@/shared/api/api.ts';
import { I${PascalName}Request } from '@/entities/$slice/model/types.ts';

/**
 * ${METHOD} ${endpoint}
 * TODO: 무엇을 처리하는지 한 줄 설명
 */
export const $name = async (body: I${PascalName}Request): Promise<void> => {
  const response = await fetchOnAPI('${endpoint}', {
    method: '${METHOD}',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};
```

DELETE 예시:
```ts
import { fetchDeleteJsonOnAPI } from '@/shared/api/api.ts';

/**
 * DELETE ${endpoint}
 * TODO: 무엇을 삭제하는지
 */
export const $name = async (): Promise<void> => {
  await fetchDeleteJsonOnAPI('${endpoint}');
};
```

### 2. 타입 — `entities/$slice/model/types.ts`

기존 파일 있으면 인터페이스만 추가:
```ts
export interface I${PascalName}Request {
  // TODO: 요청 필드
}

export interface I${PascalName}Response {
  // TODO: 응답 필드
}
```

근거: `entities/user/model/types.ts` 의 `LoginRequest`, `UserResponse` 패턴 (`I` 접두사 혼재 — 주변 파일과 일관성 우선이라 사용자에게 물어보기).

### 3. react-query 훅

#### GET (useQuery)

기존 `model/$slice.ts` 또는 `model/use$Slice.ts` 가 있으면 거기 추가, 없으면 새 파일:

```ts
import { useQuery } from '@tanstack/react-query';
import { $name } from '@/entities/$slice/api/$slice.ts';

const ${UPPER_NAME}_QUERY_KEY = ['$slice', '${queryKeyTail}'] as const;
// 또는 factory 사용 시:
// queryKey: ${slice}QueryKeys.${queryKeyTail}(),

/**
 * ${METHOD} ${endpoint}
 * TODO: 훅 설명
 */
export function use${PascalName}() {
  return useQuery({
    queryKey: ${UPPER_NAME}_QUERY_KEY,
    queryFn: $name,
  });
}
```

#### Mutation (useMutation)

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { $name } from '@/entities/$slice/api/$slice.ts';
import { I${PascalName}Request } from '@/entities/$slice/model/types.ts';

/**
 * ${METHOD} ${endpoint}
 * TODO: 훅 설명. onError 는 사용처에서 처리.
 */
export function use${PascalName}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: I${PascalName}Request) => $name(data),
    onSuccess: () => {
      queryClient.${invalidateOrRemove}({ queryKey: ${TARGET_QUERY_KEY} });
    },
  });
}
```

`${TARGET_QUERY_KEY}` 는 같은 슬라이스의 기존 queryKey 를 grep 해서 추천. 없으면 사용자에게 묻기.

## 실행 순서

1. **인자 검증** — 슬라이스 존재, verb prefix.
2. **기존 API 개수 grep** → queryKey 패턴 결정 (단일 상수 vs factory).
3. **사용자 확인** — method, endpoint, request/response 타입, mutation 의 invalidate 대상 queryKey.
4. **타입 추가** — `model/types.ts` 에 인터페이스 신규 추가 (Edit). 파일 없으면 Write.
5. **API 함수 추가** — `api/$slice.ts` 에 함수 신규 추가 (Edit). 파일 없으면 Write.
6. **훅 추가** — 기존 model 파일이 있으면 Edit, 없으면 새로 Write.
7. **사후 안내**:
   - TODO 주석 채우기 (응답 필드, 한 줄 설명)
   - 같은 도메인에 API 가 2개 이상이 됐으면 *"다음 PR 에서 factory 패턴으로 통일 검토"* 안내
   - `pnpm run build-client` 또는 `/pr-ready` 로 검증
   - `mutation` 추가 시 사용처에서 onError 처리 잊지 말기

## 절대 하지 말아야 할 것

- **barrel `index.ts` 생성 금지** — 절대 규칙 #2. 어떤 폴더에도.
- **`fetch()` 직접 호출 금지** — 절대 규칙 #1. `shared/api/api.ts` 6개 함수만.
- **여러 슬라이스에 동시 작업 금지** — 한 번에 한 슬라이스만.
- **types.ts 의 기존 인터페이스 수정 금지** — 추가만. 기존 인터페이스 변경은 별도 작업.
- **queryKey 패턴 강제 마이그레이션 금지** — 단일 상수 → factory 변환은 별도 PR. 안내만.
- **features / widgets / pages 슬라이스에 사용 금지** — entities 만. features 측 mutation 은 entities 의 API 함수를 import 해서 useMutation 으로 합성하는 패턴.

## 빈도

근거: `coding-patterns.md` 의 *"6개월간 새 API 파일 9개 추가됨"* — 월 약 1.5건. `/review`, `/pr-ready` 보다 낮지만 *공식 가이드 "3번 이상 반복"* 충족.

## 참고 (좋은 패턴 예시)

- **단일 상수 (작은 슬라이스)**: `entities/user/model/useAuth.ts` — `AUTH_QUERY_KEY = ['auth', 'me']`
- **factory (큰 슬라이스)**: `entities/graduation/model/useGraduation.ts` — `graduationQueryKeys.{all,check,certificationCriteria,departments,criteriaCategories,courses}`
- **인라인 튜플 (파라미터 있는 단일 쿼리)**: `['timetableData', timetableId]`

graduation 패턴이 가장 깔끔 — 새 도메인이 2개 이상 endpoint 가질 가능성 있으면 처음부터 factory 로 시작 권장.
