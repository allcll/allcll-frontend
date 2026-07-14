/**
 * z-index 단일 관리 지점 (single source of truth)
 *
 * 앱 전역의 쌓임 순서(stacking order)를 이 스케일 하나로 관리합니다.
 * colors 토큰과 동일하게 디자인 시스템(allcll-ui)에 두고 각 패키지가 공유합니다.
 *
 * - Tailwind 클래스로 쓸 때: `z-content`, `z-modal` 처럼 `z-<key>` 사용
 *   (각 패키지 tailwind.config.ts 의 theme.extend.zIndex 에 주입됩니다)
 * - inline style 이 불가피할 때: `style={{ zIndex: Z_INDEX.floating }}` 처럼 값 참조
 *
 * 새 레이어가 필요하면 반드시 여기에 추가한 뒤 사용하세요.
 * 컴포넌트에 z-[123] 같은 매직 넘버를 직접 선언하지 않습니다.
 */
export const Z_INDEX = {
  /** 기본 흐름 위로 살짝 띄우는 콘텐츠: sticky 테이블 헤더, 툴팁, 그라데이션 마스크, 사이드바, 그리드, 흐름 내 드롭다운 목록 */
  content: 10,
  /** 인라인 로딩 스피너 오버레이 */
  loading: 12,
  /** 강조되는 흐름 내 콘텐츠: 메인 배너, 활성/hover 된 시간표 셀 */
  elevated: 20,
  /** 메뉴·드로어 뒤를 덮는 전체 화면 딤 배경(backdrop) */
  overlay: 40,
  /** 상단 고정 헤더 */
  header: 50,
  /** 페이지 위에 떠 있는 UI: 드롭다운 패널, 드로어 본체, FAB, 피드백 버튼, 드래그 중 항목 */
  floating: 50,
  /** 앱 자체 중앙 모달 (예: 시뮬레이션 모달) */
  modal: 100,
  /** 트리거에 앵커된 팝오버 (모달 위, 바텀 시트 아래) */
  popover: 120,
  /** 바텀 시트 / 전체 화면 상세 모달 */
  bottomSheet: 200,
  /** 디자인 시스템 Dialog 컴포넌트 (최상위 모달, 바텀 시트 위) */
  dialog: 300,
  /** 토스트 알림 (최상단) */
  toast: 400,
} as const;

export type ZIndexLayer = keyof typeof Z_INDEX;
