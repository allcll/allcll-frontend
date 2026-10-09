# 폴더 구조 리팩토링 제안 보고서

## 1. 개요
본 문서는 현재 `chekll_frontend` 프로젝트(`packages/client`)의 폴더 구조를 분석하고, **Type-first, Feature-second** (최상위: 역할별, 하위: 기능별) 방식으로 개편했을 때의 효과와 문제점을 진단합니다.

## 2. 현황 분석 (As-Is)

현재 프로젝트 구조는 역할(Type)별로 폴더가 나뉘어 있으나, 내부적으로 기능(Feature)별 분류가 일관되지 않아 다음과 같은 문제점이 발생하고 있습니다.

### 2.1. 응집도 부족 (Scattered Logic)
특정 기능(예: Simulation)을 개발하기 위해 여러 폴더를 오가며 작업해야 합니다.
- `src/components/simulation/...`
- `src/pages/simulation/...`
- `src/store/simulation/...`
- `src/utils/simulation/...`
- `src/hooks` (루트에 산재됨)

### 2.2. Hooks 폴더의 혼재
`src/hooks` 폴더 내부에 API 관련(`server/`), 기능 관련(`timetable/`), 그리고 공통 훅(`useTick.ts`, `useMobile.ts`)이 섞여 있어 가독성이 떨어집니다.

### 2.3. Utils의 모호함
`src/utils` 내부에 도메인 로직(`simulation/`, `timetable/`)과 순수 유틸리티(`time.ts`, `api.ts`)가 혼재되어 있어 역할 구분이 불분명합니다.

---

## 3. 제안된 구조 (To-Be)

각 최상위 폴더(`components`, `hooks`, `layouts`, `pages`, `store`, `utils`) 내부에 **기능별 폴더**(`main`, `simulation`, `timetable`, `wishes`, `live`, `common`)를 생성하여 분류하는 방식입니다.

### 3.1. 예상 파일 분포

| 폴더 (src/) | 하위 폴더 | 예상 파일 수 | 주요 포함 내용 |
| :--- | :--- | :--- | :--- |
| **components** | `simulation/` | 25~30개 | 기존 `components/simulation` |
| | `live/` | 15~20개 | 기존 `components/live` |
| | `timetable/` | 10~15개 | 기존 `components/timetable` |
| | `wishes/` | ~5개 | 기존 `components/wishTable` |
| | `common/` | 40개+ | `banner`, `toast`, `filtering` 등 |
| | `main/` | 5~10개 | Landing 관련 |
| **hooks** | `simulation/` | 5~8개 | `useReloadSimulation` 등 |
| | `live/` | ~5개 | `useSSESeats` 등 |
| | `timetable/` | 5~8개 | `useTimetableSchedules` 등 |
| | `common/` | 20개+ | `useTick`, `useMobile`, `useSubject` 등 |
| **pages** | `simulation/` | 5개 | `pages/simulation` |
| | `live/` | 1개 | `Live.tsx` |
| | `timetable/` | 1개 | `Timetable.tsx` |
| **store** | `simulation/` | 4개 | `useSimulationProcess` 등 |
| | `common/` | 5개 | `useToastNotification` 등 |
| **utils** | `common/` | 15개+ | `time.ts`, `api.ts` 등 |

---

## 4. 예상되는 문제점 및 고려사항

### 4.1. Common 폴더의 비대화 (The "Common" Dumpster Fire)
- 여러 기능에서 공통으로 사용되는 `useSubject`, `SubjectCards` 등이 모두 `common`으로 몰리게 됩니다.
- 프로젝트가 커질수록 `common` 폴더가 비대해져 관리가 어려워질 수 있습니다.

### 4.2. 여전한 파일 탐색 비용 (Colocation 미해결)
- `hooks`와 `utils`가 정리되는 장점은 있으나, 여전히 UI(`components`)와 로직(`hooks`)이 물리적으로 분리되어 있습니다.
- 기능 개발 시 `src/components/simulation`과 `src/hooks/simulation`을 오가는 작업 패턴은 유지됩니다.

### 4.3. 대규모 리팩토링 비용 (Import Hell)
- 모든 파일의 경로가 변경되므로 프로젝트 전체의 `import` 구문을 수정해야 합니다.
- 예: `import ... from '@/hooks/useTick'` → `import ... from '@/hooks/common/useTick'`
- 이 과정에서 충돌이나 버그 발생 위험이 존재합니다.

### 4.4. 폴더 깊이 증가
- 이미 깊이가 깊은 컴포넌트 구조에 기능별 폴더가 추가되면 경로가 더 길어질 수 있습니다.
- 예: `src/hooks/simulation/server/useData.ts`

---

## 5. 결론 및 제언

제안된 구조는 **현재의 무질서한 파일들을 정리하고 가독성을 높이는 데 효과적**입니다. 특히 `hooks`와 `utils` 폴더의 정리에 큰 도움이 될 것입니다.

**성공적인 리팩토링을 위한 제언:**
1.  **Common 기준 확립:** "2개 이상의 도메인에서 사용될 경우 `common`으로 이동한다"와 같은 명확한 규칙이 필요합니다.
2.  **점진적 적용:** 한 번에 모든 폴더를 바꾸기보다 `hooks`나 `utils`부터 단계적으로 적용하는 것을 권장합니다.
3.  **대안 고려:** 만약 응집도를 최우선으로 한다면, `src/features/simulation/{components,hooks,utils}`와 같은 **Feature-first** 구조도 고려해볼 만합니다.
