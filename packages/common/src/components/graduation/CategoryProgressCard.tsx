import { Card, Flex, Button } from '@allcll/allcll-ui';
import type {
  BalanceRequiredArea,
  CategoryProgress,
  CategoryType,
  CriteriaCategory,
  MissingCourse,
  ScopeType,
} from '../../types/graduation';
import { CATEGORY_TYPE_LABELS } from '../../lib/graduation/mappers';
import { getMissingRequiredCourses, resolveCategoryRequirementMode } from '../../lib/graduation/rules';
import ProgressDoughnut from './ProgressDoughnut';

interface CategoryProgressCardProps {
  category: CategoryProgress;
  criteriaCategory?: CriteriaCategory;
  onViewCourses?: (
    categoryType: CategoryType,
    criteriaCategory?: CriteriaCategory,
    earnedAreas?: BalanceRequiredArea[],
  ) => void;
  onViewEarnedCourses?: (categoryType: CategoryType, majorScope: ScopeType) => void;
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

function EarnedCreditsOnly({ category }: Readonly<{ category: CategoryProgress }>) {
  return (
    <Flex justify="justify-end" align="items-center" gap="gap-6" className="text-sm">
      <span className="text-gray-500">이수 학점</span>
      <span className="text-primary-500 text-xl font-semibold">{category.earnedCredits}</span>
    </Flex>
  );
}

/** 요건 자체가 없는 카테고리. 충족·미충족을 말하지 않는다. 판정 대상이 아니기 때문이다. */
function NoRequirementBody({ category }: Readonly<{ category: CategoryProgress }>) {
  return (
    <Flex direction="flex-col" gap="gap-2" className="py-2">
      <p className="text-center text-sm text-gray-500">이 학과는 이 영역의 이수 요건이 없어요</p>
      <EarnedCreditsOnly category={category} />
    </Flex>
  );
}

/** 필요 학점 없이 지정 과목만 따지는 카테고리. */
function RequiredCoursesBody({
  category,
  missingCourses,
}: Readonly<{ category: CategoryProgress; missingCourses: MissingCourse[] }>) {
  const missingCount = missingCourses.length;
  const preview = missingCourses
    .slice(0, 2)
    .map(course => course.curiNm)
    .join(', ');

  return (
    <Flex direction="flex-col" gap="gap-2" className="py-2">
      {missingCount === 0 ? (
        <p className="text-primary-500 text-center text-sm font-semibold">지정 과목을 모두 이수했어요</p>
      ) : (
        <div className="text-center">
          <p className="text-sm font-semibold text-amber-600">지정 과목 {missingCount}개가 남았어요</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {preview}
            {missingCount > 2 ? ` 외 ${missingCount - 2}개` : ''}
          </p>
        </div>
      )}
      <p className="text-center text-xs text-gray-400">필요 이수학점은 없어요</p>
      <EarnedCreditsOnly category={category} />
    </Flex>
  );
}

function CategoryProgressCard({
  category,
  criteriaCategory,
  onViewCourses,
  onViewEarnedCourses,
}: Readonly<CategoryProgressCardProps>) {
  const label = CATEGORY_TYPE_LABELS[category.categoryType];
  const mode = resolveCategoryRequirementMode(category, criteriaCategory);
  const missingCourses = getMissingRequiredCourses(criteriaCategory);

  // 요건이 없거나 학점이 아닌 기준으로 따지는 카테고리는 학점 진행률을 그리지 않는다.
  // 필요 학점이 0 인데 100% 로 표시하면 미이수 지정 과목이 있어도 다 된 것처럼 보인다.
  const showDoughnut = mode === 'AREA' || mode === 'CREDIT';
  const isAreaMode = mode === 'AREA';

  // 추천 과목은 더 들을 것이 있을 때만 연다. 요건이 없으면 추천할 것도 없다.
  const resolveHasRecommendation = () => {
    if (mode === 'NONE' || mode === 'UNKNOWN') return false;
    if (mode === 'COURSE_ONLY') return missingCourses.length > 0;
    return !category.satisfied;
  };
  const hasRecommendation = resolveHasRecommendation();

  const handleViewCourses = () => {
    onViewCourses?.(category.categoryType, criteriaCategory, category.earnedAreas ?? undefined);
  };

  const handleViewEarnedCourses = () => {
    onViewEarnedCourses?.(category.categoryType, category.majorScope);
  };

  const renderBody = () => {
    if (mode === 'NONE') return <NoRequirementBody category={category} />;
    if (mode === 'COURSE_ONLY') return <RequiredCoursesBody category={category} missingCourses={missingCourses} />;
    // 기준 정보가 아직 없으면 요건에 대해 아무 말도 하지 않는다.
    if (mode === 'UNKNOWN') return <EarnedCreditsOnly category={category} />;
    if (isAreaMode) return <BalanceInfo category={category} />;
    return <CreditInfo category={category} />;
  };

  return (
    <Card variant="outlined" className="h-full">
      <Flex direction="flex-col" gap="gap-2" className="h-full">
        <div className="text-center">
          <span className="text-lg font-bold">{label}</span>
        </div>

        {showDoughnut && (
          <Flex justify="justify-center">
            <ProgressDoughnut
              earned={isAreaMode ? (category.earnedAreasCnt ?? 0) : category.earnedCredits}
              required={isAreaMode ? (category.requiredAreasCnt ?? 0) : category.requiredCredits}
              size="medium"
            />
          </Flex>
        )}

        {renderBody()}

        <div className="w-full mt-auto flex gap-1">
          <div className="flex-1 [&>button]:w-full">
            <Button variant="outlined" size="small" onClick={handleViewEarnedCourses}>
              이수 과목
            </Button>
          </div>
          <div className="flex-1 [&>button]:w-full">
            <Button variant="outlined" size="small" onClick={handleViewCourses} disabled={!hasRecommendation}>
              추천 과목
            </Button>
          </div>
        </div>
      </Flex>
    </Card>
  );
}

export default CategoryProgressCard;
