import { FeedbackOpenMode } from "./FeedbackTrigger";

export interface FeedbackTitles {
    title: string;
    radioTitle: string;
    textareaTitle: string;
    textareaPlaceholder: string;
}

function useFeedbackTitle(openMode: FeedbackOpenMode) {
    if (openMode === 'auto') {
        return {
            title: '졸업요건 검사 피드백',
            radioTitle: '결과가 정확했나요?',
            textareaTitle: '추가 의견을 남겨주세요 (선택)',
            textareaPlaceholder: '복수전공, 교환학생, 재수강, 인정과목 등에서 오류가 발생했을 시, 오류 내용을 작성해주시면 서비스에 큰 도움이 됩니다."',
        };
    }

    return {
        title: '오류 제보',
        radioTitle: '결과가 정확했나요?',
        textareaTitle: '어떤 부분에서 오류가 발생했나요?',
        textareaPlaceholder: '복수전공, 교환학생, 재수강, 인정과목 등에서 오류가 발생했을 시, 오류 내용을 작성해주시면 서비스에 큰 도움이 됩니다."',
    };
}

export default useFeedbackTitle;