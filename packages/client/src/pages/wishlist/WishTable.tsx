import { useDeferredValue } from 'react';
import { Helmet } from 'react-helmet';
import Table from '@/widgets/wishlist/Table.tsx';
import WishFilter from '@/widgets/filtering/ui/WishFilter';
import GotoLive from '@/widgets/wishlist/GotoLive.tsx';
import TableColorInfo from '@/shared/ui/TableColorInfo';
import useSearchRank from '@/features/filtering/lib/useSearchRank.ts';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects.ts';
import useWishes, { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { useJoinPreSeats } from '@/entities/subjectAggregate/lib/joinSubjects.ts';
import { useWishSearchStore } from '@/shared/model/useFilterStore.ts';
import ScrollToTopButton from '@/shared/ui/ScrollTopButton.tsx';
import { Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';

function WishTable() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 관심과목 분석</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 md:px-16 mb-8 min-h-screen">
        <Heading level={1} className="mt-2">
          관심과목 분석
        </Heading>
        <SupportingText>
          올클은 세종대학교의 <span className="text-blue-500 font-bold">실제 데이터</span>를 보여드립니다. 관심과목을
          선택하여 분석해보세요.
        </SupportingText>

        <Flex gap="gap-4" direction="flex-col" className="mt-6">
          <Card>
            <GotoLive />
            <WishFilter />
            <TableColorInfo />
          </Card>

          <Card variant="elevated" className="mt-6 overflow-x-auto">
            <WishTableComponent />
          </Card>

          <ScrollToTopButton right="right-2 sm:right-20" />
        </Flex>
      </div>
    </>
  );
}

function WishTableComponent() {
  const { data: wishes, isPending } = useWishes();
  const data = useSearchRank(useJoinPreSeats(wishes, InitWishes));

  const filters = useWishSearchStore(state => state.filters);
  const filteredData = useDeferredValue(useFilteringSubjects(data ?? [], filters));

  const placeholder = {
    title: '검색 결과가 없습니다.',
    description: '다른 검색어로 다시 시도해보세요.',
  };

  return <Table data={filteredData} isPending={isPending} placeholder={placeholder} />;
}

export default WishTable;
