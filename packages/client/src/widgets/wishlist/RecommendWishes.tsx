import Table from '@/widgets/wishlist/Table';
import { WishesInfo } from '@/shared/model/types';
import useRecommendWishes from '@/entities/subjectAggregate/model/useRecommendWishes.ts';
import { Heading, SupportingText } from '@allcll/allcll-ui';

interface RecommendWishesProps {
  wishesInfo: WishesInfo;
}

function RecommendWishes({ wishesInfo }: RecommendWishesProps) {
  return (
    <>
      <Heading level={2} className="mt-2">
        대체과목 추천
      </Heading>
      <SupportingText>학수번호가 같은 과목을 알려드려요</SupportingText>

      <div className="overflow-x-auto">
        <RecommendationTable wishesInfo={wishesInfo} />
      </div>
    </>
  );
}

// Todo: 대체 과목 테이블, WishesTable 컴포넌트 합칠 수 있는지 확인
// 대체과목 테이블 컴포넌트
interface IRecommendationTableProps {
  wishesInfo: WishesInfo;
}

function RecommendationTable({ wishesInfo }: IRecommendationTableProps) {
  const { data: recommend } = useRecommendWishes(wishesInfo);
  const placeholder = { title: '추천할 대체 과목이 없습니다.' };

  return <Table data={recommend ?? []} placeholder={placeholder} />;
}

export default RecommendWishes;
