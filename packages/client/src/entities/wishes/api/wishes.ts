import { fetchJsonOnPublic, fetchOnAPI } from '@/shared/api/api.ts';
import { ApiException, WishRegister } from '@/shared/model/types';
import { BadRequestError, NotFoundError } from '@/shared/lib/errors';
import { jsonParse } from '@/shared/lib/parser';

export interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

// baskets.json 파일 업데이트 시 반드시 `CACHE_VERSION` 값을 함께 변경해주세요.
const CACHE_VERSION = 'SUMMER_26_20260528';

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
    const parsedError = jsonParse<ApiException>(errorMessage);
    const errorText = parsedError?.message ?? response.statusText;

    if (response.status === 400) {
      throw new BadRequestError(errorText);
    }

    if (response.status === 404) {
      throw new NotFoundError(errorText);
    }

    throw new Error(errorMessage);
  }

  return response.json();
};
