import type { CategoryType, ClassicDomainType, ScopeType } from '@/entities/joluphaja/api/graduation';

/** 카테고리 타입 → 한글 라벨 매핑 */
export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  COMMON_REQUIRED: '공통교양',
  BALANCE_REQUIRED: '균형교양',
  ACADEMIC_BASIC: '학문기초',
  GENERAL_ELECTIVE: '교양선택',
  MAJOR_REQUIRED: '전공필수',
  MAJOR_ELECTIVE: '전공선택',
  MAJOR_BASIC: '전공기초',
  TOTAL_COMPLETION: '총이수학점',
};

/** 고전독서 도메인 → 한글 라벨 매핑 */
export const CLASSIC_DOMAIN_LABELS: Record<ClassicDomainType, string> = {
  WESTERN_HISTORY_THOUGHT: '서양의역사와사상',
  EASTERN_HISTORY_THOUGHT: '동양의역사와사상',
  EAST_WEST_LITERATURE: '동·서양의 문학',
  SCIENCE_THOUGHT: '과학 사상',
};

/** 스코프 타입 → 한글 라벨 매핑 */
export const SCOPE_TYPE_LABELS: Record<ScopeType, string> = {
  PRIMARY: '주전공',
  SECONDARY: '복수전공',
  MINOR: '부전공',
};

/** 이수 상태 라벨 */
export function getStatusLabel(satisfied: boolean): string {
  return satisfied ? '이수완료' : '미이수';
}

/** 이수 상태 뱃지 variant */
export function getStatusBadgeVariant(satisfied: boolean): 'success' | 'danger' {
  return satisfied ? 'success' : 'danger';
}
