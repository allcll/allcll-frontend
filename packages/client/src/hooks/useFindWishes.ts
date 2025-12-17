import useWishes from '@/entities/wishes/api/useWishes.ts';

function useFindWishes(subjectIds: number[]) {
  const { data } = useWishes();
  return data?.filter(wish => subjectIds.includes(wish.subjectId)) ?? [];
}

export default useFindWishes;
