# 🌀 Common Module - ALLCLL

ALLCLL의 공통 모듈은 다른 프로젝트에서 재사용 가능한 코드와 유틸리티를 제공합니다.
Admin 기능을 추가함에 따라서 공통 모듈을 분리할 예정입니다.
이 프로젝트는 ALLCLL monorepo의 일부입니다.

## 🔵 기능

- 공통 유틸리티 함수
- 공통 타입 정의
- 공통 API 서비스

## 🔵 프로젝트 구조

```plaintext
common/
├── src/                # 소스 코드
│   ├── components/     # 컴포넌트 (예: 버튼, 모달 등)
│   ├── utils/          # 유틸리티 함수
│   ├── types/          # 타입 정의
│   ├── services/       # API 서비스
│   ├── index.ts        # 진입점
├── tests/              # 테스트 파일
├── package.json        # 프로젝트 설정 및 의존성 관리 파일
└── README.md           # 프로젝트 설명 파일
```

## 🔵 사용 기술

- TypeScript, react

## 🔵 시작하기

### 사전 준비

- Node.js (^18.0.0)
- npm 또는 pnpm

### 프로젝트에 설치

1. 프로젝트에 `@allcll/common` 패키지를 설치합니다.
   ```bash
   pnpm install @allcll/common
   ```

## 🔵 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](../../CONTRIBUTING.md)을 참조하세요.

## 🔵 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](../../LICENSE.md) 파일을 참조하세요.
