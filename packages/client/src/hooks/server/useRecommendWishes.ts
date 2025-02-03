import useWishes from '@/hooks/server/useWishes.ts';

function useRecommendWishes(subjectCode: string) {
  const {data} = useWishes();

  if (!data)
    return {
      isPending: true,
    }

  const detail = data.filter((basket) => basket.subjectCode === subjectCode);

  return {
    isPending: false,
    data: detail,
  }
}

export default useRecommendWishes;