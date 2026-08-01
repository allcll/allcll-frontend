import type { IWishesInfo } from '@/shared/model/types';
import useDetailWishes from '@/entities/subjectAggregate/model/useDetailWishes';
import { InitWishes } from '@/entities/wishes/model/useWishes';
import BlurComponents from '@/shared/ui/BlurComponents';
import { getWishesColor } from '@/shared/config/colors';
import { Flex, Heading } from '@allcll/allcll-ui';
import { BarChart } from '@allcll/charts';

interface IWishesBarChartProps {
  wishesInfo: IWishesInfo;
}

// 학년별 관심도 (막대 그래프)
const gradeData = {
  labels: ['4학년', '3학년', '2학년', '1학년'],
  datasets: [
    {
      data: [50, 40, 25, 20],
      backgroundColor: '#60a5fa',
    },
  ],
};

function WishesBarChart({ wishesInfo }: IWishesBarChartProps) {
  const { data: wishes } = useDetailWishes(wishesInfo);
  const data = wishes ?? InitWishes;
  const isWishesAvailable = wishes && 'totalCount' in wishes;

  return (
    <>
      <Flex gap="gap-2" align="items-center" className="mb-4">
        <Heading level={2}>관심과목 경쟁률 예상</Heading>
        {isWishesAvailable && (
          <p className={`${getWishesColor(data.totalCount ?? -1)} font-bold text-xl`}>총 {data.totalCount}명</p>
        )}
      </Flex>
      <BlurComponents>
        <p className="text-sm text-gray-500">작년 대비 관심도 20% 증가 → 경쟁 치열할 가능성 높음</p>
        <Flex direction="flex-col" className="mt-4">
          <BarChart data={gradeData} />
        </Flex>
      </BlurComponents>
    </>
  );
}

export default WishesBarChart;
