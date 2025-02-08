import {useQuery} from '@tanstack/react-query';
import {WishRegister} from '@/utils/types.ts';

interface DetailRegistersResponse {
  eachDepartmentRegisters: WishRegister[];
  everytimeLectureId: number;
}

function useDetailRegisters(id: string) {
  return useQuery({
    queryKey: ['detail-registers', id],
    queryFn: () => fetchDetailRegisters(id),
    staleTime: Infinity
  });
}

const fetchDetailRegisters = async (subjectId: string): Promise<DetailRegistersResponse> => {
  const response = await fetch(`/api/baskets/${subjectId}`, {
    headers: {
      'Cookie': `sessionId=${document.cookie.split('=')[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export default useDetailRegisters;