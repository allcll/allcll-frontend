import { fetchJsonOnPublic, fetchOnAPI } from '@/shared/api/api.ts';
import { WishRegister } from '@/shared/model/types.ts';
import { BadRequestError } from '@/shared/lib/errors.ts';

export interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

const CACHE_VERSION = 'SPRING_26_20260130';

export const fetchWishesDataBySemester = async (semester: string) => {
  return await fetchJsonOnPublic<WishesApiResponse>(`/${semester}/baskets.json?v=${CACHE_VERSION}`);
};

interface DetailRegistersResponse {
  eachDepartmentRegisters: WishRegister[];
  everytimeLectureId: number;
}

export const fetchDetailRegisters = async (subjectId: number): Promise<DetailRegistersResponse> => {
  const response = await fetchOnAPI(`/api/baskets/${subjectId}`);

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

const jsonParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
