# 에러 핸들링 아키텍처

## 설계 배경

### AS-IS

- 사소한 JS `undefined` 에러 → 전체 페이지가 막히는 이슈
- 사용자에게 명확한 다음 액션을 제공하지 않음

### TO-BE

- ErrorBoundary로 페이지단 오류 막기
- 사용자에게 명확한 액션 제공
- 에러 진입점 단일화

---

## 전체 흐름도

```
HTTP Response
     ↓
┌─────────────────────────────────────────────┐
│  API Layer (fetchJsonOnAPI 등)               │
│  → throw ApiError(status, code, message)    │
│  → throw NetworkError (fetch 실패)           │
└─────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────┐
│  React Query (useMutation / useQuery)       │
│  → QueryClient.defaultOptions.onError       │
│  → handleApiError(error)  ← 단일 진입점      │
└─────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────┐
│  classifyError(error) → ErrorType           │
└─────────────────────────────────────────────┘
     ↓
┌──────────┬──────────┬──────────┬───────────┐
│PageError │ActionErr │FeedbackE │SilentError│
│ throw()  │ Modal    │ Toast    │ Sentry    │
│ Route EB │          │          │ only      │
└──────────┴──────────┴──────────┴───────────┘

JS Runtime Error
     ↓
┌─────────────────────────────────────────────┐
│  Component ErrorBoundary                    │
│  → SilentError (Sentry) + 재시도 UI         │
└─────────────────────────────────────────────┘
```

---

## 에러 타입 4가지

| 타입       | 판단 기준                           | UI              |
| ---------- | ----------------------------------- | --------------- |
| `page`     | 이 화면을 더 써도 의미가 있는가?    | Route ErrorPage |
| `action`   | 사용자가 지금 뭔가 선택해야 하는가? | Modal           |
| `feedback` | 알려주기만 하면 되는가?             | Toast           |
| `silent`   | 사용자에게 보여줄 필요가 있는가?    | Sentry only     |

---

## Layer 별 구현

### Layer 1 — API Layer (`shared/lib/errors.ts`, `shared/api/api.ts`)

**에러 클래스**

```ts
class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) { ... }
}

class NetworkError extends Error { ... }
```

**API 함수에서 구조화 에러 throw**

```ts
// 기존: throw new Error(await response.text())
// 변경: parseApiError(response) → throw ApiError(status, code, message)
```

백엔드 에러 응답 스펙: `{ code: string, message: string }`

---

### Layer 2 — Error Classifier (`shared/lib/errorClassifier.ts`)

```ts
export function classifyError(error: unknown): ErrorType;
```

**HTTP status 기반 폴백**
| Status | ErrorType |
|--------|-----------|
| 401, 403, 404 | `page` |
| 500, 502, 503 | `page` |
| 4xx (기타) | `action` |
| NetworkError | `action` |
| JS runtime | `silent` |

**errorCode 기반 우선 분류** (`CODE_TYPE_MAP`)

---

### Layer 3 — 단일 진입점 (`shared/lib/handleApiError.ts`)

```ts
export function handleApiError(error: unknown): void {
  // 1. Sentry 캡처 (모든 에러)
  // 2. classifyError → switch
  //    page     → throw (Route ErrorBoundary로 전파)
  //    action   → useErrorModal.open()
  //    feedback → useToastNotification.addToast()
  //    silent   → Sentry only
}
```

---

### Layer 4 — React Query 전역 설정 (`app/main.tsx`)

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: error => handleApiError(error),
    },
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 2;
      },
      throwOnError: error => {
        // page 에러면 Route ErrorBoundary로 throw
        return error instanceof ApiError && [401, 403, 404, 500, 502, 503].includes(error.status);
      },
    },
  },
});
```

---

### Layer 5 — Component ErrorBoundary (`shared/ui/ErrorBoundary.tsx`)

JS Runtime Error 격리. Route ErrorBoundary와 역할 분리.

```
Route ErrorBoundary    → 진짜 페이지 실패 (loader 실패, 인증 실패)
Component ErrorBoundary → JS runtime 에러 (undefined 참조, 렌더 에러)
```

**적용 위치**

```
App
 └─ Route errorElement (ErrorPage)
     └─ MainLayout
         └─ <ErrorBoundary>          ← 페이지 컴포넌트 최상단
             └─ <PageComponent>
                 └─ <ErrorBoundary fallback={...}>  ← 리스트/섹션 단위
                     └─ <CourseList />
```

---

### Layer 6 — ActionError Modal

`shared/model/useErrorModal.ts` — Zustand store
`shared/ui/ErrorModal.tsx` — Dialog UI (allcll-ui 활용)

MainLayout에 `<ErrorModal />` 등록.

---

## 파일 목록

| 파일                            | 작업                                |
| ------------------------------- | ----------------------------------- |
| `shared/lib/errors.ts`          | `ApiError`, `NetworkError` 추가     |
| `shared/api/api.ts`             | `parseApiError`로 구조화 에러 throw |
| `shared/lib/errorClassifier.ts` | 신규 — 에러 분류                    |
| `shared/lib/handleApiError.ts`  | 신규 — 단일 진입점                  |
| `app/main.tsx`                  | QueryClient 전역 에러 설정          |
| `shared/ui/ErrorBoundary.tsx`   | 신규 — JS Runtime 격리              |
| `shared/model/useErrorModal.ts` | 신규 — Action 에러 모달 상태        |
| `shared/ui/ErrorModal.tsx`      | 신규 — Action 에러 모달 UI          |
| `app/layouts/MainLayout.tsx`    | `ErrorModal` 추가                   |

---

## BE 에러 코드 계약

`errorClassifier.ts`의 `CODE_TYPE_MAP`에 추가.

```ts
const CODE_TYPE_MAP: Record<string, ErrorType> = {
  DUPLICATE_SCHEDULE: 'action',
  INVALID_COURSE_DATA: 'feedback',
  TIMETABLE_NOT_FOUND: 'page',
  // BE와 합의된 코드 추가
};
```
