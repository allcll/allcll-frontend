import { disassemble } from 'es-hangul';

/**
 * 한글 자모 분리 및 소문자 변환을 포함한 정규화된 키워드를 반환합니다.
 */
export function getNormalizedKeyword(keyword: string) {
  if (!keyword) return '';
  const clean = keyword.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  return disassemble(clean).toLowerCase();
}

/**
 * 공백을 제거하고 소문자로 변환합니다.
 */
export function normalize(text: string) {
  if (!text) return '';
  return text.replace(/\s+/g, '').toLowerCase();
}
