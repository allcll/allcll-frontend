import { Helmet } from 'react-helmet';
import { useDeferredValue } from 'react';
import CardWrap from '@/components/CardWrap.tsx';
import SubjectTable from '@/components/live/subjectTable/SubjectTable.tsx';
import useMobile from '@/hooks/useMobile.ts';
import useSearchRank from '@/hooks/useSearchRank';
import useWishesPreSeats from '@/hooks/useWishesPreSeats.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import { PRESEAT_CLOSE_DATE } from '@/hooks/usePreSeatGate.ts';
import { Filters, useAlarmSearchStore } from '@/store/useFilterStore.ts';
import ScrollToTopButton from '@/components/common/ScrollTopButton';
import SubjectCards from '@/components/live/subjectTable/SubjectCards';
import TableColorInfo from '@/components/wishTable/TableColorInfo';
import SubjectSearches from './SubjectSearch';

const TableHeadTitles = [
  { title: '알림', key: 'pin' },
  { title: '학수번호', key: 'code' },
  { title: '개설학과', key: 'departmentName' },
  { title: '과목명', key: 'name' },
  { title: '담당교수', key: 'professor' },
];

export interface ISubjectSearch {
  searchKeyword: string;
  isAlarmWish: boolean;
  selectedDepartment: string;
}

const PreSeatBody = ({ isMobile, filters }: { isMobile: boolean; filters: Filters }) => {
  const { data: wishes, titles, isPending } = useWishesPreSeats(TableHeadTitles);
  const data = useSearchRank(wishes);
  const filteredData = useDeferredValue(useFilteringSubjects(data ?? [], filters));

  return (
    <CardWrap>
      {isMobile ? (
        <SubjectCards subjects={filteredData} isPending={isPending} isLive={true} />
      ) : (
        <SubjectTable titles={titles} subjects={filteredData} isPending={isPending} />
      )}
    </CardWrap>
  );
};

const PreSeat = () => {
  const isMobile = useMobile();

  const filters = useAlarmSearchStore(state => state.filters);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 전체 여석</title>
      </Helmet>

      <div className="container mx-auto">
        <h2 className="font-bold text-lg">전체학년 여석</h2>
        <p className="text-xs font-bold text-gray-500">전체 학년 수강신청 전, 전체 학년의 여석을 보여줍니다.</p>
        <p className="text-xs text-gray-500 mb-4">실시간 기능은 {PRESEAT_CLOSE_DATE}, 11:00에 시작될 예정입니다.</p>
        <div className="pb-2">
          <CardWrap>
            <SubjectSearches />
            <TableColorInfo />
          </CardWrap>
        </div>
        <PreSeatBody isMobile={isMobile} filters={filters} />
        <ScrollToTopButton right="right-2 sm:right-10" />
      </div>
    </>
  );
};

export default PreSeat;
