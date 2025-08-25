import { Helmet } from 'react-helmet';
import { useDeferredValue, useEffect } from 'react';
import Navbar from '@/components/Navbar.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import SubjectTable from '@/components/live/subjectTable/SubjectTable.tsx';
import SearchBox from '@/components/common/SearchBox.tsx';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import useWishesPreSeats from '@/hooks/useWishesPreSeats.ts';
import useMobile from '@/hooks/useMobile.ts';
import { Filters, useAlarmSearchStore } from '@/store/useFilterStore.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import DepartmentFilter from '@/components/live/DepartmentFilter';
import ScrollToTopButton from '@/components/common/ScrollTopButton';
import SubjectCards from '@/components/live/subjectTable/SubjectCards';
import useSearchRank from '@/hooks/useSearchRank';
import TableColorInfo from '@/components/wishTable/TableColorInfo';
import usePreSeatGate from '@/hooks/usePreSeatGate';
import ServiceSoon from '@/components/live/errors/ServiceSoon';
import useAlarmModalStore from '@/store/useAlarmModalStore.ts';

const TableHeadTitles = [
  { title: '알림', key: 'pin' },
  { title: '학수번호', key: 'code' },
  { title: '개설학과', key: 'departmentName' },
  { title: '과목명', key: 'name' },
  { title: '담당교수', key: 'professor' },
];

const PreSeatBody = ({ filters, isMobile }: Readonly<{ filters: Filters; isMobile: boolean }>) => {
  const { data: wishes, titles, isPending, hasRealSeats } = useWishesPreSeats(TableHeadTitles);
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasRealSeats });

  const data = useSearchRank(wishes);
  const filteredData = useDeferredValue(useFilteringSubjects(data ?? [], filters));

  return (
    <>
      <CardWrap>
        {isPreSeatAvailable ? (
          <>
            {isMobile ? (
              <SubjectCards subjects={filteredData} isPending={isPending} isLive={true} />
            ) : (
              <SubjectTable titles={titles} subjects={filteredData} isPending={isPending} />
            )}
          </>
        ) : (
          <div className="flex justify-center w-full h-96">
            <ServiceSoon title="전체 학년 여석" />
          </div>
        )}
      </CardWrap>
    </>
  );
};

const PreSeat = () => {
  const isMobile = useMobile();

  const filters = useAlarmSearchStore(state => state.filters);
  const setIsSearchOpen = useAlarmModalStore(state => state.setIsSearchOpen);

  useEffect(() => {
    if (isMobile) setIsSearchOpen(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 전체 여석</title>
      </Helmet>

      <div className="max-w-screen-xl mx-auto mb-8">
        <div className="container p-4 mx-auto">
          <Navbar />
          <p className="text-xs font-bold text-gray-500 mb-4">전체 학년 수강신청 전, 전체 학년의 여석을 보여줍니다.</p>
          <div className="pb-2">
            <CardWrap>
              <SubjectSearchInputs />
              <TableColorInfo />
            </CardWrap>
          </div>

          <PreSeatBody filters={filters} isMobile={isMobile} />

          <ScrollToTopButton right="right-2 sm:right-10" />
        </div>
      </div>
    </>
  );
};

function SubjectSearchInputs() {
  const { keywords, department, alarmOnly } = useAlarmSearchStore(state => state.filters);
  const setFilter = useAlarmSearchStore(state => state.setFilter);

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
      <label className="hidden" htmlFor="searchOption">
        검색 옵션
      </label>
      <SearchBox
        type="text"
        placeholder="과목명, 교수명 또는 학수번호 및 분반 검색"
        value={keywords}
        onDelete={() => setFilter('keywords', '')}
        onChange={e => setFilter('keywords', e.target.value)}
      />

      <DepartmentFilter value={department} onChange={e => setFilter('department', e.target.value)} />
      <button
        className="px-4 py-2 rounded-md flex gap-2 items-center text-nowrap border border-gray-400 hover:bg-white cursor-pointer"
        onClick={() => setFilter('alarmOnly', !alarmOnly)}
      >
        <AlarmIcon disabled={!alarmOnly} />
        알림과목
      </button>
    </div>
  );
}

export default PreSeat;
