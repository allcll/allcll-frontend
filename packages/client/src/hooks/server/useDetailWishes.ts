import useWishes from '@/hooks/server/useWishes.ts';
import { Wishes } from '@/utils/types.ts';

interface DetailWishes {
  isPending: boolean;
  data?: Wishes;
  isLastSemesterWish?: boolean;
}

function useDetailWishes(id: string): DetailWishes {
  const { data } = useWishes();

  if (!data) return { isPending: true };

  const detail = data?.find(basket => basket.subjectId === Number(id));

  return {
    isPending: false,
    data: detail,
    isLastSemesterWish: !detail,
  };
}

export const DEFAULT_WISH = {
  subjectId: -1,
  subjectName: '',
  departmentName: '',
  departmentCode: '',
  subjectCode: '',
  classCode: '',
  professorName: null,
  totalCount: 0,
};

export default useDetailWishes;
