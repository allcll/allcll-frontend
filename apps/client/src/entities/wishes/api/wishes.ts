import { fetchJsonOnPublic, fetchOnAPI } from '@/shared/api/api.ts';
import { ApiException, WishRegister } from '@/shared/model/types';
import { BadRequestError, NotFoundError } from '@/shared/lib/errors';
import { jsonParse } from '@/shared/lib/parser';

export interface WishesApiResponse {
  baskets: { subjectId: number; totalCount: number }[];
}

export const fetchWishesDataBySemester = async (semester: string) => {
  return await fetchJsonOnPublic<WishesApiResponse>(`/${semester}/baskets.json`);
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
