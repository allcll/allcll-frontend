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
