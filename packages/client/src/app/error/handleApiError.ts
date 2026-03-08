import * as Sentry from '@sentry/react';
import { classifyError, ErrorType } from '@/shared/error/errorClassifier';
import { ApiError, NetworkError } from '@/shared/error/errors';
import useToastNotification from '@/features/notification/model/useToastNotification';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof NetworkError) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다';
}

/**
 *  * 모든 API 에러의 단일 진입점
 *
 * page     → throw (Route ErrorBoundary로 전파)
 * action   → Modal (추후 useErrorModal 연결)
 * feedback → Toast
 * silent   → Sentry only
 * @param error
 */
export function handleApiError(error: unknown): void {
  const type = classifyError(error);

  Sentry.captureException(error, {
    extra: {
      errorType: type,
      url: window.location.href,
    },
  });

  switch (type) {
    case ErrorType.Page:
      throw error;

    case ErrorType.Action:
      // TODO: Layer 6 구현 후 useErrorModal.getState().open() 으로 교체
      useToastNotification.getState().addToast(getErrorMessage(error));
      break;

    case ErrorType.Feedback:
      useToastNotification.getState().addToast(getErrorMessage(error));
      break;

    case ErrorType.Silent:
      break;
  }
}
