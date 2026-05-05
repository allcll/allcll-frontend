---
paths:
  - "packages/client/src/features/simulation/**"
  - "packages/client/src/widgets/simulation/**"
  - "packages/client/src/pages/simulation/**"
---

# Simulation 작업 규칙 (path-scoped)

이 규칙은 simulation 슬라이스 파일을 만질 때만 로드된다 (공식 docs "Path-specific rules" — 컨텍스트 절약).

근거: `features/simulation/**`, `widgets/simulation/**` 실측, `shared/model/types.ts`.

## 시뮬레이션 도메인 한 줄 요약

학생이 실제 수강신청 화면과 비슷한 환경에서 **연습**하는 기능. 결과는 IndexedDB(Dexie)에 누적되어 통계로 보여진다.

## features/simulation 구조 (거의 로직만)

근거: `find features/simulation -type f`.

UI는 `ui/VisitTutorialButton.tsx` 1개뿐(plain `<button>`, allcll-ui/sejong-ui 미사용). 나머지는 `model/`(zustand stores)과 `lib/`(순수 함수: captcha, score, dexie 백업).

| 파일 | 역할 |
|---|---|
| `model/useSimulationProcess.ts` | 시뮬레이션 진행 상태 (`SimulationStatusType`) |
| `model/useSimulationSubject.ts` | 선택한 과목 목록 |
| `model/useSimulationModal.ts` | 모달 상태 |
| `model/useTutorialStore.ts` | 튜토리얼 표시 여부 (persist) |
| `lib/simulation.ts` | `APPLY_STATUS`, `BUTTON_EVENT`, 핵심 진행 로직 |
| `lib/captcha.ts` | 매크로 방지 캡차 |
| `lib/score.ts` | 점수 계산 (`getAccuracy`, `getAccuracyScore`, `getSpeedScore`) |
| `lib/checkSubjectResult.ts` | 신청 결과 분류 |
| `lib/result.ts`, `lib/subjects.ts`, `lib/subjectPicker.ts` | 결과/과목 조회 유틸 |
| `lib/backupData.ts` | Dexie 백업/복구 |
| `lib/simulationTimes.ts`, `lib/getSimulationMode.ts`, `lib/routing.ts`, `lib/formators.ts`, `lib/useReloadSimulation.ts` | 부가 유틸 |

## 시뮬레이션 상태 타입

근거: `shared/model/types.ts` 74라인.

```ts
/** before: 튜토리얼 + 관심과목 선택
 *  start: 시작 → 대기 → 과목 불러오기 전
 *  progress: 과목 신청 프로세스
 *  finish: 결과 모달 */
export type SimulationStatusType = 'before' | 'start' | 'progress' | 'finish';
```

새 상태를 추가할 때는 4단계 흐름을 깨지 않도록 주의. 추가 시 모든 분기(`SimulationModal`, `Processing`, `WaitingModal` 등)도 함께 업데이트.

## UI 격리 (재확인)

`.claude/rules/allcll-ui.md`의 격리표 참조. 핵심:

- **세종대 화면 흉내(중앙 게임 영역) → `@allcll/sejong-ui`**: `SimulationModal`, `Processing`, `WaitingModal`, `CaptchaInput`, `RegisteredTable`, `NoneRegisteredTable`, `SimulationSearchForm`
- **외곽 UI(튜토리얼/결과/세팅) → `@allcll/allcll-ui`**: `SimulationResultModal`, `before/*` 모달들, `TimetableChip`, `SubjectTable`, `ActionButton` 등

## IndexedDB (Dexie) 사용

근거: `features/simulation/lib/backupData.ts`, `lib/result.ts`, `entities` 측 `db, SimulationRun, SimulationRunSelections from '@/shared/config/dbConfig.ts'`.

- 시뮬레이션 결과는 서버가 아니라 **클라이언트 IndexedDB**에 저장됨 (Dexie).
- DB 스키마는 `shared/config/dbConfig.ts`에 정의. 새 컬렉션 추가 시 마이그레이션 고려.
- 백업/복구는 `backupData.ts`의 헬퍼 통해 (직접 dexie API 호출하지 말고).

## 자주 하는 실수

1. **`SimulationStatusType` 추가/삭제 시 모든 모달 분기 업데이트 누락** — `SimulationModal.tsx`의 `closeDisabledStatuses` 등 여러 곳에서 사용 중.
2. **시뮬레이션 본 화면을 `allcll-ui`로 만들기** — 세종대 학사 시스템과의 시각적 일치성이 핵심 가치. `sejong-ui`에 없는 컴포넌트가 필요하면 sejong-ui 측 PR로 추가.
3. **Dexie 트랜잭션 누락** — 여러 테이블을 동시에 갱신할 때 `db.transaction(...)` 사용.
