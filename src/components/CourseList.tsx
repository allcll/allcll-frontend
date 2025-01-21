import { memo, useCallback } from 'react';
import { useCourses } from '@/store/course';
import { useStore } from '@/store/stores';
import useSSE from '@/hooks/useSSE';

interface CourseRowProps {
  index: number;
  style: React.CSSProperties;
}

const CourseRow = memo(({ index, style }: CourseRowProps) => {
  const course = useStore((state) => state.courses[index]);

  return (
    <div style={style} className="border-b p-4">
      <div>{course.code}</div>
      <div>{course.name}</div>
      <div>{course.professor}</div>
      <div>{course.credits}</div>
      <div className={course.seats > 0 ? 'text-green-500' : 'text-red-500'}>
        {course.seats}
      </div>
      <div>{course.updatedAt}</div>
    </div>
  );
});

const CourseList = () => {
  const { data, fetchNextPage, hasNextPage } = useCourses();
  const courses = useStore((state) => state.courses);

  useSSE();

  const loadMoreItems = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="course-list">
      {courses.map((course, index) => (
        <CourseRow key={course.id} index={index} style={{}} />
      ))}
      <button onClick={loadMoreItems} disabled={!hasNextPage}>
        Load More
      </button>
    </div>
  );
};

export default CourseList;