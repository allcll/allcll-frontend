import { useQuery } from '@tanstack/react-query';
import { WishRegister } from '@/utils/types.ts';
import { BadRequestError } from '@/utils/errors.ts';

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
    const errorMessage = await response.text();
    const parsedError = jsonParse(errorMessage);

    if (parsedError?.status === '400 BAD_REQUEST') {
      throw new BadRequestError(parsedError.code);
    }

    throw new Error(await response.text());
  }

  return response.json();
};

const retryCondition = (failureCount: number, error: Error) => {
  if (failureCount >= 3) return false;

  // error 따라서 재시도 여부 결정
  return !(error instanceof BadRequestError);
};

const jsonParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export default useDetailRegisters;
