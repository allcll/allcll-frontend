import useWishes from '@/hooks/server/useWishes.ts';

function useRecommendWishes(subjectCode: string, excludeSubjectIds: number[] = []) {
  const {data} = useWishes();

  if (!data)
    return { isPending: true }

  const detail = data.filter((basket) =>
    basket.subjectCode === subjectCode && !excludeSubjectIds.includes(basket.subjectId));

  return {
    isPending: false,
    data: detail,
  }
}

export default useRecommendWishes;