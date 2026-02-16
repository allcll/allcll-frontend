import { Dialog, Flex, Button } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import type { CategoryType, CriteriaCategory, MissingCourse } from '@/entities/graduation/api/graduation';
import { CATEGORY_TYPE_LABELS, BALANCE_AREA_LABELS } from '../../lib/mappers';

interface RecommendedCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryType: CategoryType;
  criteriaCategory?: CriteriaCategory;
}

function CourseList({ courses }: { courses: MissingCourse[] }) {
  return (
    <div className="flex flex-col gap-2">
      {courses.map((course, index) => (
        <div
          key={`${course.curiNo}-${index}`}
          className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md"
        >
          <span className="text-sm font-medium">{course.curiNm}</span>
          <span className="text-xs text-gray-400 ml-4 shrink-0">{course.curiNo}</span>
        </div>
      ))}
    </div>
  );
}

function BalanceAreaContent({ criteriaCategory }: { criteriaCategory: CriteriaCategory }) {
  const { balanceAreaCourses, requiredAreasCnt, excludedArea } = criteriaCategory;

  return (
    <Flex direction="flex-col" gap="gap-4" className="min-w-64 md:min-w-96">
      <p className="text-sm text-gray-600">
        아래 영역 중 <span className="text-primary-500 font-semibold">{requiredAreasCnt}개 영역</span>을 이수해야 합니다.
        {excludedArea && (
          <span className="text-gray-400"> ({BALANCE_AREA_LABELS[excludedArea]} 영역 제외)</span>
        )}
      </p>
      <div className="flex flex-col gap-4 h-72 overflow-y-auto">
        {balanceAreaCourses?.map(area => (
          <div key={area.balanceRequiredArea}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {BALANCE_AREA_LABELS[area.balanceRequiredArea]}
              <span className="text-xs text-gray-400 ml-2">{area.requiredCourses.length}개 과목</span>
            </h4>
            <CourseList courses={area.requiredCourses} />
          </div>
        ))}
      </div>
    </Flex>
  );
}

function DefaultContent({ categoryLabel, courses }: { categoryLabel: string; courses: MissingCourse[] }) {
  return courses.length > 0 ? (
    <Flex direction="flex-col" gap="gap-2" className="min-w-64 md:min-w-96">
      <p className="text-sm text-gray-600">
        아래 과목을 이수하면 <span className="text-primary-500 font-semibold">{categoryLabel}</span> 요건을 충족할 수
        있습니다.
      </p>
      <span className="text-xs text-gray-400">{courses.length}개 과목</span>
      <div className="h-72 overflow-y-auto">
        <CourseList courses={courses} />
      </div>
    </Flex>
  ) : (
    <Flex justify="justify-center" align="items-center" className="min-w-64 md:min-w-96 h-72">
      <p className="text-sm text-gray-400">추천 정보가 없습니다.</p>
    </Flex>
  );
}

function RecommendedCoursesModal({ isOpen, onClose, categoryType, criteriaCategory }: RecommendedCoursesModalProps) {
  const categoryLabel = CATEGORY_TYPE_LABELS[categoryType];
  const isBalanceRequired = categoryType === 'BALANCE_REQUIRED' && criteriaCategory?.balanceAreaCourses;

  useBodyScrollLock(isOpen);

  return (
    <Dialog title={`${categoryLabel} 추천 과목`} onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        {isBalanceRequired ? (
          <BalanceAreaContent criteriaCategory={criteriaCategory!} />
        ) : (
          <DefaultContent categoryLabel={categoryLabel} courses={criteriaCategory?.requiredCourses ?? []} />
        )}
      </Dialog.Content>

      <Dialog.Footer>
        <Button variant="primary" size="small" onClick={onClose}>
          닫기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default RecommendedCoursesModal;
