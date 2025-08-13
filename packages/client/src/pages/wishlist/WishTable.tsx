import { useDeferredValue } from 'react';
import { Helmet } from 'react-helmet';
import useWishes, { InitWishes } from '@/hooks/server/useWishes.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import Table from '@/components/wishTable/Table.tsx';
import Searches from '@/components/live/Searches.tsx';
import useFavorites from '@/store/useFavorites.ts';
import useWishSearchStore from '@/store/useWishSearchStore.ts';
import TableColorInfo from '@/components/wishTable/TableColorInfo.tsx';
import useSearchRank from '@/hooks/useSearchRank.ts';
import { useJoinPreSeats } from '@/hooks/joinSubjects.ts';

function WishTable() {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 관심과목 분석</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 md:px-16 mb-8">
        {/* Header */}
        <div className="py-12 px-2">
          <h1 className="text-2xl font-bold">관심과목 분석</h1>
          <p className="text-gray-500 mt-2">
            올클은 세종대학교의 <span className="text-blue-500 font-bold">실제 데이터</span>를 보여드립니다. 관심과목을
            선택하여 분석해보세요.
          </p>

          {/* Search and Filter */}
          <Searches />
          <TableColorInfo />

          <WishTableComponent />
        </div>
      </div>
    </>
  );
}

function WishTableComponent() {
  const filterParams = useWishSearchStore(state => state.searchParams);
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const isPinned = useWishSearchStore(state => state.isPinned);
  const { data: wishes, isPending } = useWishes();
  const data = useSearchRank(useJoinPreSeats(wishes, InitWishes));

  const filteredData = useDeferredValue(
    useFilteringSubjects({
      subjects: data ?? [],
      pickedFavorites,
      searchKeywords: filterParams.searchInput,
      selectedDepartment: filterParams.selectedDepartment,
      isFavorite: filterParams.isFavorite,
      isPinned,
    }),
  );

  return (
    <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
      <Table data={filteredData} isPending={isPending} />
    </div>
  );
}

export default WishTable;
