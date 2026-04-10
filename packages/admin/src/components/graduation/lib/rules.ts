import type { CategoryType } from '@/hooks/server/graduation/useAdminGraduationView';

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
  'TOTAL_COMPLETION',
  'GENERAL',
];
