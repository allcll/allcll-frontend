# implement.md — 기능 구현 Agent 가이드

신규 기능을 구현할 때 따르는 단계별 절차입니다.  
**반드시 순서대로 진행하고, 각 단계가 완료된 후 다음 단계로 넘어갑니다.**

---

## 전체 흐름

```
1. 설계 문서 읽기       → 구현 범위·순서·파일 목록 확정
2. UI 뼈대 설계         → allcll-ui.md 기준으로 레이아웃·컴포넌트 선택
3. 기존 파일 읽기       → 수정 대상 파일과 의존 훅 파악
4. 유사 패턴 탐색       → 같은 레이어에서 동일 패턴을 따르는 코드 참고
5. 코드 작성            → FSD 구조에 맞게 파일 생성 및 구현
6. 빌드 검증            → `pnpm run build-client` 로 타입/컴파일 에러 수정
7. 커밋                 → 컨벤션에 맞게 커밋
```

---

## Step 1. 설계 문서 읽기

### 읽어야 할 파일

- 기능 요구사항 문서 (이슈, PR 본문, 별도 spec 파일)
- `.github/agent/CLAUDE.md` — 프로젝트 개요·아키텍처
- `.github/agent/SKILL.md` — 코드 컨벤션·훅 규칙
- `.github/agent/allcll-ui.md` — 디자인 시스템 컴포넌트 카탈로그

### 이 단계에서 결정할 것

- **구현 순서**: 의존성 방향(shared → entities → features → widgets → pages) 기준으로 낮은 레이어부터
- **생성/수정 파일 목록**: 경로까지 확정
  ```
  예)
  - packages/client/src/features/graduation/ui/GraduationCard.tsx  [신규]
  - packages/client/src/features/graduation/model/useGraduation.ts  [신규]
  - packages/client/src/pages/graduation/GraduationPage.tsx         [수정]
  ```
- **외부 의존성**: 사용할 API 엔드포인트, 스토어, query 키

---

## Step 2. UI 뼈대 설계

**코드를 작성하기 전에** allcll-ui.md를 참고해 각 컴포넌트의 레이아웃을 결정합니다.

### 확인 순서

1. `packages/allcll-ui/src/components/` — 디자인 시스템 컴포넌트
2. `packages/client/src/shared/ui/` — 클라이언트 공통 컴포넌트
3. 위 두 곳에 없는 경우에만 새 컴포넌트 작성 계획 (필요 시 사용자 확인)

### 레이아웃 설계 규칙

- **수직 스택**: `<Flex direction="flex-col">`
- **수평 배치**: `<Flex direction="flex-row">`
- **좌·중·우 3분할 행**: `<RowSlots left=… center=… right=…>`
- **그리드**: `<Grid columns={{ base: 1, md: 2 }}>`
- **카드 컨테이너**: `<Card variant="elevated|outlined|filled">`

### className 사용 기준

```
allcll-ui props로 해결 가능 → props 사용
레이아웃 여백·크기 미세 조정 → className 최소 추가
새 색상·새 스타일 → 사용자에게 확인 후 추가
```

---

## Step 3. 기존 파일 읽기

수정될 파일과 그 의존 관계를 파악합니다.

### 읽어야 할 파일 유형

- **수정 대상 컴포넌트** — 현재 구조와 props 확인
- **컴포넌트가 사용하는 훅** — 반환 타입, queryKey, mutation 시그니처
- **관련 타입 파일** — `shared/model/types.ts`, 각 슬라이스 내 타입
- **API 함수** — 엔드포인트 경로, 요청/응답 타입
- **라우팅** — `app/` 의 router 설정 (페이지 추가 시)

### 체크 포인트

- [ ] import 방향이 FSD 규칙에 위반되지 않는가?
- [ ] 수정할 파일이 다른 곳에서 import되고 있는가? (사이드 이펙트 확인)
- [ ] 기존 타입과 충돌하는 타입을 새로 만들려는 건 아닌가?

---

## Step 4. 유사 패턴 탐색

같은 레이어·같은 역할의 코드를 먼저 읽어 패턴을 맞춥니다.

### 탐색 기준

| 만들 것         | 참고 위치                             |
| --------------- | ------------------------------------- |
| Query 훅        | 같은 레이어의 `model/use*.ts` 파일    |
| Mutation 훅     | 같은 레이어의 `model/use*.ts` 파일    |
| API 함수        | 같은 레이어의 `api/*.ts` 파일         |
| 페이지 컴포넌트 | `pages/` 내 비슷한 구조의 다른 페이지 |
| 위젯            | `widgets/` 내 비슷한 조합 컴포넌트    |
| 폼              | 같은 features 내 다른 폼 컴포넌트     |

### 맞춰야 할 항목

- queryKey 네이밍 형식 `['도메인', ...파라미터]`
- staleTime 설정 (마스터 데이터 → `Infinity`)
- 에러 처리 방식 (공통 에러 바운더리 vs 로컬 처리)
- 로딩 상태 처리 (`LoadingSpinner` 또는 `SkeletonRows`)

---

## Step 5. 코드 작성

### 파일 생성 규칙

- 낮은 레이어(shared/entities)부터 높은 레이어(pages) 순으로 작성
- 파일이 이미 존재하면 **반드시 먼저 Read** 후 Edit
- 새 파일은 Write로 생성

### FSD 슬라이스 내부 구조

```
{layer}/{slice}/
├── ui/      — React 컴포넌트 (.tsx)
├── model/   — 훅·타입·스토어 (.ts)
├── api/     — API 함수·query 훅 (.ts)
└── lib/     — 슬라이스 전용 순수 유틸 (.ts)
```

### import 규칙

```ts
// 직접 경로 (barrel 금지)
import useGraduation from '@/features/graduation/model/useGraduation.ts';
import GraduationCard from '@/features/graduation/ui/GraduationCard.tsx';
import { Flex, Button, Card } from '@allcll/allcll-ui';
```

### 훅 작성 패턴

```ts
// Query 훅 (조회)
function useGraduation() {
  return useQuery({
    queryKey: ['graduation'],
    queryFn: fetchGraduation,
    staleTime: Infinity, // 마스터 데이터인 경우
  });
}

// Mutation 훅 (변경)
function useUpdateGraduation() {
  return useMutation({
    mutationFn: updateGraduation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['graduation'] }),
  });
}
```

### 타입 위치

- 한 파일에서만 쓰이는 타입 → 해당 파일 내 선언
- 여러 파일에서 공유 → `shared/model/types.ts`
- 인터페이스 prefix: `I` (예: `IGraduationCard`)

---

## Step 6. 빌드 검증

```bash
pnpm run build-client
```

### 에러 수정 원칙

- **타입 에러**: 타입 단언(`as`) 남용 금지. 올바른 타입 정의로 수정
- **import 에러**: 경로 오타, barrel import 여부 확인
- **FSD 위반**: 상위 레이어를 import하는 경우 구조 재설계
- 동일 에러가 수정 후에도 반복되면 **원인을 재진단**하고 다른 접근 시도

빌드가 성공적으로 통과될 때까지 Step 5 ↔ Step 6을 반복합니다.

---

## Step 7. 커밋

빌드 성공 후 커밋합니다.

### 커밋 메시지 형식

```
<type>: <description>
```

| type       | 용도        |
| ---------- | ----------- |
| `feat`     | 새로운 기능 |
| `fix`      | 버그 수정   |
| `refactor` | 리팩터링    |
| `style`    | 포맷팅      |
| `chore`    | 설정 변경   |

### 커밋 전 체크리스트

- [ ] `pnpm run build-client` 통과
- [ ] FSD import 방향 위반 없음
- [ ] allcll-ui 소스 수정 없음
- [ ] barrel export(`index.ts`) 미사용

---

## 도메인별 슬라이스 폴더 참고

구현할 기능이 어느 서비스에 속하는지 확인하고, **해당 슬라이스 폴더 안에 새 파일을 생성합니다.** 기존 파일은 패턴 참고 대상으로 함께 활용합니다.

| 서비스        | 참고 슬라이스                        | 비고                                                        |
| ------------- | ------------------------------------ | ----------------------------------------------------------- |
| 시간표        | `timetable`                          |                                                             |
| 관심과목      | `wishlist`, `wish`, `seat`, `wishes` |                                                             |
| 올클 연습     | `simulation`                         | `@allcll/sejong-ui` 사용 (allcll-ui 혼용 금지)              |
| 실시간 여석   | `live`, `notification`, `pin`        | `live` — SSE 관련 / `notification` — 알림 / `pin` — 핀 등록 |
| 졸업요건 검사 | `graduation`, `user`, `feedback`     |                                                             |
| 학기          | `semester`                           |                                                             |
| 필터링        | `filtering`                          |                                                             |
| FAQ           | `faq`                                |                                                             |
| 홈(랜딩)      | `landing`                            |                                                             |

### simulation 주의

- `simulation` 슬라이스는 `@allcll/sejong-ui`를 전용으로 사용합니다.
- simulation 외 영역에서 `sejong-ui` import 금지.
- simulation 내부에서 `allcll-ui` import 금지.

### 탐색 방법

```
packages/client/src/{layer}/{slice}/
```

해당 슬라이스의 `model/`, `api/`, `ui/` 파일을 읽어 기존 패턴을 파악한 뒤 동일 방식으로 작성합니다.

---

## 금지 사항

| 금지                     | 대안                                        |
| ------------------------ | ------------------------------------------- |
| allcll-ui 소스 수정·삭제 | props/variant 활용, 없으면 사용자 확인      |
| Step 건너뛰기            | 각 단계 완료 후 다음 진행                   |
| 빌드 실패 상태로 커밋    | 반드시 `pnpm run build-client` 통과 후 커밋 |
| 타입 단언(`as`) 남용     | 올바른 타입 정의로 해결                     |
| barrel export 사용       | 직접 경로 import                            |
| 상위 레이어 import       | FSD 방향 준수 — 하위 레이어만 import        |
