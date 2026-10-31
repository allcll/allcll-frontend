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
import { useWishSearchStore } from '@/features/filtering/model/useFilterStore.ts';
import ScrollToTopButton from '@/shared/ui/ScrollTopButton.tsx';
import { Card, Flex } from '@allcll/allcll-ui';
import PageContainer from '@/shared/ui/PageContainer';
import PageHeader from '@/shared/ui/PageHeader';

function WishTable() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 관심과목 분석</title>
        <meta name="description" content="세종대학교 관심과목의 실제 데이터를 분석해보세요." />
      </Helmet>

      <PageContainer className="min-h-screen">
        <PageHeader
          title="관심과목 분석"
          description={
            <>
              올클은 세종대학교의 <span className="text-primary-500 font-bold">실제 데이터</span>를 보여드립니다.
              관심과목을 선택하여 분석해보세요.
            </>
          }
        />

        <Flex gap="gap-4" direction="flex-col">
          <Card>
            <GotoLive />
            <WishFilter />
            <TableColorInfo />
          </Card>

          <Card variant="elevated" className="mt-6 overflow-x-auto">
            <WishTableComponent />
          </Card>

          <ScrollToTopButton />
        </Flex>
      </PageContainer>
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
