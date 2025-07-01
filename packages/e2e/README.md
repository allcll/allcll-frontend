# ALLCLL E2E Test
ALLCLL E2E 테스트를 관리하는 공간입니다.

## 환경 변수 설정
테스트를 실행하기 위해서는 `environment.json` 파일이 필요합니다.\
아래의 내용을 참고하여 `environment.json` 파일을 생성해주세요.\
`.env` 의 `VITE_TEST_ENV` 는 GitHub Actions 에서만 사용됩니다.

```json
{
  "target-url": "https://dev.allcll.kr"
}
```


## 실행 방법
### 1. 테스트 생성
브라우저에서 행동을 감지하여, 자동으로 테스트를 생성해줍니다.
```bash
    pnpm run test:gen
```

### 2. 테스트 UI
테스트 UI를 통해 테스트가 어떤식으로 실행되는지 볼 수 있습니다.
```bash
    pnpm run test:ui
```

### 3. 테스트 실행
e2e 테스트를 실행합니다
```bash
    pnpm run test
```