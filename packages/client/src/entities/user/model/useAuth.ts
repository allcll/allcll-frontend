import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMe, getMe, updateMe, postLogin, postLogout } from '@/entities/user/api/user.ts';
import { LoginRequest, UpdateMeRequest } from './types';

const AUTH_QUERY_KEY = ['auth', 'me'];

/**
 * GET /api/auth/me
 * 사용자 정보 조회 훅입니다.
 * @returns
 */
export function useMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMe,
    retry: false,
  });
}

/**
 * POST /api/auth/login
 * 졸업 요건 검사 로그인 훅입니다.
 * @returns
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => postLogin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    //TODO: onError 전역 핸들링 도입 시 리팩토링 필요 현재는 사용처에서 유연하게 처리
  });
}

/**
 * POST /api/auth/logout
 * 로그아웃 훅입니다.
 * @returns
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

/**
 *PATCH /api/auth/me
 로그인한 사용자의 프로필 정보를 수정하는 훅입니다.
 전과 및 복수전공일 경우에 요청하는 API이므로, 해당 필드들을 참고해주세요.
  * @param data
 * @returns
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMeRequest) => updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}

/**
 *  DELETE /api/auth/me
 * 회원 탈퇴(계정 삭제/비활성화) + ALLCLL 세션 무효화 훅입니다.
 * @returns
 */
export function useDeleteMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}
