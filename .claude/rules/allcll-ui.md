---
paths:
  - "packages/client/src/**/*.{ts,tsx}"
  - "packages/admin/src/**/*.{ts,tsx}"
---

# allcll-ui / sejong-ui 규칙

이 규칙은 client/admin의 `.ts`/`.tsx`를 만질 때만 로드된다 (path-scoped, 공식 docs "Path-specific rules").

근거: `packages/allcll-ui/index.ts`, `packages/allcll-ui/src/components/**`, client의 실 사용 grep, `packages/sejong-ui/index.ts`.

## Import 패턴

```ts
import { Button, Card, Dialog, Flex, RowSlots, Heading } from '@allcll/allcll-ui';
import SejongUI from '@allcll/sejong-ui';   // sejong-ui는 default export 객체
```

- 항상 named import. 깊은 경로(`@allcll/allcll-ui/src/...`) 금지.
- `PopoverGroup`은 `client/src/app/main.tsx`와 `admin/src/main.tsx`에서 최상단 1회 래핑 (이미 적용됨, 추가 작업 불필요).

## allcll-ui 공개 컴포넌트 23종

근거: `packages/allcll-ui/index.ts` 1~29번 라인.

`Badge`, `Banner`, `Button`, `Card`(`.Header`/`.Content`), `Checkbox`, `Chip`, `Dialog`(`.Title`/`.Header`/`.Overlay`/`.Content`/`.Contents`/`.Footer`), `IconButton`, `Input`, `Label`, `Popover`(`.Trigger`/`.Content`) + `PopoverGroup`/`usePopoverGroup`, `RowCenter`/`RowLeft`/`RowMain`/`RowRight`/`RowSlots`, `Tab`, `Tabs`, `TextField`, `Toast`, `Toggle`, `Tooltip`, `Heading`, `SupportingText`, `Flex`, `Grid`, `ListboxOption` + `colors`(re-export).

⚠️ **존재하지 않는 컴포넌트**: 모달은 `Dialog`, 셀렉트는 `Popover` + `ListboxOption` 조합, 스피너는 별도 컴포넌트 없이 `react-spinners` 라이브러리 사용. `Modal`/`Select`/`Spinner`라는 이름으로 import 금지.

## 핵심 Props (소스 그대로)

근거: 각 `.tsx` 파일의 인터페이스 정의 그대로 발췌.

```ts
// Button — variant 8종, size 3종 (실측: packages/allcll-ui/src/components/button/Button.tsx)
interface IButton extends ComponentPropsWithoutRef<'button'> {
  variant: 'primary' | 'secondary' | 'danger' | 'text' | 'contain' | 'outlined' | 'ghost' | 'circle';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;                               // ComponentPropsWithoutRef<'button'>에 이미 포함되나 명시
  textColor?: 'primary' | 'secondary' | 'gray';   // variant='text'에서 사용
  asChild?: boolean;                                // Radix Slot
}

// Heading — level 1~5, level이 size를 자동 매핑
interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  level: 1 | 2 | 3 | 4 | 5;
  size?: 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  as?: ElementType;
}

// Flex / Grid — Tailwind 토큰을 prop으로 노출
type FlexProps = ComponentPropsWithRef<'div'> & {
  as?: ElementType;
  direction?: 'flex-row' | 'flex-col' | 'flex-wrap' | 'flex-nowrap' | 'flex-grow';
  justify?: 'justify-start' | 'justify-center' | 'justify-end' | 'justify-between';
  align?: 'items-start' | 'items-center' | 'items-end' | 'items-stretch' | 'align-top' | 'items-baseline';
  gap?: `gap-${number}`;
};
interface GridProps extends ComponentPropsWithoutRef<'div'> {
  columns: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: `gap-${number}`;
}

// RowSlots — 좌/중/우 레이아웃. Toast/Banner/ListboxOption 내부에서 사용.
interface RowSlotsProps {
  left: React.ReactNode; center?: React.ReactNode; right: React.ReactNode;
  className?: string; withPadding?: boolean;
}

// Card — 합성: <Card><Card.Header /><Card.Content /></Card>
interface ICard {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'elevated' | 'outlined' | 'filled';
  className?: string;
}

// Badge / Chip
interface IBadge {
  variant: 'success' | 'warning' | 'danger' | 'default' | 'primary' | 'beta';
  appearance?: 'filled' | 'outline'; size?: 'default' | 'small'; children: React.ReactNode;
}
interface IChip extends ComponentPropsWithoutRef<'button'> {
  label: string | React.ReactElement;
  selected: boolean;
  variant?: 'select' | 'cancel' | 'none';
  isChipOpen?: boolean;
  containerRef?: RefObject<HTMLButtonElement | null>;
}

// Input / TextField — 단순은 Input, label/에러/clear 필요시 TextField
interface IInput extends ComponentPropsWithoutRef<'input'> {
  leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
}
interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  size: 'small' | 'medium' | 'large';
  onClear?: () => void;
}

// Dialog — HTML <dialog> + portal, ESC 자동 닫힘
interface IDialogMain {
  children: React.ReactNode;
  isOpen?: boolean;        // 기본 true
  title?: string;
  onClose: () => void;
}
// 합성: Dialog.Title / .Header / .Overlay / .Content / .Contents / .Footer

// 그 외
interface ICheckbox extends ComponentPropsWithRef<'input'> { label?: string; }
interface IIconButton extends ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode; label?: string; variant?: 'contain' | 'plain';
}
interface IToggle { checked: boolean; onChange: () => void; }
interface LabelProps extends ComponentPropsWithoutRef<'label'> { required?: boolean; }
interface IBanner { variant?: 'warning' | 'info'; children: React.ReactNode; deleteBanner: () => void; }
interface IToastMessage { message: string; tag?: string; }
interface ListboxOptionProps {
  selected: boolean; onSelect?: () => void;
  left: ReactNode; right?: ReactNode;       // right는 selected일 때만 노출
}
```

## simulation UI 격리 — 위젯별 사용처

근거: `widgets/simulation/**` 파일별 `grep "from '@allcll"` 결과 (실측).

`features/simulation`은 UI가 사실상 없고(`ui/VisitTutorialButton.tsx` 1개만 있고 plain `<button>` 사용) `model/lib`이 대부분 → UI 라이브러리 import 0건.

UI 결정은 **위젯 단위**로 다음 표를 따른다 (UI 라이브러리를 import하는 위젯 기준 — 차트나 plain HTML만 쓰는 위젯은 표에 없음):

| `@allcll/sejong-ui` (세종대 화면 흉내) | `@allcll/allcll-ui` (외곽 UI) |
|---|---|
| `widgets/simulation/modal/SimulationModal.tsx` | `widgets/simulation/modal/SimulationResultModal.tsx` |
| `widgets/simulation/modal/Processing.tsx` | `widgets/simulation/modal/before/TutorialModal.tsx` |
| `widgets/simulation/modal/WaitingModal.tsx` | `widgets/simulation/modal/before/UserWishModal.tsx` |
| `widgets/simulation/modal/CaptchaInput.tsx` | `widgets/simulation/modal/before/SubjectTable.tsx` |
| `widgets/simulation/table/RegisteredTable.tsx` | `widgets/simulation/modal/before/GameTips.tsx` |
| `widgets/simulation/table/NoneRegisteredTable.tsx` | `widgets/simulation/modal/before/SelectDepartment.tsx` |
| `widgets/simulation/SimulationSearchForm.tsx` | `widgets/simulation/modal/before/ActionButton.tsx` |
| `pages/simulation/*` (대시보드 등) | `widgets/simulation/modal/before/TimetableChip.tsx` |

판단 기준: **"이 UI가 실제 세종대 학사 시스템 화면처럼 보여야 하는가?"** → 예이면 `sejong-ui`, 아니면 `allcll-ui`.

## sejong-ui 사용

근거: `packages/sejong-ui/index.ts`.

```ts
import SejongUI from '@allcll/sejong-ui';
// 가용: SejongUI.Input, .Button, .Select, .Modal, .SectionHeader, .Tab, .AsideMenu, .DataTable
import type { ColumnDefinition } from '@allcll/sejong-ui';
import type { IMenu, ITab } from '@allcll/sejong-ui';
```

`SejongUI`는 default export된 객체. allcll-ui와 달리 named export가 아니다.

## 새 UI 만들기 전에 — 디자인 시스템 우선 사용

올클 프로젝트의 핵심 원칙: **새 UI 만들 때 먼저 `@allcll/allcll-ui` (또는 시뮬레이션이면 `@allcll/sejong-ui`) 카탈로그를 검토하고, 있으면 그걸 사용한다.** 디자인 시스템에 끼워맞춰서 구현하는 게 목표지, raw element + Tailwind 로 직접 만드는 게 목표가 아님.

근거: 디자인 시스템이 존재하는 이유는 *"같은 UI 가 두 번 만들어지지 않도록"*. 매번 raw `<button>` + Tailwind 로 만들면 결국 7가지 색의 버튼이 생기고 일관성이 무너짐.

### Use case 매핑 — "이 UI 만들고 싶다" → "이 컴포넌트 써라"

근거: `packages/allcll-ui/index.ts`, `packages/sejong-ui/index.ts` 의 실제 export (검증 완료).

| 만들고 싶은 것 | 우선 검토할 컴포넌트 | 라이브러리 |
|---|---|---|
| 클릭 가능한 버튼 | `Button` | allcll-ui |
| 아이콘 버튼 | `IconButton` | allcll-ui |
| 모달 / 다이얼로그 | `Dialog` | allcll-ui |
| 텍스트 입력 | `Input` 또는 `TextField` | allcll-ui |
| 셀렉트 / 드롭다운 | `Popover` + `ListboxOption` 합성 | allcll-ui |
| 카드 형태 컨테이너 | `Card` | allcll-ui |
| 제목 / 헤더 | `Heading` | allcll-ui |
| 보조 텍스트 | `SupportingText` | allcll-ui |
| 가로 정렬 컨테이너 | `Flex` 또는 `RowSlots`/`RowLeft`/`RowRight`/`RowCenter`/`RowMain` | allcll-ui |
| 그리드 레이아웃 | `Grid` | allcll-ui |
| 탭 (단일 탭 컴포넌트) | `Tab` | allcll-ui |
| 탭 (탭 그룹) | `Tabs` | allcll-ui |
| 토글 스위치 | `Toggle` | allcll-ui |
| 체크박스 | `Checkbox` | allcll-ui |
| 토스트 / 알림 | `Toast` | allcll-ui |
| 툴팁 | `Tooltip` | allcll-ui |
| 라벨 | `Label` | allcll-ui |
| 배지 / 칩 | `Badge`, `Chip` | allcll-ui |
| 배너 | `Banner` | allcll-ui |
| 표 (시뮬레이션 화면) | `SejongUI.DataTable` | sejong-ui |
| 시뮬레이션 사이드 메뉴 | `SejongUI.AsideMenu` | sejong-ui |
| 시뮬레이션 탭 | `SejongUI.Tab` | sejong-ui |
| 시뮬레이션 모달 | `SejongUI.Modal` | sejong-ui |
| 시뮬레이션 셀렉트 | `SejongUI.Select` | sejong-ui |
| 시뮬레이션 섹션 헤더 | `SejongUI.SectionHeader` | sejong-ui |

**카탈로그에 *없는* 것 (자체 구현 또는 외부 라이브러리)**:
- 로딩 스피너 → `react-spinners` 외부 라이브러리 (allcll-ui 에 자체 Spinner 없음)
- TextArea (멀티라인 텍스트 입력) → 카탈로그에 없음, raw `<textarea>` + Tailwind 또는 디자인 시스템 추가 PR 검토
- 일반 표 (데이터 그리드 아님) → `Card` + `RowSlots` 합성 또는 raw `<table>`

**중요한 점**: 위 표는 *"이걸 우선 검토하라"* 의 가이드입니다. 검토 결과 적합하지 않으면 raw element 사용도 가능 — 다만 *왜* 적합하지 않은지 사용 시점에 짧게라도 의식해야 합니다.

### 결정 기준 — 디자인 시스템 컴포넌트 vs raw element

새 UI 코드 작성 시 다음 순서로 검토:

**1단계 — 카탈로그에 있는가?** 위 매핑 표 또는 본 문서의 `allcll-ui 공개 컴포넌트 23종` 섹션 확인.

**2단계 — 있다면, 그 컴포넌트로 만족 가능한가?**
- ✅ 만족 → 그 컴포넌트 사용. 끝.
- ⚠️ 부족 → 다음 옵션 검토:
  - `className` prop 으로 Tailwind 추가하면 해결되는가? (가장 흔한 경우)
  - variant prop 이 부족한가? → 디자인 시스템 측 별도 PR 로 variant 추가 검토
  - 합성으로 해결되는가? (`Card` + `RowSlots` + `Heading` 등의 조합으로 90% 해결됨)

**3단계 — 카탈로그에 없거나 부족하면**: 두 가지 방향
- (A) **단발성 화면 전용** → `client/src/<레이어>/<슬라이스>/ui/`에 일반 컴포넌트로 작성. `className` prop 받기. 다른 곳에서 재사용 안 함.
- (B) **재사용 가능성 있음** → 디자인 시스템 측 별도 PR 로 추가 검토. client 작업 중에 끼워넣지 말 것 (절대 규칙 #3).

**4단계 — raw element (`<button>`, `<input>` 등) 직접 사용**: 다음 경우 외에는 피함.
- 시뮬레이션 외곽의 plain UI (예: `VisitTutorialButton` — 의도적으로 plain `<button>`)
- 카탈로그 컴포넌트가 도저히 안 맞는 특수 케이스

> 현재 코드베이스 실측: `<Button>` 78 vs raw `<button>` 27 사용. 약 25%가 raw button 인데 이 중 일부는 의도된 예외, 일부는 디자인 시스템 검토를 빠뜨린 케이스. **새 코드는 검토 단계를 거치도록.**

### allcll-ui 소스 수정 절대 금지

`packages/allcll-ui/src/**` 파일은 client 작업 중 절대 변경 금지. 스타일이 부족하면 `className` prop 으로 Tailwind 유틸리티 추가, 또는 client 슬라이스에서 자체 컴포넌트로 감싸기. 디자인 시스템 자체 변경이 정말 필요하면 별도 PR/리뷰 (절대 규칙 #3).
