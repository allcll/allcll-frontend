import { fetchJsonOnAPI, fetchOnAPI, fetchDeleteJsonOnAPI } from '@/shared/api/api.ts';
import { LoginRequest, PatchMeRequest, UserResponse } from '@/entities/user/model/types.ts';

//TODO: features로 폴더 이동 고려
export const postLogin = async ({ studentId, password }: LoginRequest): Promise<void> => {
  const response = await fetchOnAPI('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, password }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

export const postLogout = async (): Promise<void> => {
  const response = await fetchOnAPI('/api/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

export const getMe = async (): Promise<UserResponse> => {
  return fetchJsonOnAPI<UserResponse>('/api/auth/me');
};

export const patchMe = async (body: PatchMeRequest): Promise<void> => {
  const response = await fetchOnAPI('/api/auth/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

export const deleteMe = async (): Promise<void> => {
  await fetchDeleteJsonOnAPI('/api/auth/me');
};
