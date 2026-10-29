import { useQuery } from '@tanstack/react-query';
import { fetchPrivacyPolicy } from '../api/privacyPolicy.ts';

function usePrivacyPolicy() {
  return useQuery({
    queryKey: ['privacyPolicy'],
    queryFn: fetchPrivacyPolicy,
    staleTime: Infinity,
  });
}

export default usePrivacyPolicy;
