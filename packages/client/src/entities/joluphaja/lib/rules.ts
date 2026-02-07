import type { CategoryType, CategoryProgress, PolicyYear, GraduationCheckData, ScopeType, UserInfo } from '../api/graduation';

/** 학번으로 정책 연도 판별 */
export function getPolicyYear(studentId: string): PolicyYear {
  const yearPrefix = parseInt(studentId.substring(0, 2), 10);

  if (yearPrefix >= 23) {
    return 'from23';
  } else if (yearPrefix >= 22) {
    return 'from22';
  }
  return 'before22';
}

/** 학번 정책에 따른 교양 카테고리 타입 목록 */
export function getGeneralCategoryTypes(policyYear: PolicyYear): CategoryType[] {
  switch (policyYear) {
    case 'before22':
      return ['GENERAL_ELECTIVE', 'BALANCE_REQUIRED', 'ACADEMIC_BASIC'];
    case 'from22':
    case 'from23':
      return ['COMMON_REQUIRED', 'ACADEMIC_BASIC', 'BALANCE_REQUIRED'];
    default:
      return ['COMMON_REQUIRED', 'ACADEMIC_BASIC', 'BALANCE_REQUIRED'];
  }
}

/** 전공 카테고리 타입 목록 */
export const MAJOR_CATEGORY_TYPES: CategoryType[] = ['MAJOR_REQUIRED', 'MAJOR_ELECTIVE'];

/** 카테고리 목록에서 특정 타입 찾기 */
export function findCategory(categories: CategoryProgress[], categoryType: CategoryType): CategoryProgress | undefined {
  return categories.find(cat => cat.categoryType === categoryType);
}

/** 카테고리 목록에서 여러 타입 필터링 */
export function filterCategories(categories: CategoryProgress[], categoryTypes: CategoryType[]): CategoryProgress[] {
  return categories.filter(cat => categoryTypes.includes(cat.categoryType));
}

/** 전공 이수 통과 여부 계산 */
export function isMajorSatisfied(categories: CategoryProgress[]): boolean {
  const majorCategories = filterCategories(categories, MAJOR_CATEGORY_TYPES);
  return majorCategories.every(cat => cat.satisfied);
}

/** 교양 이수 통과 여부 계산 (학번 정책 반영) */
export function isGeneralSatisfied(categories: CategoryProgress[], studentId: string): boolean {
  const policyYear = getPolicyYear(studentId);
  const generalCategoryTypes = getGeneralCategoryTypes(policyYear);
  const generalCategories = filterCategories(categories, generalCategoryTypes);
  return generalCategories.every(cat => cat.satisfied);
}

/** 진행률 계산 (퍼센트) */
export function calculateProgress(earned: number, required: number): number {
  if (required === 0) return 100;
  return Math.round((earned / required) * 100);
}

/** 전체 진행률 계산 */
export function calculateOverallProgress(data: GraduationCheckData): number {
  const { totalCredits, requiredTotalCredits } = data.summary;
  return calculateProgress(totalCredits, requiredTotalCredits);
}

/** 전공 타입에 따른 스코프 목록 반환 */
export function getScopeTypes(majorType: UserInfo['majorType']): ScopeType[] {
  switch (majorType) {
    case 'SINGLE':
      return ['PRIMARY'];
    case 'DOUBLE':
      return ['PRIMARY', 'DOUBLE'];
    case 'MINOR':
      return ['PRIMARY', 'MINOR'];
    default:
      return ['PRIMARY'];
  }
}

/** 특정 스코프와 카테고리 타입에 해당하는 카테고리 필터링 */
export function filterCategoriesByScope(
  categories: CategoryProgress[],
  scope: ScopeType,
  categoryTypes: CategoryType[],
): CategoryProgress[] {
  return categories.filter(cat => cat.scope === scope && categoryTypes.includes(cat.categoryType));
}
