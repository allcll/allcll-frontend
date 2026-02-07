import { Dialog, Flex, Button } from '@allcll/allcll-ui';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import type { CategoryType, MissingCourse } from '@/entities/joluphaja/api/graduation';
import { CATEGORY_TYPE_LABELS } from '../lib/mappers';

interface RecommendedCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryType: CategoryType;
  missingCourses: MissingCourse[];
}

function RecommendedCoursesModal({ isOpen, onClose, categoryType, missingCourses }: RecommendedCoursesModalProps) {
  const categoryLabel = CATEGORY_TYPE_LABELS[categoryType];
  useBodyScrollLock(isOpen);

  return (
    <Dialog title={`${categoryLabel} 추천 과목`} onClose={onClose} isOpen={isOpen}>
      <Dialog.Content>
        {missingCourses.length > 0 ? (
          <Flex direction="flex-col" gap="gap-2" className="min-w-64 md:min-w-96">
            <p className="text-sm text-gray-600">
              아래 과목을 이수하면 <span className="text-primary-500 font-semibold">{categoryLabel}</span> 요건을 충족할
              수 있습니다.
            </p>
            <span className="text-xs text-gray-400">{missingCourses.length}개 과목</span>
            <div className="flex flex-col gap-2 h-72 overflow-y-auto">
              {missingCourses.map((course, index) => (
                <div
                  key={`${course.curiNo}-${index}`}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md"
                >
                  <span className="text-sm font-medium">{course.curiNm}</span>
                  <span className="text-xs text-gray-400 ml-4 shrink-0">{course.curiNo}</span>
                </div>
              ))}
            </div>
          </Flex>
        ) : (
          <Flex justify="justify-center" align="items-center" className="min-w-64 md:min-w-96 h-72">
            <p className="text-sm text-gray-400"> 추천 정보가 없습니다.</p>
          </Flex>
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
