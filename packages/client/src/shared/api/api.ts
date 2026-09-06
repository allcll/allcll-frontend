import { ApiError } from '@/shared/lib/errors.ts';
import { ApiException } from '@/shared/model/types.ts';

const BaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const Base = (import.meta.env.VITE_BASE ?? '').replace(/\/$/, '');

/** 실패 응답을 ApiError 로 바꿔 던집니다. */
export async function throwApiError(response: Response): Promise<never> {
  const body = await response.text();

  let parsed: ApiException | null = null;
  try {
    parsed = JSON.parse(body) as ApiException;
  } catch {
    // 서버 앞단이 HTML 을 내려주는 경우가 있어 조용히 넘깁니다.
  }

  // HTTP/2 는 statusText 가 항상 비어 있어서 마지막 기본값이 필요합니다.
  const message = parsed?.message || response.statusText || `요청에 실패했습니다 (${response.status})`;

  throw new ApiError(response.status, parsed?.code ?? '', message);
}

export async function fetchOnAPI(url: string, options?: RequestInit): Promise<Response> {
  return await fetch(BaseUrl + Base + url, {
    credentials: 'include',
    ...options,
  });
}

export async function fetchJsonOnAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(BaseUrl + Base + url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return await response.json();
}

export async function fetchDeleteJsonOnAPI<T>(
  url: string,
  body?: unknown,
  options?: Omit<RequestInit, 'method' | 'body'>,
): Promise<T | null> {
  const response = await fetch(BaseUrl + Base + url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export function fetchEventSource(url: string, options?: EventSourceInit): EventSource {
  return new EventSource(BaseUrl + Base + url, {
    withCredentials: true,
    ...options,
  });
}

export async function fetchJsonOnPublic<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(Base + url, {
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return await response.json();
}

export async function fetchTextOnPublic(url: string, options?: RequestInit): Promise<string> {
  const response = await fetch(Base + url, options);

  if (!response.ok) {
    await throwApiError(response);
  }

  return await response.text();
}
