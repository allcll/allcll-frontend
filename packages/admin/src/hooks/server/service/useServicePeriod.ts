import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { PreiodService } from '@/utils/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface ServicePeriodApi {
  code: string;
  semester: string;
  services: PreiodService[];
}

const editServicePeriod = async (service: ServicePeriodApi) => {
  const response = await fetchOnAPI('/api', {
    method: 'PUT',
    body: JSON.stringify(service),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 *
 * 서비스 기간을 조회합니다.
 * @returns
 */
const getServicePeriod = async () => {
  //TODO: API나오면 url 변경하기
  return await fetchJsonOnAPI<ServicePeriodApi>('/api/service');
};

export function useServicePeriod() {
  return useQuery({
    queryKey: ['period'],
    queryFn: getServicePeriod,
  });
}

export function useEditServicePeriod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editServicePeriod,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period'] });
    },

    onError: err => console.error(err),
  });
}
