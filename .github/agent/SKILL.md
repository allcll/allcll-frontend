# SKILL.md — allcll-frontend 개발 컨벤션

Claude가 이 프로젝트에서 코드를 작성할 때 따라야 할 규칙입니다.

---

## 1. FSD (Feature-Sliced Design) 규칙

### 레이어 import 방향
```
app → pages → widgets → features → entities → shared
```
각 레이어는 자신보다 아래 레이어만 import할 수 있습니다.

### 슬라이스 내부 구조
```
{layer}/{slice}/
├── ui/      — React 컴포넌트
├── model/   — 훅, 타입, 전역 상태 (store, query 훅)
├── api/     — API 호출 함수 및 query 훅
└── lib/     — 슬라이스 내부 전용 순수 유틸 함수
```

### import 규칙
- barrel export(`index.ts`)를 사용하지 않습니다. 항상 직접 경로로 import합니다.
  ```ts
  // good
  import useSubject from '@/entities/subjects/model/useSubject.ts';
  // bad
  import { useSubject } from '@/entities/subjects';
  ```
- `entities` 간 직접 참조는 허용되지만, **순환 참조가 생기지 않도록** 주의합니다.
- `shared/model/types.ts`에 프로젝트 전반에서 쓰이는 공통 타입을 둡니다.

### [TODO] 확인 필요
- `entities` 간 직접 참조가 허용된 패턴인지, 아니면 `widgets`/`features`에서 조합해야 하는지

---

## 2. 훅 컨벤션

### 네이밍
- 훅 이름은 `useXxx` camelCase로 작성합니다.
- TanStack Query를 감싼 훅은 파일명과 함수명을 일치시킵니다. (`useSubject.ts` → `function useSubject`)

### 파일 위치
- 데이터를 **조회(Query)** 하는 훅: `model/` 또는 `api/`
- 데이터를 **변경(Mutation)** 하는 훅: `model/`
- API fetch 함수만 있는 경우: `api/` (훅 없이 순수 함수)

### TanStack Query 옵션
- 변하지 않는 마스터 데이터(과목 목록, 학과 목록 등)는 `staleTime: Infinity`를 사용합니다.
  ```ts
  return useQuery({
    queryKey: ['subjects', semester],
    queryFn: fetchSubjects,
    staleTime: Infinity,
  });
  ```
- `queryKey`는 `[도메인, ...파라미터]` 형태로 작성합니다.

### 타입 export
- 훅의 반환 타입이 외부에서 참조될 경우 명시적으로 export합니다.
  ```ts
  export type UseLecturesReturn = { data: Lecture[]; isLoading: boolean };
  function useLectures(): UseLecturesReturn { ... }
  ```
- 관련 타입(인터페이스)은 훅/API 파일에 함께 작성해도 됩니다.

### API 함수와 훅 공존
- 하나의 파일에 API fetch 함수와 query 훅을 함께 작성할 수 있습니다. (`useDepartments.ts` 패턴)
  ```ts
  // api 함수
  const fetchDepartments = async () => fetchJsonOnAPI('/api/departments');

  // 훅
  function useDepartments() {
    return useQuery({ queryFn: fetchDepartments, ... });
  }
  ```

---

## 3. 디자인 시스템

### 라이브러리 사용 기준

| 패키지 | 사용 범위 |
|--------|---------|
| `@allcll/allcll-ui` | 대부분의 서비스 (메인, 관리자 등) |
| `@allcll/sejong-ui` | **simulation 기능 전용** |

- simulation 외의 곳에서 `sejong-ui`를 사용하지 않습니다.
- simulation 내에서 `allcll-ui`를 사용하지 않습니다.

### 컴포넌트 패턴
- `variant`, `size` prop으로 스타일 변형을 표현합니다.
  ```tsx
  <Button variant="primary" size="medium">확인</Button>
  ```
- Radix UI `Slot`을 활용한 `asChild` 패턴을 지원합니다.
  ```tsx
  <Button variant="primary" size="medium" asChild>
    <a href="/link">이동</a>
  </Button>
  ```
- 컴포넌트 인터페이스 이름에 `I` prefix를 붙입니다. (`IButton`, `ITab` 등)

### className override
- [TODO] 디자인 시스템 컴포넌트에 외부 `className`을 넘기는 것이 허용되는지 확인 필요

### Storybook
- **`allcll-ui`, `sejong-ui`에 새 컴포넌트를 추가할 때 Storybook 작성은 필수입니다.**
- 파일 위치: 컴포넌트와 동일한 디렉터리에 `ComponentName.stories.tsx`로 작성합니다.
  ```
  button/
  ├── Button.tsx
  └── Button.stories.tsx  ← 필수
  ```
