const BaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchOnAPI(url: string, options?: RequestInit): Promise<Response> {
  return await fetch(BaseUrl + url, {
    credentials: 'include',
    ...options,
  });
}

// Todo: url: string, method?: string, body?: object, options?: RequestInit 형태로 변경 고려
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
