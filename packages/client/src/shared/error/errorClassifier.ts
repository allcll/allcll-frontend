import { ApiError, NetworkError } from '@/shared/error/errors';

export enum ErrorType {
  Page = 'page',
  /** 사용자가 선택/결정해야 하는 에러 → Modal */
  Action = 'action',
  /** 알려주기만 하면 되는 에러 → Toast */
  Feedback = 'feedback',
  /** 사용자에게 보여줄 필요 없는 에러 → Sentry only */
  Silent = 'silent',
}

const PAGE_STATUS = new Set([401, 403, 404, 500, 502, 503]);

export function classifyError(error: unknown): ErrorType {
  if (error instanceof ApiError) {
    if (PAGE_STATUS.has(error.status)) return ErrorType.Page;
    if (error.status >= 400 && error.status < 500) return ErrorType.Action;
    return ErrorType.Page;
  }

  if (error instanceof NetworkError) return ErrorType.Action;

  // JS runtime error — Component ErrorBoundary가 처리
  return ErrorType.Silent;
}
