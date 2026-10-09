# Features Layer

사용자의 행동/기능(동사)을 나타내는 비즈니스 로직입니다.

## 구조
- **{feature_name}/**: 각 기능(예: `add-to-cart`, `filter-timetable`)별로 슬라이스를 만듭니다.
  - **ui/**: 기능과 상호작용하는 UI 컴포넌트 (예: `AddButton`, `FilterForm`)
  - **model/**: 데이터 변경(Mutation) 훅, 이벤트 핸들러 등 비즈니스 로직
  - **api/**: 기능과 관련된 API 호출 함수
  - **lib/**: 기능 내부에서만 사용하는 유틸리티 함수

## 규칙
- 다른 `features`를 import 할 수 있습니다.
- 하위 레이어(`entities`, `shared`)를 import 할 수 있습니다.
- 상위 레이어(`app`, `pages`, `widgets`)를 절대 import 하면 안 됩니다.
