import useWishes from '@/hooks/server/useWishes.ts';
import {Wishes} from '@/utils/types.ts';

interface DetailWishes {
  isPending: boolean;
  data?: Wishes;
}

function useDetailWishes(id: string) : DetailWishes {
  const {data} = useWishes();

  if (!data)
    return {
      isPending: true,
    }

  const detail = data?.find((basket) => basket.subjectId === Number(id));

  if (!detail)
    throw new Error('Invalid ID');

  return {
    isPending: false,
    data: detail,
  }
}

export default useDetailWishes;