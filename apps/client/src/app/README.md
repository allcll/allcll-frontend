# App Layer

애플리케이션의 최상위 레이어로, 전역 설정과 초기화를 담당합니다.

## 구조

- **main.tsx**: 진입점. TanStack Query와 Router Provider로 앱을 감싸 렌더링
- **routing.tsx**: 라우트 정의
- **layouts/**: 페이지를 감싸는 레이아웃 컴포넌트
- **lib/**: 레이아웃들이 함께 쓰는 전역 효과 훅
- **config/**: `queryClient`, Sentry 같은 전역 설정
- **index.css**: 전역 스타일

## 규칙

- 모든 레이어를 import 할 수 있습니다.
- 이 레이어의 코드는 다른 레이어에서 import 하면 안 됩니다.
