# Mock Server - ALLCLL

ALLCLL의 모의 서버는 테스트 및 개발 환경에서 실제 서버와의 통신을 시뮬레이션합니다.
이 프로젝트는 ALLCLL monorepo의 일부입니다.

## 기능

- API 엔드포인트 모킹
- 테스트 데이터 제공
- 개발 환경에서의 빠른 피드백

## 프로젝트 구조

```plaintext
mock-server/
├── src/                # 소스 코드
│   ├── api/            # API 정의
│   ├── data/           # 테스트 데이터
│   ├── mocks/          # 모킹된 API 응답
├── index.ts            # 진입 파일
├── package.json        # 프로젝트 설정 및 의존성 관리 파일
└── README.md           # 프로젝트 설명 파일
```

## 사용 기술

- msw.js (Mock Service Worker)

## 시작하기

### 사전 준비

- Node.js (^18.0.0)
- npm 또는 pnpm

### 프로젝트에 설치

1. 프로젝트에 `@allcll/mock-server` 패키지를 설치합니다.
   ```bash
   pnpm install @allcll/mock-server
   ```

2. 브라우저용 모킹 서버를 설치합니다.
   ```shell
   npx msw init /packages/<Project_Name>/public
   ```
   
3. `모킹 서버를 실행할 수 있도록 설정합니다. (모킹 서버가 정상적으로 시작된 후 js가 실행되어야 합니다)
   ```tsx
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import { server } from "@allcll/mock-server";
   import App from './App'
   
   //mock server
   server.start().then(() => {
      createRoot(document.getElementById('root')!).render(
          <StrictMode>
              <App />
          </StrictMode>,
      )
   });
   ```

## 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드라인](../CONTRIBUTING.md)을 참조하세요.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.
