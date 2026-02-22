import { Card, Flex, Button, Badge } from '@allcll/allcll-ui';
import ProgressDoughnut from '@/entities/graduation/ui/ProgressDoughnut';
import type {
  BalanceRequiredArea,
  CategoryProgress,
  CategoryType,
  CriteriaCategory,
} from '@/entities/graduation/api/graduation';
import { CATEGORY_TYPE_LABELS, getStatusLabel } from '../../lib/mappers';

interface CategoryProgressCardProps {
  category: CategoryProgress;
  criteriaCategory?: CriteriaCategory;
  onViewCourses?: (
    categoryType: CategoryType,
    criteriaCategory?: CriteriaCategory,
    earnedAreas?: BalanceRequiredArea[],
  ) => void;
}

function BalanceInfo({ category }: Readonly<{ category: CategoryProgress }>) {
  return (
    <Flex direction="flex-col" gap="gap-1" className="text-sm">
      <Flex justify="justify-end" align="items-center" gap="gap-6">
        <span className="text-gray-500">이수 영역</span>
        <span>
          <span className="text-primary-500 text-xl font-semibold">{category.earnedAreasCnt ?? 0}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-lg font-semibold text-gray-600">{category.requiredAreasCnt ?? 0}</span>
        </span>
      </Flex>
      <Flex justify="justify-end" align="items-center" gap="gap-6">
        <span className="text-gray-500">이수 학점</span>
        <span>
          <span className="text-primary-500 text-xl font-semibold">{category.earnedCredits}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-lg font-semibold text-gray-600">{category.requiredCredits}</span>
        </span>
      </Flex>
    </Flex>
  );
}

function CreditInfo({ category }: Readonly<{ category: CategoryProgress }>) {
  return (
    <Flex direction="flex-col" gap="gap-1" className="text-sm">
      <Flex justify="justify-end" align="items-center" gap="gap-6">
        <span className="text-gray-500">필요 학점</span>
        <span className="text-lg font-semibold text-gray-600">{category.requiredCredits}</span>
      </Flex>
      <Flex justify="justify-end" align="items-center" gap="gap-6">
        <span className="text-gray-500">이수 학점</span>
        <span className="text-primary-500 text-xl font-semibold">{category.earnedCredits}</span>
      </Flex>
    </Flex>
  );
}

function CategoryProgressCard({ category, criteriaCategory, onViewCourses }: Readonly<CategoryProgressCardProps>) {
  const label = CATEGORY_TYPE_LABELS[category.categoryType];
  const statusLabel = getStatusLabel(category.satisfied);
  const isBalance = category.categoryType === 'BALANCE_REQUIRED' && category.requiredAreasCnt != null;

  const handleViewCourses = () => {
    onViewCourses?.(category.categoryType, criteriaCategory, category.earnedAreas ?? undefined);
  };

  return (
    <Card variant="outlined" className="h-full relative">
      {!category.satisfied && (
        <div className="absolute top-3 right-3">
          <Badge variant="danger">{statusLabel}</Badge>
        </div>
      )}

      <Flex direction="flex-col" gap="gap-2" className="h-full">
        {/* 카테고리 제목 */}
        <div className="text-center">
          <span className="text-lg font-bold">{label}</span>
        </div>

        {/* 도넛 차트 - 균형교양은 영역 수 기준 */}
        <Flex justify="justify-center">
          <ProgressDoughnut
            earned={isBalance ? (category.earnedAreasCnt ?? 0) : category.earnedCredits}
            required={isBalance ? (category.requiredAreasCnt ?? 0) : category.requiredCredits}
            size="medium"
          />
        </Flex>

        {/* 정보 영역 */}
        {isBalance ? <BalanceInfo category={category} /> : <CreditInfo category={category} />}

        {/* 과목 확인 버튼 / 이수 완료 배지 */}
        <div className="w-full mt-auto">
          {category.satisfied ? (
            <div className="w-full py-2 text-center rounded-md text-sm font-semibold bg-primary-50 text-primary">
              이수 완료
            </div>
          ) : (
            <div className="[&>button]:w-full">
              <Button variant="outlined" size="small" onClick={handleViewCourses}>
                추천 과목
              </Button>
            </div>
          )}
        </div>
      </Flex>
    </Card>
  );
}

export default CategoryProgressCard;
