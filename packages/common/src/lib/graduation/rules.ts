import type {
  CategoryProgress,
  CategoryType,
  CriteriaCategory,
  GraduationCheckData,
  MissingCourse,
  ScopeType,
} from '../../types/graduation';

export const MAJOR_CATEGORY_TYPES: CategoryType[] = ['MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'MAJOR_BASIC'];

export const GENERAL_CATEGORY_TYPES: CategoryType[] = [
  'COMMON_REQUIRED',
  'BALANCE_REQUIRED',
  'ACADEMIC_BASIC',
  'GENERAL_ELECTIVE',
];

export const COURSE_CATEGORY_ORDER: CategoryType[] = [
  'MAJOR_REQUIRED',
  'MAJOR_ELECTIVE',
  'MAJOR_BASIC',
  'COMMON_REQUIRED',
  'BALANCE_REQUIRED',
  'ACADEMIC_BASIC',
  'GENERAL_ELECTIVE',
  'GENERAL',
  'TOTAL_COMPLETION',
];

export function findCategory(categories: CategoryProgress[], categoryType: CategoryType): CategoryProgress | undefined {
  return categories.find(cat => cat.categoryType === categoryType);
}

export function filterCategories(categories: CategoryProgress[], categoryTypes: CategoryType[]): CategoryProgress[] {
  return categories.filter(cat => categoryTypes.includes(cat.categoryType));
}

export function isMajorSatisfied(categories: CategoryProgress[]): boolean {
  const majorCategories = filterCategories(categories, MAJOR_CATEGORY_TYPES);
  return majorCategories.every(cat => cat.satisfied);
}

export function isGeneralSatisfied(categories: CategoryProgress[]): boolean {
  const generalCategories = filterCategories(categories, GENERAL_CATEGORY_TYPES);
  return generalCategories.every(cat => cat.satisfied);
}

export function calculateProgress(earned: number, required: number): number {
  if (required === 0) return 100;
  return Math.round((earned / required) * 100);
}

export function calculateOverallProgress(data: GraduationCheckData): number {
  const { totalMyCredits, requiredTotalCredits } = data.summary;
  return calculateProgress(totalMyCredits, requiredTotalCredits);
}

export function getScopeTypes(majorType: 'SINGLE' | 'DOUBLE' | 'MINOR'): ScopeType[] {
  switch (majorType) {
    case 'SINGLE':
      return ['PRIMARY'];
    case 'DOUBLE':
      return ['PRIMARY', 'SECONDARY'];
    case 'MINOR':
      return ['PRIMARY', 'MINOR'];
    default:
      return ['PRIMARY'];
  }
}

export function filterCategoriesByScope(
  categories: CategoryProgress[],
  scope: ScopeType,
  categoryTypes: CategoryType[],
): CategoryProgress[] {
  return categories.filter(cat => cat.majorScope === scope && categoryTypes.includes(cat.categoryType));
}

/**
 * 카테고리가 무엇을 기준으로 충족을 따지는지.
 *
 * - NONE        요건 자체가 없다. 시트에서 사용 여부가 꺼진 경우 (교양선택 면제 학과, 학문기초 0학점 학과 등)
 * - AREA        영역 수로 따진다 (균형교양)
 * - COURSE_ONLY 필요 학점이 없고 지정 과목 이수만 따진다 (교양선택 필수학점 폐지 이후)
 * - UNKNOWN     필요 학점이 0 인데 기준 정보가 아직 없다. 단정하지 않고 이수 학점만 보여준다
 * - CREDIT      학점으로 따진다 (기본)
 *
 * 카테고리 이름이 아니라 서버가 내려주는 값으로 판별한다. 특정 카테고리를 하드코딩하면
 * 같은 상태가 다른 카테고리에 생겼을 때 또 분기를 추가해야 한다.
 */
export type CategoryRequirementMode = 'NONE' | 'AREA' | 'COURSE_ONLY' | 'UNKNOWN' | 'CREDIT';

export function resolveCategoryRequirementMode(
  category: CategoryProgress,
  criteriaCategory?: CriteriaCategory,
): CategoryRequirementMode {
  if (criteriaCategory && !criteriaCategory.isEnabled) return 'NONE';
  if (category.categoryType === 'BALANCE_REQUIRED' && category.requiredAreasCnt != null) return 'AREA';
  if (category.requiredCredits === 0) return criteriaCategory ? 'COURSE_ONLY' : 'UNKNOWN';
  return 'CREDIT';
}

/**
 * 아직 이수하지 않은 지정 과목. 서버가 이미 미이수만 걸러서 내려준다.
 *
 * 지정 과목 전체 개수는 응답에 없어서 "3개 중 2개" 형태로는 표시할 수 없다.
 * 서버가 전체 개수를 내려주면 이 함수 옆에 완료 개수를 더해 비율 표시로 넓힐 수 있다.
 */
export function getMissingRequiredCourses(criteriaCategory?: CriteriaCategory): MissingCourse[] {
  return criteriaCategory?.requiredCourses ?? [];
}
