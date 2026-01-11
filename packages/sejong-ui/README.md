# 🌀 Sejong UI Module - 올클 연습 UI

SejongUI 모듈은 `올클 연습` 서비스의 디자인 시스템을 제공합니다. \
세종대학교 학사정보시스템의 디자인 시스템을 구현한 것으로, 디자인 변경에 대응하기 위해 설계된 프로젝트입니다.\
이 프로젝트는 ALLCLL monorepo의 일부입니다.

## 🔵 기능

- 기본 컴포넌트 디자인 (Button, Input, Select)
- 합성 모듈 디자인 (Modal)

## 🔵 프로젝트 구조

```plaintext
/packages/sejong-ui/
├── .storybook/         # Storybook 설정 파일
├── src/
│   ├── assets/         # SVG 아이콘 등 정적 에셋
│   ├── modal/          # 모달 관련 컴포넌트
│   │   ├── Modal.tsx
│   │   ├── ModalButton.tsx
│   │   ├── ModalButtonContainer.tsx
│   │   ├── ModalHeader.tsx
│   │   └── index.ts    # 모달 컴포넌트들을 내보내는 파일
│   │
│   ├── stories/        # Storybook 스토리 파일 (재사용 예시 등)
│   │
│   ├── Button.tsx      # 기본 버튼 컴포넌트
│   ├── Input.tsx       # 기본 입력 필드 컴포넌트
│   ├── Select.tsx      # 기본 셀렉트 박스 컴포넌트
│   ├── EssentialTag.tsx # 필수 입력을 나타내는 태그 컴포넌트
│   │
│   └── index.css       # Tailwind CSS 기본 스타일 및 커스텀 스타일
│
├── tailwind.config.ts  # Tailwind CSS 설정 파일
├── vite.config.ts      # Vite 설정 파일
├── tsconfig.json       # TypeScript 설정 파일
├── package.json        # 프로젝트 의존성 및 스크립트 관리
└── README.md           # 현재 파일
```

## 🔵 사용 기술

- **언어**: TypeScript, react, tailwindcss

## 🔵 시작하기

### 사전 준비

- Node.js (^20.0.0)
- pnpm

### 의존성 설치
```bash
pnpm install
```

### 개발 서버 실행 / Storybook 실행
```bash
pnpm run sejongui
```

### 프로젝트에 설치

1. 프로젝트에 `@allcll/sejong-ui` 패키지를 설치합니다.
   ```bash
   pnpm install @allcll/sejong-ui
   ```

## 🔵 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](../../CONTRIBUTING.md)을 참조하세요.

## 🔵 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](../../LICENSE.md) 파일을 참조하세요.
