import { Card, Flex, Button } from '@allcll/allcll-ui';
import ProgressDoughnut from '@/entities/graduation/ui/ProgressDoughnut';
import type { CategoryProgress, CategoryType, CriteriaCategory } from '@/entities/graduation/api/graduation';
import { CATEGORY_TYPE_LABELS, getStatusLabel } from '../../lib/mappers';

interface CategoryProgressCardProps {
  category: CategoryProgress;
  criteriaCategory?: CriteriaCategory;
  onViewCourses?: (categoryType: CategoryType, criteriaCategory?: CriteriaCategory) => void;
}

function CategoryProgressCard({ category, criteriaCategory, onViewCourses }: CategoryProgressCardProps) {
  const label = CATEGORY_TYPE_LABELS[category.categoryType];
  const statusLabel = getStatusLabel(category.satisfied);

  const handleViewCourses = () => {
    onViewCourses?.(category.categoryType, criteriaCategory);
  };

  return (
    <Card variant="outlined" className="h-full">
      <Flex direction="flex-col" gap="gap-2" className="h-full">
        {/* 카테고리 제목 */}
        <div className="text-center">
          <span className="text-lg font-bold">{label}</span>
        </div>

        {/* 도넛 차트 */}
        <Flex justify="justify-center">
          <ProgressDoughnut earned={category.earnedCredits} required={category.requiredCredits} size="medium" />
        </Flex>

        {/* 학점 정보 */}
        <Flex direction="flex-col" gap="gap-1" className="text-sm">
          <Flex justify="justify-end" align="items-center" gap="gap-6">
            <span className="text-gray-500">이수 학점</span>
            <span className="text-primary-500 text-xl font-semibold">{category.earnedCredits}</span>
          </Flex>
          <Flex justify="justify-end" align="items-center" gap="gap-6">
            <span className="text-gray-500">총 학점</span>
            <span className="text-lg font-semibold text-gray-600">{category.requiredCredits}</span>
          </Flex>
        </Flex>

        {/* 이수 상태 뱃지 */}
        <div className="w-full">
          <div
            className={`w-full py-2 text-center rounded-md text-sm font-semibold ${
              category.satisfied ? 'bg-primary-50 text-primary' : 'bg-secondary-50 text-secondary-500'
            }`}
          >
            {statusLabel}
          </div>
        </div>

        {/* 과목 확인 버튼 */}
        <div className="w-full mt-auto [&>button]:w-full">
          <Button variant="outlined" size="small" onClick={handleViewCourses} disabled={category.satisfied}>
            추천 과목
          </Button>
        </div>
      </Flex>
    </Card>
  );
}

export default CategoryProgressCard;
