import { useDeferredValue } from 'react';
import { Helmet } from 'react-helmet';
import useWishes, { InitWishes } from '@/hooks/server/useWishes.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import Table from '@/components/wishTable/Table.tsx';
import Searches from '@/components/live/Searches.tsx';
import { useWishSearchStore } from '@/store/useFilterStore.ts';
import TableColorInfo from '@/components/wishTable/TableColorInfo.tsx';
import useSearchRank from '@/hooks/useSearchRank.ts';
import { useJoinPreSeats } from '@/hooks/joinSubjects.ts';
import ScrollToTopButton from '@/components/common/ScrollTopButton';
import { NavLink } from 'react-router-dom';
import useAlarmModalStore from '@/store/useAlarmModalStore.ts';
import AlarmIcon from '@/shared/ui/svgs/AlarmIcon';
import { Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';

function WishTable() {
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);

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
            <NavLink
              to="/live"
              onClick={() => setIsSearchOpen(true)}
              state={{ openSearch: true }}
              className="inline-flex items-center gap-2 rounded-md border border-blue-500 px-3 py-2 text-sm text-blue-500 hover:bg-blue-50"
            >
              <AlarmIcon />
              알림등록하러가기
            </NavLink>

            <Searches />
            <TableColorInfo />
          </Card>

          <WishTableComponent />

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

  return (
    <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
      <Table data={filteredData} isPending={isPending} />
    </div>
  );
}

export default WishTable;
