# FSD 아키텍처 규칙

근거: `packages/client/src/{app,entities,features,widgets,shared}/README.md` (이미 레포에 존재 — 이 문서는 그 README들을 전제로 import 방향과 슬라이스 매핑만 추가).

@packages/client/src/app/README.md
@packages/client/src/entities/README.md
@packages/client/src/features/README.md
@packages/client/src/widgets/README.md
@packages/client/src/shared/README.md

위 4개 README를 읽으면 각 레이어의 책임·구조·규칙이 자세히 설명됨. 본 문서는 거기서 빠진 부분만 추가한다.

## 6 레이어 의존 방향 (한눈에)

```
✅ pages       → widgets, features, entities, shared
✅ widgets     → features, entities, shared
✅ features    → features (옆), entities, shared
✅ entities    → entities (옆), shared
✅ shared      → (외부 라이브러리만)
❌ entities    → features, widgets, pages
❌ features    → widgets, pages
❌ widgets     → pages
❌ shared      → 모든 상위 레이어
```

이 규칙은 **ESLint로 강제되어 있지 않다.** PR 리뷰에서 직접 확인. 신규 코드는 무조건 이 표를 따른다.

## 실제 슬라이스 목록

근거: `ls packages/client/src/{layer}/` 실측.

- **entities/** (11): `departments`, `faq`, `graduation`, `privacyPolicy`, `seat`, `semester`, `subjectAggregate`, `subjects`, `timetable`, `user`, `wishes`
- **features/** (9): `feedback`, `filtering`, `graduation`, `live`, `notification`, `simulation`, `timetable`, `user`, `wish`
- **widgets/** (8): `bottomSheet`, `filtering`, `home`, `live`, `simulation`, `timetable`, `user`, `wishlist`
- **pages/** (12 슬라이스 + 단일 파일 2개): `customerService`, `faq`, `graduation`, `home`, `live`, `notfound`, `serviceInfo`, `simulation`, `timetable`, `user`, `wishlist`, + `ErrorPage.tsx`, `ErrorPageWith404.tsx`
- **app/**: `config/sentry.ts`, `layouts/{Main,Service,Simulation}Layout.tsx`, `main.tsx`, `routing.tsx`, `index.css`
- **shared/**: `api/api.ts`, `model/{types,createColumnStore,useBottomSheet,useBottomSheetStore}.ts`, `lib/`, `config/`, `ui/`

## 슬라이스 내부 폴더 구조

각 슬라이스는 다음 중 필요한 것만 둠 (모두 둘 필요 없음):

- `ui/` — 슬라이스 전용 컴포넌트
- `model/` — 타입(`types.ts`), zustand store, react-query 훅
- `api/` — 백엔드 호출 함수
- `lib/` — 슬라이스 내부 유틸 (외부 export 안 함)

예: `entities/seat`은 `api/`만, `features/simulation`은 `model/lib`만 (UI 없음).

## 알려진 위반 사례 (점진 개선 대상)

근거: `grep -rn "from '@/{entities,features,widgets,pages}"` 실측. 본 문서 작성 시점 **10건** (이전 7건으로 알려졌으나 재검증에서 shared 위반 3건 추가 발견).

신규 코드는 따라하지 말 것. 리팩토링 PR로 점진적으로 정리.

| 위반 레이어 | 파일 | 위반 import |
|---|---|---|
| entities | `entities/timetable/api/useTimetableSchedules.ts` | → `@/features/timetable/model/useScheduleState` |
| entities | `entities/subjectAggregate/model/useSSESeats.ts` | → `@/features/live/common/api/useSSEManager` |
| entities | `entities/timetable/model/adapter.ts` | → `@/widgets/timetable/TimetableComponent` |
| entities | `entities/subjects/ui/SubjectDetail.tsx` | → `@/widgets/live/preSeat/model/usePreSeatGate` |
| features | `features/timetable/ui/TimetableBody.tsx` | → `@/widgets/timetable/{TimetableHeader, TimetableSelect, TimetableComponent}` (3 imports) |
| features | `features/wish/lib/useHeaderSelector.ts` | → `@/widgets/live/preSeat/model/usePreSeatGate` |
| shared | `shared/lib/useInfScroll.ts` | → `@/entities/subjects/model/useLectures` |
| shared | `shared/ui/bottomsheet/BottomSheet.tsx` | → `@/widgets/bottomSheet/lib/useCloseBottomSheetOnBackKey`, `@/features/timetable/lib/useScheduleModal` |
| shared | `shared/config/colors.ts` | → `@/features/simulation/lib/simulation` |
| shared | `shared/lib/useGlobalEffect.ts` | → `@/features/live/common/api/useSSEManager` |

⚠️ **shared 레이어 위반 4건**이 가장 심각 — 도메인 무관해야 할 shared가 특정 features 슬라이스를 import 하는 패턴. 리팩토링 우선순위: shared → features 의존성 끊기. 예: `colors.ts` 의 `APPLY_STATUS` import 는 `features/simulation/lib`로 옮기거나 `APPLY_STATUS` 자체를 `shared/model`로 승격.

새 슬라이스에서 비슷한 패턴이 필요해 보이면, 그건 **레이어 결정이 잘못되었다는 신호**. 예: entities에서 features 훅이 필요하면 → 그 슬라이스는 사실상 features 책임이거나, 공통 부분이 shared로 추출돼야 함.

## 슬라이스 간 협업 표준 패턴

근거: `features/graduation/model/useGraduationDashboard.ts` (실 코드).

`features` 훅이 여러 `entities` 훅을 합성해 페이지/위젯이 쓰기 좋은 형태로 가공:

```ts
// features/graduation/model/useGraduationDashboard.ts
import { useMe } from '@/entities/user/model/useAuth';
import { useGraduationCheck, useGraduationCourses } from '@/entities/graduation/model/useGraduation';

export function useGraduationDashboard() {
  const userQuery = useMe();
  const graduationCheckQuery = useGraduationCheck();
  const graduationCoursesQuery = useGraduationCourses();

  return {
    user: userQuery.data,
    graduationData: graduationCheckQuery.data,
    analyzedAt: graduationCoursesQuery.data?.createdAt ?? null,
    isPending: userQuery.isPending || graduationCheckQuery.isPending,
    isError: userQuery.isError || graduationCheckQuery.isError,
    error: userQuery.error || graduationCheckQuery.error,
  };
}
```

표준: entities는 단일 도메인 쿼리 노출, features에서 여러 도메인 조합.

## 새 슬라이스 만드는 절차

1. **레이어 결정** —
   - 데이터/모델만? → `entities`
   - 사용자 행동(클릭→뮤테이션, 폼 제출)? → `features`
   - 여러 features/entities 조합한 화면 블록? → `widgets`
   - 라우트 페이지? → `pages`
2. **유사 슬라이스 복사로 시작** — entities 레퍼런스 `entities/user`, features는 `features/graduation`, widgets는 `widgets/timetable`
3. **import는 절대 경로 (`@/...`)** — 같은 슬라이스 내부에서만 상대 경로 (`../model/useFoo`) 허용
4. **slice 안에 barrel `index.ts` 만들지 말 것** — `packages/client/src/` 와 `packages/admin/src/` 의 어떤 폴더에도 `index.ts` 금지. 직접 모듈 경로로 import. (현재 두 src 안에 barrel 0개. 패키지 진입점인 `packages/{allcll-ui,sejong-ui,common}/index.ts` 는 별개 — 외부 노출용으로 정당)

## 권장 개선 (별도 PR)

1. **`eslint-plugin-boundaries`** — 레이어 import 방향을 ESLint로 강제. CI에서 자동 차단되면 위반 누적 안 됨.
2. **`features/simulation/lib`의 `captcha`/`score`** — 도메인 무관 유틸 성격이라 향후 `shared/lib`로 이동 검토.
