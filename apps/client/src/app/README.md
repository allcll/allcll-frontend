# App Layer

애플리케이션의 최상위 레이어로, 전역 설정과 초기화를 담당합니다.

## 구조
- **providers/**: 전역 Provider(TanStack Query, Zustand, Router 등)를 조합하는 컴포넌트
- **styles/**: `index.css`, `tailwind.css` 등 전역 스타일
- **types/**: 앱 전반에 걸친 글로벌 타입

## 규칙
- 모든 레이어를 import 할 수 있습니다.
- 이 레이어의 코드는 다른 레이어에서 import 하면 안 됩니다.
- `main.tsx`에서 `App` 컴포넌트를 렌더링합니다.
