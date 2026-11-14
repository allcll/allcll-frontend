export const INTERACTION = {
  pressable: 'transition-colors duration-300 ease-out not-disabled:active:scale-[0.97]',
  hoverable: 'transition-colors duration-200 ease-out',
  subtle: 'transition-all duration-150 ease-out',
} as const;

/**
 * 입력 필드(Input, TextField, Select, SearchableSelect 등) 공통 박스 스타일
 */
export const FIELD_BOX_CLASS =
  'rounded-md bg-surface border border-line-strong py-2 placeholder:text-fg-subtle focus:outline-none focus:border-primary-500 disabled:bg-surface-muted disabled:text-fg-subtle';

/** 입력 필드 기본 글자 크기 (iOS가 16px 미만 입력칸을 누르면 확대하므로 좁은 터치 기기에서만 16px) */
export const FIELD_TEXT_CLASS = 'text-sm max-sm:pointer-coarse:text-base';

/** 입력 필드 공통 스타일 (박스 + 기본 글자 크기) */
export const FIELD_CLASS = `${FIELD_BOX_CLASS} ${FIELD_TEXT_CLASS}`;

// 스크롤 잠금 중 오른쪽 fixed 요소가 밀리지 않도록 react-remove-scroll-bar 클래스 사용
export const SCROLLBAR_GAP_CLASS = 'width-before-scroll-bar';
