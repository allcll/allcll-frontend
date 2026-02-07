import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchGraduationCheck } from '@/entities/joluphaja/api/graduation';
import { graduationQueryKeys } from '@/entities/joluphaja/model/useGraduation';

export function useInitialGraduationCheck() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['initial', 'graduationCheck'],
    queryFn: fetchGraduationCheck,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      queryClient.setQueryData(graduationQueryKeys.check(), query.data);
    }
  }, [query.data, queryClient]);

  return query;
}
