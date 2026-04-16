# allcll-ui Skill — UI 조립 가이드

allcll-ui 디자인 시스템을 사용해 client 컴포넌트를 구현할 때 따르는 규칙입니다.

---

## 0. 핵심 원칙 (반드시 지킬 것)

1. **allcll-ui 컴포넌트는 읽기 전용** — 수정·삭제 금지. 소스를 읽어 props/variant를 파악하는 용도로만 사용합니다.
2. **없는 컴포넌트를 allcll-ui에 새로 만들지 않습니다.** 필요한 경우 사용자에게 허락을 구합니다.
3. **className은 최소화** — allcll-ui props(variant, size, direction 등)로 해결할 수 있으면 className을 쓰지 않습니다. 이미 있는 컴포넌트로 해결이 안 될 때만 TailwindCSS className을 추가합니다.
4. **새 컴포넌트 작성 전에 두 곳을 먼저 확인**:
   - `packages/allcll-ui/src/components/` — 디자인 시스템 컴포넌트
   - `packages/client/src/shared/ui/` — 클라이언트 공통 컴포넌트

---

## 1. allcll-ui 컴포넌트 참고하는 법

### 소스 위치

```
packages/allcll-ui/src/components/{컴포넌트명}/
```

### export 목록 확인

```
packages/allcll-ui/index.ts
```

### import 경로 (client에서 사용 시)

```ts
import { Button, Flex, Card } from '@allcll/allcll-ui';
```

### Props 파악 순서

1. `index.ts`에서 export 이름 확인
2. 소스 파일(`ComponentName.tsx`)을 읽어 interface/type 확인
3. 스토리북 파일(`ComponentName.stories.tsx`)이 있으면 사용 예시 확인

---

## 2. 컴포넌트 카탈로그

### 레이아웃

| 컴포넌트               | 설명                   | 핵심 props                                            |
| ---------------------- | ---------------------- | ----------------------------------------------------- |
| `Flex`                 | flexbox 레이아웃       | `direction`, `justify`, `align`, `gap`, `as`          |
| `Grid`                 | grid 레이아웃          | `columns: { base, sm, md, lg, xl }`, `gap`            |
| `RowSlots`             | 좌·중·우 슬롯 레이아웃 | `left`, `center`, `right`, `withPadding`, `className` |
| `RowMain`              | RowSlots 내부 컨테이너 | `left`, `center`, `right`, `withPadding`              |
| `RowLeft/Center/Right` | Row 슬롯 개별 래퍼     | —                                                     |

**Flex 사용 예시**

```tsx
// 수직 정렬, 중앙 배치
<Flex direction="flex-col" justify="justify-center" align="items-center" gap="gap-4">
  ...
</Flex>
```

**RowSlots 사용 예시** (헤더, 리스트 행 등)

```tsx
<RowSlots
  withPadding
  left={<Icon />}
  center={<span>제목</span>}
  right={
    <Button variant="text" size="small">
      더보기
    </Button>
  }
/>
```

---

### 타이포그래피

| 컴포넌트         | 설명                            | 핵심 props                                     |
| ---------------- | ------------------------------- | ---------------------------------------------- |
| `Heading`        | 제목                            | `level: 1~5`, `size: xxl/xl/lg/md/sm/xs`, `as` |
| `SupportingText` | 보조 텍스트 (gray-500, text-sm) | className 확장 가능                            |
| `Label`          | 폼 레이블                       | —                                              |

**size 매핑**

```
level 1 → xxl: text-lg font-semibold md:text-xl
level 2 → xl:  text-base md:text-lg font-semibold
level 3 → lg:  text-base font-semibold
level 4 → md:  text-sm font-semibold
level 5 → sm:  text-xs font-semibold
```

---

### 액션

| 컴포넌트     | 설명             | 핵심 props                                |
| ------------ | ---------------- | ----------------------------------------- |
| `Button`     | 버튼             | `variant`, `size`, `asChild`, `textColor` |
| `IconButton` | 아이콘 전용 버튼 | `variant`, `icon`, `label`                |
| `Toggle`     | on/off 토글      | `checked`, `onChange`                     |
| `Checkbox`   | 체크박스         | —                                         |

**Button variant**

```
primary   — blue 배경, 흰 글씨
secondary — gray-100 배경
outlined  — 테두리, 투명 배경
danger    — red 배경, 흰 글씨
ghost     — gray-50 배경, 둥근 모서리
circle    — 원형, primary 배경
text      — 배경 없음 (textColor: primary | secondary | gray)
```

**Button size**: `small | medium | large`

**asChild 패턴** (링크를 버튼처럼 렌더)

```tsx
<Button variant="primary" size="medium" asChild>
  <a href="/path">이동</a>
</Button>
```

---

### 카드 / 컨테이너

| 컴포넌트       | 설명             | 핵심 props                                                      |
| -------------- | ---------------- | --------------------------------------------------------------- |
| `Card`         | 카드 컨테이너    | `size: small/medium/large`, `variant: elevated/outlined/filled` |
| `Card.Header`  | 카드 헤더 영역   | —                                                               |
| `Card.Content` | 카드 콘텐츠 영역 | —                                                               |

**Card variant**

```
elevated — bg-white shadow-md
outlined — bg-white border border-gray-200
filled   — bg-gray-50 shadow-sm border border-gray-200
```

---

### 인풋 / 선택

| 컴포넌트        | 설명                           | 핵심 props                                         |
| --------------- | ------------------------------ | -------------------------------------------------- |
| `Input`         | 텍스트 입력                    | `leftIcon`, `rightIcon`, HTML input props          |
| `TextField`     | 레이블 포함 입력 필드          | —                                                  |
| `Chip`          | 필터/선택 칩                   | `label`, `selected`, `variant: select/cancel/none` |
| `Tabs`          | 탭 목록 컨테이너               | children                                           |
| `Tab`           | 개별 탭 아이템                 | —                                                  |
| `Popover`       | 팝오버                         | compound: `Popover.Trigger`, `Popover.Content`     |
| `PopoverGroup`  | 동시 1개만 열리는 Popover 그룹 | —                                                  |
| `ListboxOption` | 드롭다운 옵션                  | —                                                  |

---

### 피드백

| 컴포넌트         | 설명                      | 핵심 props                                                                                   |
| ---------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| `Badge`          | 상태 뱃지                 | `variant: success/warning/danger/primary/default/beta`, `appearance: filled/outline`, `size` |
| `Banner`         | 페이지 상단 알림          | `variant: warning/info`, `deleteBanner`                                                      |
| `Toast`          | 토스트 알림               | `toast: { message, tag }`, `closeToast`                                                      |
| `Tooltip`        | 툴팁                      | —                                                                                            |
| `Dialog`         | 모달 다이얼로그           | `isOpen`, `title`, `onClose`                                                                 |
| `Dialog.Content` | 다이얼로그 내용 영역      | —                                                                                            |
| `Dialog.Footer`  | 다이얼로그 하단 버튼 영역 | —                                                                                            |

**Dialog 사용 예시**

```tsx
<Dialog isOpen={open} title="제목" onClose={() => setOpen(false)}>
  <Dialog.Content>내용</Dialog.Content>
  <Dialog.Footer>
    <Button variant="primary" size="medium" onClick={() => setOpen(false)}>
      확인
    </Button>
  </Dialog.Footer>
</Dialog>
```

---

### 색상 토큰

```ts
import { colors } from '@allcll/allcll-ui';
// colors.primary[500] → #3B82F6
// colors.secondary[500] → #EF4444
// colors.text[200] → #202123
```

TailwindCSS 클래스명: `primary-*`, `secondary-*`, `text-text-200` 등

---

## 3. client/src/shared/ui 공통 컴포넌트 (allcll-ui와 구분)

allcll-ui에 없는 클라이언트 전용 공통 컴포넌트는 `shared/ui`에 있습니다. 새 컴포넌트를 만들기 전에 확인하세요.

| 파일                                 | 설명                        |
| ------------------------------------ | --------------------------- |
| `Navbar.tsx`                         | 하단 네비게이션 바          |
| `Header.tsx`                         | 페이지 상단 헤더            |
| `Footer.tsx`                         | 페이지 푸터                 |
| `CardWrap.tsx`                       | 카드 래퍼 (클라이언트 전용) |
| `BottomSheet.tsx`                    | 바텀시트                    |
| `BottomSheetHeader.tsx`              | 바텀시트 헤더               |
| `CustomSelect.tsx`                   | 커스텀 셀렉트               |
| `ZeroContent.tsx`                    | 빈 상태 표시                |
| `ZeroElementRow.tsx`                 | 빈 행 표시                  |
| `SkeletonRows.tsx`                   | 스켈레톤 로딩 행            |
| `Loading.tsx` / `LoadingSpinner.tsx` | 로딩 상태                   |
| `BlurComponents.tsx`                 | 블러 처리 컴포넌트          |
| `DraggableList.tsx`                  | 드래그 리스트               |
| `ScrollTopButton.tsx`                | 상단 이동 버튼              |
| `TableColorInfo.tsx`                 | 테이블 색상 안내            |
| `TableTitleSettingModal.tsx`         | 테이블 타이틀 설정 모달     |

---

## 4. FSD 레이어별 파일 생성 규칙

사진/요구사항을 받으면 아래 순서로 파일을 생성합니다.

```
1. 어느 레이어인지 결정 (pages / widgets / features / entities / shared)
2. 슬라이스명 결정 (도메인 기반, 예: graduation, timetable)
3. 내부 구조 결정 (ui/ · model/ · api/ · lib/)
4. allcll-ui + shared/ui 로 조립
```

**레이어 결정 기준**

```
pages   — 라우트 단위 진입점 (GraduationPage.tsx 등)
widgets — 여러 features/entities를 조합한 독립 블록 (GraduationDashboard 등)
features — 특정 사용자 행동 단위 (graduation/ui/setup/*)
entities — 순수 데이터 모델 + 기본 UI (subject, timetable)
shared  — 도메인 없는 공통 코드만
```

---

## 5. 구현 체크리스트

새 컴포넌트를 구현할 때 아래 순서로 진행합니다.

- [ ] 요구사항에서 필요한 UI 요소 목록화
- [ ] allcll-ui에서 사용 가능한 컴포넌트 확인 (`packages/allcll-ui/src/components/`)
- [ ] shared/ui에서 사용 가능한 컴포넌트 확인 (`packages/client/src/shared/ui/`)
- [ ] 없는 컴포넌트만 새로 작성 (allcll-ui 또는 shared/ui 신규 추가 필요 시 → **사용자에게 확인**)
- [ ] FSD 레이어에 맞는 경로에 파일 생성
- [ ] import는 barrel(`index.ts`) 없이 직접 경로 사용
- [ ] className은 allcll-ui props로 해결 안 될 때만 사용

---

## 6. 금지 사항

| 금지                                              | 이유                      |
| ------------------------------------------------- | ------------------------- |
| allcll-ui 소스 수정·삭제                          | 디자인 시스템 일관성 파괴 |
| allcll-ui에 새 컴포넌트 임의 추가                 | 사전 승인 필요            |
| simulation 외 영역에서 `@allcll/sejong-ui` import | 디자인 시스템 혼용 금지   |
| barrel export(`index.ts`) 사용                    | SKILL.md 규칙             |
| 긴 className 남용                                 | allcll-ui props 우선 활용 |
