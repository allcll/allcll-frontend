export const INTERACTION = {
  pressable: 'transition-colors duration-300 ease-out active:scale-[0.97]',
  hoverable: 'transition-colors duration-200 ease-out',
  subtle: 'transition-all duration-150 ease-out',
} as const;

/**
 * 입력 필드(Input, TextField, Select, SearchableSelect 등) 공통 박스 스타일
 */
export const FIELD_BOX_CLASS =
  'rounded-md bg-white border border-gray-300 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400';

/** 입력 필드 기본 글자 크기 */
export const FIELD_TEXT_CLASS = 'text-base sm:text-sm';

/** 입력 필드 공통 스타일 (박스 + 기본 글자 크기) */
export const FIELD_CLASS = `${FIELD_BOX_CLASS} ${FIELD_TEXT_CLASS}`;
