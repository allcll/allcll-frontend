import useToastNotification from '@/features/notification/model/useToastNotification.ts';
import { ApiError } from '@/shared/lib/errors.ts';

interface TimetableApiErrorResponse {
  success?: boolean;
  message?: string;
  errorCode?: string;
}

interface ShowTimetableApiErrorToastOptions {
  fallbackMessage: string;
  tag: string;
}

interface ShowTimetableApiSuccessToastOptions {
  message: string;
  tag: string;
}

export function showTimetableApiErrorToast(error: unknown, options: ShowTimetableApiErrorToastOptions) {
  const { fallbackMessage, tag } = options;
  const message = getTimetableApiErrorMessage(error) ?? fallbackMessage;

  useToastNotification.getState().addToast(message, tag);
}

export function showTimetableApiSuccessToast(options: ShowTimetableApiSuccessToastOptions) {
  const { message, tag } = options;

  useToastNotification.getState().addToast(message, tag);
}

function getTimetableApiErrorMessage(error: unknown) {
  if (error instanceof TypeError) {
    return '네트워크 상태를 확인 후 다시 시도해주세요.';
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  // fetchOnAPI 를 직접 쓰는 곳은 아직 응답 본문을 그대로 던집니다.
  if (!(error instanceof Error)) return null;

  const parsed = parseApiErrorResponse(error.message);
  return parsed?.message ?? null;
}

function parseApiErrorResponse(message: string): TimetableApiErrorResponse | null {
  try {
    const parsed = JSON.parse(message) as TimetableApiErrorResponse;

    if (typeof parsed.message === 'string' && parsed.message.length > 0) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}
