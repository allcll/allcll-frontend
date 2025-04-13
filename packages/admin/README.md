# Admin Page - ALLCLL

ALLCLL의 관리자 페이지는 관리자들이 수강 여석 데이터를 관리하고 업데이트할 수 있도록 도와줍니다.
운영에 필요한 관리 도구를, 서비스에서 사용할 수 있도록 도와줍니다.
이 프로젝트는 ALLCLL monorepo의 일부입니다.

## 기능

- 수강 여석 데이터 관리
- 과목 정보 업데이트
- 실시간 데이터 동기화

## 프로젝트 구조

```plaintext
admin/
├── public/             # 정적 파일
├── src/                # 소스 코드
│   ├── components/     # React 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── services/       # API 서비스
│   ├── App.tsx         # 메인 App 컴포넌트
│   ├── index.tsx       # 진입점
├── tests/              # 테스트 파일
├── package.json        # 프로젝트 설정 및 의존성 관리 파일
└── README.md           # 프로젝트 설명 파일
```

## 사용 기술

- **프론트엔드**: React, TypeScript
- **백엔드**: Node.js, Express
- **빌드 도구**: Vite

## 시작하기

### 사전 준비

- Node.js (^18.0.0)
- npm 또는 pnpm

### 설치

1. 레포지토리를 클론합니다:
   ```sh
   git clone https://github.com/allcll/frontend.git
   cd ALLCLL/packages/admin
   ```

2. 의존성을 설치합니다:
   ```sh
   pnpm install
   ```

### 개발 서버 실행

개발 서버를 시작합니다:
```sh
pnpm run dev
```

### 프로덕션 빌드

프로덕션 빌드를 수행합니다:
```sh
pnpm run build
```

### 테스트 실행

테스트를 실행합니다:
```sh
pnpm run test
```

## 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](../CONTRIBUTING.md)을 참조하세요.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.
