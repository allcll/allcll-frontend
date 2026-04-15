import { fetchJsonOnPublic, fetchOnAPI } from '@/shared/api/api.ts';
import { WishRegister } from '@/shared/model/types.ts';
import { BadRequestError, NotFoundError } from '@/shared/lib/errors.ts';

export interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

// baskets.json 파일 업데이트 시 반드시 `CACHE_VERSION` 값을 함께 변경해주세요.
const CACHE_VERSION = 'SPRING_26_20260131';

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

    console.log('status', response.status);
    if (response.status === 400) {
      throw new BadRequestError(parsedError.message ?? response.statusText);
    }

    if (response.status === 404) {
      throw new NotFoundError(parsedError.message ?? response.statusText);
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
