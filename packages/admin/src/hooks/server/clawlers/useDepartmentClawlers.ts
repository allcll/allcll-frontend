import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ClawlersDepartmentsParams {
  userId: string;
  year: string;
  semesterCode: string;
}

const clawlersDepartments = async ({ userId, year, semesterCode }: ClawlersDepartmentsParams) => {
  return await fetchOnAPI(`/api/admin/departments/check?userId=${userId}&year=${year}&semesterCode=${semesterCode}`, {
    method: 'POST',
  });
};

const getDepartments = async ({ userId, year, semesterCode }: ClawlersDepartmentsParams) => {
  return await fetchJsonOnAPI(
    `/api/admin/departments/check?userId=${userId}&year=${year}&semesterCode=${semesterCode}`,
  );
};

/**
 * 전체 학과를 크롤링하는 API입니다.
 * @param params
 * @returns
 */
export function useClawlersDepartments(params: ClawlersDepartmentsParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clawlersDepartments,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clawlers-departments', params],
      });
    },

    onError: err => console.error(err),
  });
}

/**
 * 전체 학과 크롤링 데이터를 조회하는 API입니다.
 * @param params
 * @returns
 */
export function useGetDepartments(params: ClawlersDepartmentsParams) {
  return useQuery({
    queryKey: ['clawlers-departments', params],
    queryFn: () => getDepartments(params),
  });
}
