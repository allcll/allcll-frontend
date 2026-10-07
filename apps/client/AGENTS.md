# apps/client

`src/`는 Feature-Sliced Design 레이어로 나뉩니다. 위 레이어가 아래 레이어를 가져다 쓰고, 아래 레이어는 위 레이어를 모릅니다.

```
app → pages → widgets → features → entities → shared
```

## 레이어에 둘 것

| 레이어     | 둘 것                                           | 참고할 코드                                     |
| ---------- | ----------------------------------------------- | ----------------------------------------------- |
| `app`      | 진입점, 라우팅, 레이아웃, 전역 설정             | `src/app/main.tsx`, `src/app/layouts/`          |
| `pages`    | 라우트 하나에 대응하는 페이지                   | `src/pages/timetable/Timetable.tsx`             |
| `widgets`  | 여러 feature와 entity를 조합한 화면 블록        | `src/widgets/timetable/`, `src/widgets/header/` |
| `features` | 필터링이나 알림 설정 같은 사용자 행동과 그 상태 | `src/features/filtering/`                       |
| `entities` | 도메인 데이터의 타입과 API 호출, 조회 훅        | `src/entities/user/`                            |
| `shared`   | 도메인을 모르는 공용 코드와 범용 UI             | `src/shared/api/api.ts`                         |

`entities`, `features`, `widgets`, `pages`는 `entities/user`, `features/filtering`처럼 도메인 이름의 슬라이스 폴더로 나눕니다. 새 기능은 비슷한 슬라이스가 있으면 그 안에, 없으면 새 슬라이스를 만듭니다.

## import 규칙

ESLint가 막는 규칙은 하나입니다. 아래 레이어에서 위 레이어를 import 하면 루트 `eslint.config.js`의 FSD 규칙이 `no-restricted-imports` 오류를 내고, 커밋할 때 husky도 같은 검사를 돌립니다. 규칙을 끄지 말고 "위 레이어 코드가 필요할 때"의 방법으로 구조를 고칩니다.

나머지는 ESLint가 잡지 않아서 직접 지킵니다.

- 같은 레이어의 다른 슬라이스는 entities와 features에서만 import 합니다. widgets끼리는 레이어 README에 허용 규칙이 없어서 새로 만들지 않고, 필요하면 pages에서 조립합니다.
- 슬라이스끼리 서로 import 하는 순환을 새로 만들지 않습니다. `features/live`와 `features/notification`처럼 이미 있는 순환을 따라 하지 않습니다.
- 슬라이스 밖은 `@/` 별칭으로, 같은 슬라이스 안은 상대경로로 import 합니다.
- 앱 안 슬라이스에는 `index.ts` 배럴 파일이 없습니다. 도입할지는 이슈 #374에서 논의 중이라, 정해질 때까지 새로 만들지 않고 파일 경로로 직접 import 합니다. `@allcll/*` 패키지는 패키지 이름으로 import 합니다.

## 위 레이어 코드가 필요할 때

- 위 레이어 파일에 있는 타입이나 상수가 필요하면, 그것을 쓰는 곳 중 가장 아래 레이어로 옮깁니다. 도메인 타입이면 해당 entity의 `model/`이 기본 자리입니다.
- shared 컴포넌트가 feature UI나 도메인 데이터를 보여 줘야 하면, 그 컴포넌트를 widgets로 올리거나 props와 `children`으로 받게 바꾸고 조립은 widgets나 `src/app/layouts/`에서 합니다. 공지 벨을 쓰는 헤더가 `src/widgets/header/`에 있는 이유입니다.
- entity가 feature의 상태를 써야 하면 값을 인자로 받게 바꾸거나 그 로직을 feature로 올립니다.

## 슬라이스 안 폴더

| 폴더     | 둘 것                                             |
| -------- | ------------------------------------------------- |
| `api/`   | 백엔드 호출 함수                                  |
| `model/` | 타입, zustand 스토어, TanStack Query 훅과 쿼리 키 |
| `ui/`    | 컴포넌트                                          |
| `lib/`   | 슬라이스 안에서만 쓰는 유틸과 훅                  |

새 조회 훅은 `model/`에, 백엔드 호출 함수는 `api/`에 둡니다. 참고할 코드는 `src/entities/user/api/user.ts`와 `src/entities/user/model/useAuth.ts`입니다. `src/entities/notices/api/useNotices.ts`처럼 훅이 `api/`에 있는 옛 파일이 옆에 있어도 따라 하지 않습니다.

## API 호출과 오류 처리

- HTTP 요청은 `src/shared/api/api.ts`의 함수로만 보내고 `fetch`를 직접 부르지 않습니다. `public/`의 JSON은 `fetchJsonOnPublic`으로 읽습니다.
- 응답이 실패면 `throwApiError(response)`로 던집니다. `throw new Error(await response.text())`로 던지는 옛 코드는 따라 하지 않습니다.
- `ApiError`의 `message`는 화면에 그대로 띄우지 않고, 화면 문구는 `code`를 보고 정합니다. 예시는 `src/features/user/lib/loginErrors.ts`입니다.
- 쿼리 키는 entity마다 한 곳에 모읍니다. 하나면 `src/entities/user/model/useAuth.ts`의 `AUTH_QUERY_KEY`처럼 상수로, 여러 개면 `src/entities/graduation/model/useGraduation.ts`의 `graduationQueryKeys`처럼 묶어서 둡니다. 데이터를 바꾼 뒤 다시 받아야 하면 `invalidateQueries`를, 로그아웃처럼 데이터가 사라져야 하면 `removeQueries`를 씁니다.

## 헷갈리기 쉬운 것

- **토스트**: client는 `@/features/notification/model/useToastNotification`을 씁니다. `@allcll/common`에 있는 같은 이름의 훅은 admin이 쓰는 것이고 동작이 다릅니다.
- **UI와 아이콘**: 새로 만들기 전에 `@allcll/allcll-ui`에 있는지 봅니다. 아이콘도 여기서 가져오고 `lucide-react`를 직접 쓰지 않습니다.
- **수강신청 연습 화면**: 세종대 수강신청 시스템 모양을 흉내 내는 `src/widgets/simulation/modal/`, `src/widgets/simulation/table/`, `src/widgets/simulation/SimulationSearchForm.tsx`는 `@allcll/sejong-ui`를 씁니다. 이 파일들도 버튼과 다이얼로그는 `@allcll/allcll-ui`와 섞어 쓰니, 같은 폴더의 기존 코드를 따릅니다.
- **바텀시트**: `src/features/timetable/ui/BottomSheet.tsx` 하나뿐이고, 닫힐 때 시간표에서 편집 중인 일정도 함께 비웁니다. 시간표와 상관없는 화면에서 쓸 때는 이 동작을 알고 씁니다.
- **`REFACTOR_PROPOSAL.md`**: FSD를 들이기 전 구조를 분석한 옛 문서라 지금 구조의 근거로 쓰지 않습니다.

## 고친 뒤 확인

레포 루트에서 실행합니다.

```bash
pnpm -F @allcll/client exec tsc -b
npx eslint <고친 파일 경로>
```
