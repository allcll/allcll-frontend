import { disassemble } from 'es-hangul';

export function getNormalizedKeyword(keyword: string) {
  const clean = keyword.replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  return disassemble(clean).toLowerCase();
}

export function matchOptionKeyword(option: { label: string }, query: string) {
  return getNormalizedKeyword(option.label).includes(getNormalizedKeyword(query));
}
