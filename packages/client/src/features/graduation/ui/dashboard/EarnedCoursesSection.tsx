import { useState, useEffect, useRef } from 'react';
import { Flex, Chip, ListboxOption } from '@allcll/allcll-ui';
import { useGraduationCourses } from '@/entities/graduation/model/useGraduation';
import type { GraduationCourse } from '@/entities/graduation/api/graduation';
import CheckSvg from '@/assets/checkbox-blue.svg?react';
import ArrowDownSvg from '@/assets/arrow-down-gray.svg?react';

function getUniqueAreas(courses: GraduationCourse[]): string[] {
  return Array.from(new Set(courses.map(course => course.selectedArea)));
}

function filterCourses(courses: GraduationCourse[], area: string): GraduationCourse[] {
  const filtered = area === '전체' ? courses : courses.filter(course => course.selectedArea === area);
  return [...filtered.filter(course => course.isEarned), ...filtered.filter(course => !course.isEarned)];
}

function CourseRow({ course }: Readonly<{ course: GraduationCourse }>) {
  const isEarned = course.isEarned;
  return (
    <Flex
      align="items-center"
      justify="justify-between"
      gap="gap-3"
      className={`px-3 py-2.5 rounded-md border ${
        isEarned ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200'
      }`}
    >
      <Flex direction="flex-col" gap="gap-0.5" className="min-w-0">
        <span className={`text-sm font-medium truncate ${isEarned ? 'text-gray-800' : 'text-gray-400'}`}>
          {course.curiNm}
        </span>
        <span className="text-xs text-gray-400">{course.curiNo}</span>
      </Flex>
      <Flex align="items-center" gap="gap-3" className="shrink-0">
        <span className="text-xs text-gray-500 whitespace-nowrap">{course.selectedArea}</span>
        <span className="text-xs text-gray-500 whitespace-nowrap">{course.credits}학점</span>
      </Flex>
    </Flex>
  );
}

function EarnedCoursesSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending, isError } = useGraduationCourses();
  const [selectedArea, setSelectedArea] = useState<string>('전체');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedArea('전체');
      setIsSelectOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isSelectOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSelectOpen]);

  const courses = data?.courses ?? [];
  const areas = getUniqueAreas(courses);
  const visibleCourses = filterCourses(courses, selectedArea);
  const earnedCourses = visibleCourses.filter(course => course.isEarned);
  const earnedCredits = earnedCourses.reduce((sum, course) => sum + course.credits, 0);
  const earnedCount = earnedCourses.length;

  const areaOptions = [
    { value: '전체', label: '전체' },
    ...areas.map(area => ({ value: area, label: area })),
  ];

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
      >
        <span className="text-sm font-medium text-gray-700">내 이수 과목</span>
        <ArrowDownSvg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4">
          <Flex direction="flex-col" gap="gap-3" className="pt-3">
            {isPending && (
              <p className="text-sm text-gray-400 text-center py-4">불러오는 중...</p>
            )}
            {isError && (
              <p className="text-sm text-secondary-500 text-center py-4">
                이수 과목 정보를 불러올 수 없습니다.
              </p>
            )}
            {!isPending && !isError && courses.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">이수 과목 정보가 없습니다.</p>
            )}
            {courses.length > 0 && (
              <>
                <Flex align="items-center" justify="justify-between" gap="gap-3">
                  <div ref={selectRef} className="relative">
                    <Chip
                      label={selectedArea}
                      selected={isSelectOpen}
                      variant="select"
                      isChipOpen={isSelectOpen}
                      onClick={() => setIsSelectOpen(prev => !prev)}
                    />
                    {isSelectOpen && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto min-w-[120px]">
                        {areaOptions.map(option => (
                          <ListboxOption
                            key={option.value}
                            selected={option.value === selectedArea}
                            left={option.label}
                            right={option.value === selectedArea ? <CheckSvg className="w-4 h-4 shrink-0" /> : null}
                            onSelect={() => {
                              setSelectedArea(option.value);
                              setIsSelectOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">
                    <span className="text-primary-500 font-semibold">{earnedCredits}학점</span> · {earnedCount}과목
                  </span>
                </Flex>
                <Flex align="items-center" gap="gap-3" className="text-xs text-gray-400">
                  <Flex align="items-center" gap="gap-1.5">
                    <span className="w-3 h-3 rounded-sm border border-gray-200 bg-white inline-block shrink-0" />
                    이수 완료
                  </Flex>
                  <Flex align="items-center" gap="gap-1.5">
                    <span className="w-3 h-3 rounded-sm border border-gray-200 bg-gray-100 inline-block shrink-0" />
                    미이수 (F/FA/NP)
                  </Flex>
                </Flex>
                <Flex direction="flex-col" gap="gap-1" className="overflow-y-auto max-h-80 pr-1">
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

export default EarnedCoursesSection;
