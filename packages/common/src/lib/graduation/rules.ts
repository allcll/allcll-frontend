import type { CategoryProgress, CategoryType, GraduationCheckData, ScopeType } from '../../types/graduation';

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
