const BaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const AdminToken = import.meta.env.VITE_ADMIN_TOKEN;

export async function fetchOnAPI(url: string, options?: RequestInit): Promise<Response> {
  return await fetch(BaseUrl + url, {
    credentials: 'include',
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      'X-ADMIN-TOKEN': AdminToken ?? '',
    },
  });
}

export async function fetchJsonOnAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(BaseUrl + url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
      'X-ADMIN-TOKEN': AdminToken ?? '',
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
      'X-ADMIN-TOKEN': AdminToken ?? '',
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
