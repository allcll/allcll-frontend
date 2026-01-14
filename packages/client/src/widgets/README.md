# Widgets Layer

페이지를 구성하는 독립적인 블록(Smart Component)입니다.

## 구조
- **{widget_name}/**: 각 위젯(예: `LiveSeatTable`, `SimulationDashboard`)별로 슬라이스를 만듭니다.
  - **ui/**: 위젯의 UI 구조
  - **model/**: 위젯 내부의 상태 관리, 로직
  - **api/**: 위젯에서 필요한 API 호출

## 규칙
- 여러 `features`와 `entities`를 조합하여 하나의 완성된 기능을 제공합니다.
- 하위 레이어(`features`, `entities`, `shared`)를 import 할 수 있습니다.
- 상위 레이어(`app`, `pages`)를 절대 import 하면 안 됩니다.
