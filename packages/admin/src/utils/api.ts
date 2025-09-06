const BaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchOnAPI(url: string, options?: RequestInit): Promise<Response> {
  const AdminToken = localStorage.getItem('session');

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
  const AdminToken = localStorage.getItem('session');

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
