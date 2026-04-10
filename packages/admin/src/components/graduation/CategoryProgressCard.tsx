import { Card, Flex } from '@allcll/allcll-ui';
import ProgressDoughnut from './ProgressDoughnut';
import type { AdminGraduationViewResponse } from '@/hooks/server/graduation/useAdminGraduationView';

type CategoryProgress = AdminGraduationViewResponse['checkData']['categories'][number];

interface CategoryProgressCardProps {
  category: CategoryProgress;
  label: string;
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

function CategoryProgressCard({ category, label }: Readonly<CategoryProgressCardProps>) {
  const isBalance = category.categoryType === 'BALANCE_REQUIRED' && category.requiredAreasCnt != null;
  const doughnutEarned = isBalance ? (category.earnedAreasCnt ?? 0) : category.earnedCredits;
  const doughnutRequired = isBalance ? (category.requiredAreasCnt ?? 0) : category.requiredCredits;

  return (
    <Card variant="outlined" className="h-full">
      <Flex direction="flex-col" gap="gap-2" className="h-full">
        <div className="text-center">
          <span className="text-lg font-bold">{label}</span>
        </div>

        <Flex justify="justify-center">
          <ProgressDoughnut earned={doughnutEarned} required={doughnutRequired} size="medium" />
        </Flex>

        {isBalance ? <BalanceInfo category={category} /> : <CreditInfo category={category} />}
      </Flex>
    </Card>
  );
}

export default CategoryProgressCard;
