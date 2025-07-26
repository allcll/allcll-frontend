const BaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchOnAPI(url: string, options?: RequestInit): Promise<Response> {
  return await fetch(BaseUrl + url, {
    credentials: 'include',
    ...options,
  });
}

export async function fetchJsonOnAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(BaseUrl + url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

export async function fetchDeleteJsonOnAPI<T>(
  url: string,
  body?: any,
  options?: Omit<RequestInit, 'method' | 'body'>,
): Promise<T | null> {
  const response = await fetch(BaseUrl + url, {
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
    throw new Error(await response.text());
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export function fetchEventSource(url: string, options?: EventSourceInit): EventSource {
  return new EventSource(BaseUrl + url, {
    withCredentials: true,
    ...options,
  });
}

export async function fetchJsonOnPublic<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}
