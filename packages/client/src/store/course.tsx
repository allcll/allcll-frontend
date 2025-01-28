import { useInfiniteQuery } from '@tanstack/react-query';

const fetchCourses = async ({ pageParam = 1 }) => {
  const data = await fetch(`/api/courses?page=${pageParam}`);
  return data.json();
};

export const useCourses = () => {
  return useInfiniteQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};