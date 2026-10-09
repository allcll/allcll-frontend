# allcll-frontend

올클(ALLCLL) 프론트엔드 pnpm 모노레포입니다. `apps/client`를 고칠 때는 이 문서와 함께 [`apps/client/AGENTS.md`](apps/client/AGENTS.md)를 읽습니다. 하위 폴더의 지침 파일을 자동으로 읽지 않는 도구도 있어서 여기에 적어 둡니다.

## 폴더 구조

배포되는 앱은 `apps/`에, 앱이 가져다 쓰는 공용 코드와 개발 도구는 `packages/`에 둡니다. 패키지 이름은 폴더 이름 앞에 `@allcll/`을 붙인 것입니다.

| 경로                   | 역할                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| `apps/client`          | 서비스 웹(allcll.kr)입니다. FSD 구조를 따릅니다                            |
| `apps/admin`           | 관리자 대시보드입니다. components, hooks, pages로 나눈 일반 구조입니다     |
| `packages/common`      | client와 admin이 함께 쓰는 코드입니다. 졸업요건 화면과 학기 설정이 있습니다 |
| `packages/allcll-ui`   | 올클 디자인 시스템 컴포넌트와 아이콘입니다                                 |
| `packages/sejong-ui`   | 수강신청 연습 화면에서 세종대 수강신청 시스템 모양을 흉내 내는 UI입니다    |
| `packages/mock-server` | MSW 목 API입니다. `VITE_USE_MOCK=true`일 때 앱이 불러옵니다                |
| `packages/e2e`         | Playwright E2E 테스트입니다. 테스트할 주소는 `VITE_TEST_ENV`에서 읽습니다  |

## 코드를 둘 곳

- 한 앱에서만 쓰는 코드는 그 앱 안에 둡니다.
- client와 admin이 함께 쓰게 된 코드는 `packages/common`으로 옮기고 `@allcll/common`으로 import 합니다. 바깥에 보여 줄 것은 `packages/common/index.ts`에서 export 합니다.
- 버튼이나 모달 같은 범용 UI는 새로 만들기 전에 `packages/allcll-ui/index.ts`에 있는지 먼저 찾습니다.
- 패키지는 앱을 import 하지 않고, client와 admin도 서로 import 하지 않습니다. 상대경로로 다른 앱이나 패키지 폴더에 들어가지 않습니다.

## 명령어

레포 루트에서 실행합니다.

```bash
pnpm install
pnpm -F @allcll/client exec tsc -b    # client 타입 검사, 10초 안팎
pnpm -F @allcll/admin exec tsc -b     # admin 타입 검사
npx eslint <파일 경로>                 # 고친 파일 린트
pnpm run build-client                 # client 빌드, 끝나면 번들 리포트가 브라우저로 열림
pnpm run build-admin                  # admin 빌드
pnpm run client                       # client 개발 서버
pnpm run admin                        # admin 개발 서버
```

## 작업을 끝내기 전에

1. 고친 앱의 타입 검사가 통과하는지 봅니다.
2. 고친 파일에 `npx eslint`를 돌려 새 오류가 없는지 봅니다. 손대지 않은 줄에 원래 있던 오류는 남겨 둬도 됩니다.
3. 커밋하면 husky가 lint-staged로 `eslint --fix`와 `prettier --write`를 돌립니다. 훅을 건너뛰지 않습니다.

## 커밋과 PR

- 커밋 메시지는 `<type>: <한국어 설명>` 한 줄입니다. type은 `feat`, `fix`, `hotfix`, `refactor`, `chore`, `docs`, `style`, `test` 중에서 고릅니다.
- 브랜치는 `develop`에서 따고 PR도 `develop`으로 엽니다. 운영 장애를 막는 `hotfix`만 `main`으로 엽니다. 자세한 내용은 `CONTRIBUTING.md`에 있습니다.
- PR 본문은 `.github/PULL_REQUEST_TEMPLATE.md`의 두 칸인 작업 내용과 변경 사항 및 리뷰 포인트를 채웁니다.
