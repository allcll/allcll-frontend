import type { FeedbackCategory } from '@/features/feedback/api/feedbackApi';

interface ISelectableFeedbackCategory {
  category: FeedbackCategory;
  label: string;
  path: string;
}

/**
 * 사용자가 피드백 모달에서 직접 고를 수 있는 서비스 카테고리
 * 선택하지 않으면 ALL로 제출합니다.
 */
export const SELECTABLE_FEEDBACK_CATEGORIES: ISelectableFeedbackCategory[] = [
  { category: 'TIMETABLE', label: '시간표', path: '/timetable' },
  { category: 'BASKETS', label: '관심과목', path: '/wishes' },
  { category: 'LIVE', label: '실시간', path: '/live' },
  { category: 'SIMULATION', label: '수강신청', path: '/simulation' },
  { category: 'GRADUATION', label: '졸업요건', path: '/graduation' },
];

export function getFeedbackCategoryByPath(pathname: string): FeedbackCategory {
  const matched = SELECTABLE_FEEDBACK_CATEGORIES.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return matched?.category ?? 'ALL';
}
