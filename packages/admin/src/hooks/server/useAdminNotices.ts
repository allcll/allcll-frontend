import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastNotification } from '@allcll/common';
import { fetchJsonOnAPI, fetchDeleteJsonOnAPI } from '@/utils/api';
import { OperationType, OPERATION_TYPE_LABEL, OPERATION_TYPES } from '@/hooks/server/useAdminReviews';

export const CATEGORY_LABELS = OPERATION_TYPE_LABEL;
export const NOTICE_CATEGORIES = OPERATION_TYPES;

export interface Notice {
  id: number;
  title: string;
  content: string;
  operationType: OperationType;
  createdAt: string;
  updatedAt: string;
}

interface NoticesResponse {
  notices: Notice[];
}

const NOTICES_QUERY_KEY = ['admin', 'notices'];

// GET /api/admin/notices
export function useAdminNotices() {
  return useQuery<NoticesResponse, Error, Notice[]>({
    queryKey: NOTICES_QUERY_KEY,
    queryFn: () => fetchJsonOnAPI<NoticesResponse>('/api/admin/notices'),
    select: data => data.notices,
  });
}

// 목록 캐시에서 단건 조회
export function useAdminNotice(id: number | undefined) {
  return useQuery<NoticesResponse, Error, Notice | undefined>({
    queryKey: NOTICES_QUERY_KEY,
    queryFn: () => fetchJsonOnAPI<NoticesResponse>('/api/admin/notices'),
    select: data => data.notices.find(n => n.id === id),
    enabled: id !== undefined,
  });
}

interface NoticePayload {
  title: string;
  content: string;
  operationType: OperationType;
}

// POST /api/admin/notices
export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation<Notice, Error, NoticePayload>({
    mutationFn: payload =>
      fetchJsonOnAPI<Notice>('/api/admin/notices', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
    },
  });
}

// PATCH /api/admin/notices/:id
export function useUpdateNotice(id: number) {
  const queryClient = useQueryClient();
  return useMutation<Notice, Error, NoticePayload>({
    mutationFn: payload =>
      fetchJsonOnAPI<Notice>(`/api/admin/notices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
    },
  });
}

// DELETE /api/admin/notices/:id
export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const toast = useToastNotification.getState().addToast;
  return useMutation<null, Error, number>({
    mutationFn: id => fetchDeleteJsonOnAPI<null>(`/api/admin/notices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
    },
    onError: () => {
      toast('공지사항 삭제에 실패했습니다.');
    },
  });
}
