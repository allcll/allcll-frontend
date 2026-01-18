# 🌀 올클 (ALLCLL) - Client

세종대학교 학생들을 위한 수강신청 도우미 **올클(ALLCLL)** 의 메인 웹 애플리케이션입니다.
이 프로젝트는 ALLCLL monorepo의 일부입니다.

## 🔵 주요 기능

- **실시간 여석 확인**: 인기 교양 과목 및 전체 과목의 여석 현황을 실시간 대시보드와 테이블로 제공
- **빈자리 알림 (Pin)**: 원하는 과목에 빈자리가 생기면 즉시 브라우저 알림 발송
- **수강신청 연습**: 실제와 동일한 환경(매크로 방지 입력 포함)에서 모의 수강신청 연습 및 결과 분석
- **커스텀 시간표**: 강의 시간표와 개인 일정을 통합 관리하며, 중복 시간대 허용으로 최적의 조합 탐색
- **관심 과목 분석**: 과목별 관심 인원 확인을 통한 경쟁률 예측

## 🔵 기술 스택

- **Core**: React, TypeScript, Vite
- **State Management**: Zustand, TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **UI Components**: `@allcll/allcll-ui`, `@allcll/sejong-ui`
- **Testing**: Vitest, Playwright

## 🔵 프로젝트 구조
ALLCLL Client는 fsd (Feature-Sliced Design) 아키텍처를 따릅니다:
[Feature-Sliced Design 공식 문서](https://feature-sliced.design/)

```plaintext
src/
├── app/            # 앱 전역 설정 (Provider, Router, Styles)
├── pages/          # 라우팅 페이지
├── widgets/        # 페이지를 구성하는 독립적인 UI 블록
├── features/       # 사용자 기능 및 비즈니스 로직
├── entities/       # 핵심 데이터 모델 (과목, 시간표 등)
└── shared/         # 공통 유틸리티 및 설정
```

## 🔵 시작하기

### 의존성 설치
```sh
pnpm install
```

### 실행
```sh
pnpm run client
```

### 빌드
```sh
pnpm run build-client
```

## 🔵 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](../../CONTRIBUTING.md)을 참조하세요.

## 🔵 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](../../LICENSE.md) 파일을 참조하세요.
