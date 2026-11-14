import { useState, useEffect } from 'react';
import { Flex, Grid, Label, Chip, ChevronDownIcon, EmptyState, Popover } from '@allcll/allcll-ui';
import Filtering from '../filtering/Filtering';
import type { CategoryType, GraduationCourse } from '../../types/graduation';
import { CATEGORY_TYPE_LABELS } from '../../lib/graduation/mappers';
import { COURSE_CATEGORY_ORDER } from '../../lib/graduation/rules';

interface EarnedCoursesSectionProps {
  courses: GraduationCourse[];
}

function getUniqueCategories(courses: GraduationCourse[]): CategoryType[] {
  const existingCategories = new Set(courses.map(course => course.categoryType));
  return COURSE_CATEGORY_ORDER.filter(cat => existingCategories.has(cat));
}

function filterCourses(courses: GraduationCourse[], category: CategoryType | '전체'): GraduationCourse[] {
  const filtered = category === '전체' ? courses : courses.filter(course => course.categoryType === category);
  return [...filtered.filter(course => course.isEarned), ...filtered.filter(course => !course.isEarned)];
}

function CourseRow({ course }: Readonly<{ course: GraduationCourse }>) {
  const isEarned = course.isEarned;
  return (
    <Flex
      align="center"
      justify="between"
      gap={3}
      className={`px-3 py-2.5 rounded-md border ${
        isEarned ? 'bg-surface border-line' : 'bg-surface-muted border-line'
      }`}
    >
      <Flex direction="column" gap={0.5} className="min-w-0">
        <span className={`text-sm font-medium truncate ${isEarned ? 'text-fg' : 'text-fg-subtle'}`}>
          {course.curiNm}
        </span>
        <span className="text-xs text-fg-subtle">{course.curiNo}</span>
      </Flex>
      <Flex align="center" gap={3} className="shrink-0">
        <span className="text-xs text-fg-muted whitespace-nowrap">{CATEGORY_TYPE_LABELS[course.categoryType]}</span>
        <span className="text-xs text-fg-muted whitespace-nowrap">{course.credits}학점</span>
      </Flex>
    </Flex>
  );
}

function EarnedCoursesSection({ courses }: Readonly<EarnedCoursesSectionProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | '전체'>('전체');

  useEffect(() => {
    if (!isOpen) setSelectedCategory('전체');
  }, [isOpen]);

  const categories = getUniqueCategories(courses);
  const visibleCourses = filterCourses(courses, selectedCategory);
  const earnedCourses = visibleCourses.filter(course => course.isEarned);
  const earnedCredits = earnedCourses.reduce((sum, course) => sum + course.credits, 0);
  const earnedCount = earnedCourses.length;

  const categoryOptions = [
    { value: '전체' as const, label: '전체' },
    ...categories.map(category => ({ value: category, label: CATEGORY_TYPE_LABELS[category] })),
  ];

  return (
    <div className="border border-line rounded-lg bg-surface">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-surface-subtle transition-colors ${
          isOpen ? 'rounded-t-lg' : 'rounded-lg'
        }`}
      >
        <span className="text-sm font-medium text-fg-secondary">내 이수 과목</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-fg-subtle transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="border-t border-line-subtle px-4 pb-4">
          <Flex direction="column" gap={3} className="pt-3">
            {courses.length === 0 ? (
              <EmptyState title="이수 과목 정보가 없습니다." className="py-4" />
            ) : (
              <>
                <Flex align="center" justify="between" gap={3}>
                  <Filtering
                    label={selectedCategory === '전체' ? '전체' : CATEGORY_TYPE_LABELS[selectedCategory]}
                    selected={selectedCategory !== '전체'}
                  >
                    <CategoryOptions
                      options={categoryOptions}
                      selectedCategory={selectedCategory}
                      onSelect={setSelectedCategory}
                    />
                  </Filtering>
                  <span className="text-xs text-fg-muted shrink-0">
                    <span className="text-primary-500 font-semibold">{earnedCredits}학점</span> · {earnedCount}과목
                  </span>
                </Flex>
                <Flex align="center" gap={3} className="text-xs text-fg-subtle">
                  <Flex align="center" gap={1.5}>
                    <span className="w-3 h-3 rounded-sm border border-line bg-surface inline-block shrink-0" />
                    이수 완료
                  </Flex>
                  <Flex align="center" gap={1.5}>
                    <span className="w-3 h-3 rounded-sm border border-line bg-surface-muted inline-block shrink-0" />
                    미이수 (F/FA/NP)
                  </Flex>
                </Flex>
                <Flex direction="column" gap={1} className="overflow-y-auto max-h-80 pr-1">
                  {visibleCourses.map(course => (
                    <CourseRow key={course.id} course={course} />
                  ))}
                </Flex>
              </>
            )}
          </Flex>
        </div>
      )}
    </div>
  );
}

interface CategoryOptionsProps {
  options: { value: CategoryType | '전체'; label: string }[];
  selectedCategory: CategoryType | '전체';
  onSelect: (category: CategoryType | '전체') => void;
}

function CategoryOptions({ options, selectedCategory, onSelect }: Readonly<CategoryOptionsProps>) {
  return (
    <Flex direction="column" gap={2}>
      <Label>이수 구분</Label>
      <Grid columns={{ md: 3 }} gap={2}>
        {options.map(option => (
          <Popover.Close key={option.value} asChild>
            <Chip
              label={option.label}
              selected={option.value === selectedCategory}
              onClick={() => onSelect(option.value)}
            />
          </Popover.Close>
        ))}
      </Grid>
    </Flex>
  );
}

export default EarnedCoursesSection;
