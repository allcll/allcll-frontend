import { FeedbackCategory } from '@/features/feedback/api/feedbackApi';
import { FeedbackOpenMode } from './FeedbackTrigger';

export interface FeedbackTitles {
  title: string;
  radioTitle: string;
  textareaTitle: string;
  textareaPlaceholder: string;
  // 평점 1, 2, 3 순서의 라벨
  rateLabels: [string, string, string];
  /**
   * 자동 노출 시 모바일에서 먼저 띄우는 예고 바 문구,
   * 값이 없으면 예고 바 없이 곧바로 바텀시트를 표시합니다.
   */
  peekMessage?: string;
}

function useFeedbackTitle(category: FeedbackCategory, openMode: FeedbackOpenMode): FeedbackTitles {
  if (category === 'GRADUATION') {
    return {
      title: openMode === 'auto' ? '졸업요건 검사 피드백' : '오류 제보',
      radioTitle: '결과가 정확했나요?',
      textareaTitle: openMode === 'auto' ? '추가 의견을 남겨주세요 (선택)' : '어떤 부분에서 오류가 발생했나요?',
      textareaPlaceholder:
        '복수전공, 교환학생, 재수강, 인정과목 등에서 오류가 발생했을 시, 오류 내용을 작성해주시면 서비스에 큰 도움이 됩니다.',
      rateLabels: ['많이 달라요', '조금 달라요', '정확해요'],
      peekMessage: '졸업요건 분석 결과, 어떠셨나요?',
    };
  }

  return {
    title: '의견 보내기',
    radioTitle: '올클을 사용하시면서 어떠셨나요?',
    textareaTitle: '더 하고 싶은 말이 있다면 (선택)',
    textareaPlaceholder: '불편했던 점이나 필요한 기능을 자유롭게 적어주세요',
    rateLabels: ['아쉬워요', '괜찮아요', '좋아요'],
  };
}

export default useFeedbackTitle;
