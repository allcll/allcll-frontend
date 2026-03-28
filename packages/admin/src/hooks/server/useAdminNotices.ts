import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJsonOnAPI, fetchDeleteJsonOnAPI } from '@/utils/api';

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  createdAt: string;
}

export type NoticeCategory =
  | 'SERVICE'
  | 'GRADUATION'
  | 'TIMETABLE'
  | 'REALTIME'
  | 'COURSE_ANALYSIS'
  | 'SIMULATION'
  | 'WISHLIST';

export type NoticeCategoryAll = NoticeCategory | 'ALL';

export const CATEGORY_LABELS: Record<NoticeCategoryAll, string> = {
  ALL: '전체',
  SERVICE: '서비스',
  GRADUATION: '졸업요건',
  TIMETABLE: '시간표',
  REALTIME: '실시간 여석',
  COURSE_ANALYSIS: '과목분석',
  SIMULATION: '수강신청 연습',
  WISHLIST: '관심과목',
};

export const NOTICE_CATEGORIES: NoticeCategory[] = [
  'SERVICE',
  'GRADUATION',
  'TIMETABLE',
  'REALTIME',
  'COURSE_ANALYSIS',
  'SIMULATION',
  'WISHLIST',
];

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
  category: NoticeCategory;
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
  return useMutation<null, Error, number>({
    mutationFn: id => fetchDeleteJsonOnAPI<null>(`/api/admin/notices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
    },
  });
}
