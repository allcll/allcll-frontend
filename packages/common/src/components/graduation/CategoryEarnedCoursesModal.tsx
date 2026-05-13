import { useEffect } from 'react';
import { Dialog, Flex, Button } from '@allcll/allcll-ui';
import type { CategoryType, GraduationCourse, ScopeType } from '../../types/graduation';
import { CATEGORY_TYPE_LABELS } from '../../lib/graduation/mappers';

interface CategoryEarnedCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryType: CategoryType;
  majorScope: ScopeType;
  courses: GraduationCourse[];
}

function CourseRow({ course }: Readonly<{ course: GraduationCourse }>) {
  return (
    <Flex
      align="items-center"
      justify="justify-between"
      gap="gap-3"
      className="px-3 py-2.5 rounded-md border bg-white border-gray-200"
    >
      <Flex direction="flex-col" gap="gap-0.5" className="min-w-0">
        <span className="text-sm font-medium truncate text-gray-800">{course.curiNm}</span>
        <span className="text-xs text-gray-400">{course.curiNo}</span>
      </Flex>
      <Flex align="items-center" gap="gap-3" className="shrink-0">
        <span className="text-xs text-gray-500 whitespace-nowrap">{course.selectedArea}</span>
        <span className="text-xs text-gray-500 whitespace-nowrap">{course.credits}학점</span>
      </Flex>
    </Flex>
  );
}

function CategoryEarnedCoursesModal({
  isOpen,
  onClose,
  categoryType,
  majorScope,
  courses,
}: Readonly<CategoryEarnedCoursesModalProps>) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const filtered = courses.filter(c => c.categoryType === categoryType && c.majorScope === majorScope && c.isEarned);
  const earnedCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
  const earnedCount = filtered.length;
  const categoryLabel = CATEGORY_TYPE_LABELS[categoryType];

  return (
    <Dialog title={`${categoryLabel} 이수 과목`} onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-3" className="min-w-64 md:min-w-96">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">해당 카테고리의 이수 과목이 없습니다.</p>
          ) : (
            <>
              <Flex justify="justify-end">
                <span className="text-xs text-gray-500 shrink-0">
                  <span className="text-primary-500 font-semibold">{earnedCredits}학점</span> · {earnedCount}과목
                </span>
              </Flex>
              <Flex direction="flex-col" gap="gap-1" className="overflow-y-auto max-h-80 pr-1">
                {filtered.map(course => (
                  <CourseRow key={course.id} course={course} />
                ))}
              </Flex>
            </>
          )}
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        <Button variant="primary" size="small" onClick={onClose}>
          닫기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default CategoryEarnedCoursesModal;
