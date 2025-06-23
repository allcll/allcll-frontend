import { useQuery } from '@tanstack/react-query';
import { WishRegister } from '@/utils/types.ts';

interface DetailRegistersResponse {
  eachDepartmentRegisters: WishRegister[];
  everytimeLectureId: number;
}

function useDetailRegisters(id: string) {
  return useQuery({
    queryKey: ['detail-registers', id],
    queryFn: () => fetchDetailRegisters(id),
    staleTime: Infinity,
    retry: retryCondition,
  });
}

const fetchDetailRegisters = async (subjectId: string): Promise<DetailRegistersResponse> => {
  const response = await fetch(`/api/baskets/${subjectId}`, {
    headers: {
      Cookie: `sessionId=${document.cookie.split('=')[1]}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

const retryCondition = (failureCount: number, error: Error) => {
  if (failureCount >= 3) return false;

  // error 따라서 재시도 여부 결정
  const parsedError = jsonParse(error.message);
  if (parsedError?.code) {
    return !['SUBJECT_NOT_FOUND'].includes(parsedError.code);
  }

  return true;
};

const jsonParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
};

export default useDetailRegisters;
