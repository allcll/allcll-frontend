import { useInfiniteQuery } from '@tanstack/react-query';

const fetchCourses = async ({ pageParam = 1 }) => {
  const data = await fetch(`/api/courses?page=${pageParam}`);
  return data.json();
};

/**
 * @deprecated
 * 과목을 불러오는 Query, baskets.json 을 이용하세요
 * */
export const useCourses = () => {
  return useInfiniteQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextCursor,
  });
};
