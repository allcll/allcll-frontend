import useToastNotification from '@/features/notification/model/useToastNotification.ts';

interface TimetableApiErrorResponse {
  success?: boolean;
  message?: string;
  errorCode?: string;
}

interface ShowTimetableApiErrorToastOptions {
  fallbackMessage: string;
  tag: string;
}

export function showTimetableApiErrorToast(error: unknown, options: ShowTimetableApiErrorToastOptions) {
  const { fallbackMessage, tag } = options;
  const message = getTimetableApiErrorMessage(error) ?? fallbackMessage;

  useToastNotification.getState().addToast(message, tag);
}

function getTimetableApiErrorMessage(error: unknown) {
  if (error instanceof TypeError) {
    return '네트워크 상태를 확인 후 다시 시도해주세요.';
  }

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
