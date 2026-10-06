# Entities Layer

애플리케이션의 핵심 비즈니스 데이터 모델(명사)입니다.

## 구조
- **{entity_name}/**: 각 엔티티(예: `subject`, `timetable`, `user`)별로 슬라이스를 만듭니다.
  - **ui/**: 엔티티 데이터를 보여주는 컴포넌트 (예: `SubjectCard`, `UserProfile`)
  - **model/**: 엔티티의 타입, 전역 상태(Store), 데이터 조회(Query) 훅
  - **api/**: 엔티티 관련 API 호출 함수
  - **lib/**: 엔티티 내부에서만 사용하는 유틸리티 함수

## 규칙
- 다른 엔티티를 직접 import 할 수 있지만, 순환 참조를 주의해야 합니다.
- 상위 레이어(App, Pages, Widgets, Features)를 절대 import 하면 안 됩니다.
- `shared` 레이어만 import 할 수 있습니다.
