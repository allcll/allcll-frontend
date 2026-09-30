import type { FeedbackCategory } from '@/features/feedback/api/feedbackApi';

interface ISelectableFeedbackCategory {
  category: FeedbackCategory;
  label: string;
  path: string;
}

export const SELECTABLE_FEEDBACK_CATEGORIES: ISelectableFeedbackCategory[] = [
  { category: 'TIMETABLE', label: '시간표', path: '/timetable' },
  { category: 'BASKETS', label: '관심과목', path: '/wishes' },
  { category: 'SIMULATION', label: '올클연습', path: '/simulation' },
  { category: 'LIVE', label: '실시간여석', path: '/live' },
  { category: 'GRADUATION', label: '졸업요건', path: '/graduation' },
];

export function getFeedbackCategoryByPath(pathname: string): FeedbackCategory {
  const matched = SELECTABLE_FEEDBACK_CATEGORIES.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return matched?.category ?? 'ALL';
}

// TODO: 백엔드에서 졸업요건 후기를 비로그인으로도 받을 수 있게 되면 제거
const AUTH_REQUIRED_FEEDBACK_CATEGORIES: FeedbackCategory[] = ['GRADUATION'];

// 인증이 필요한 카테고리는 비로그인 제출 시 오류가 발생하므로 공통 카테고리로 묶어서 제출
export function toPublicFeedbackCategory(category: FeedbackCategory): FeedbackCategory {
  return AUTH_REQUIRED_FEEDBACK_CATEGORIES.includes(category) ? 'ALL' : category;
}
