import { Helmet } from 'react-helmet';
import React, { useDeferredValue, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import SubjectTable from '@/components/live/subjectTable/SubjectTable.tsx';
import SearchBox from '@/components/common/SearchBox.tsx';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import useWishesPreSeats from '@/hooks/useWishesPreSeats.ts';
import useMobile from '@/hooks/useMobile.ts';
import useAlarmSearchStore from '@/store/useAlarmSearchStore.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import DepartmentFilter from '@/components/live/DepartmentFilter';
import ScrollToTopButton from '@/components/common/ScrollTopButton';
import SubjectCards from '@/components/live/subjectTable/SubjectCards';
import useSearchRank from '@/hooks/useSearchRank';
import TableColorInfo from '@/components/wishTable/TableColorInfo';
import usePreSeatGate from '@/hooks/usePreSeatGate';
import ServiceSoon from '@/components/live/errors/ServiceSoon';

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

const PreSeatBody = ({ search, isMobile }: { search: ISubjectSearch; isMobile: boolean }) => {
  const { data: wishes, titles, isPending, hasRealSeats } = useWishesPreSeats(TableHeadTitles);
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasRealSeats });

  const data = useSearchRank(wishes);

  const filteredData = useDeferredValue(
    useFilteringSubjects({
      subjects: data ?? [],
      searchKeywords: search.searchKeyword,
      selectedDays: [],
      selectedDepartment: search.selectedDepartment,
      selectedGrades: [],
      isPinned: search.isAlarmWish,
    }),
  );

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

  const setIsSearchOpen = useAlarmSearchStore(state => state.setIsSearchOpen);
  const [search, setSearch] = useState<ISubjectSearch>({
    searchKeyword: '',
    isAlarmWish: false,
    selectedDepartment: '',
  });

  useEffect(() => {
    if (isMobile) {
      setIsSearchOpen(true);
    }
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
              <SubjectSearchInputs setSearch={setSearch} />
              <TableColorInfo />
            </CardWrap>
          </div>

          <PreSeatBody search={search} isMobile={isMobile} />

          <ScrollToTopButton right="right-2 sm:right-10" />
        </div>
      </div>
    </>
  );
};

interface ISubjectSearchInputs {
  setSearch: React.Dispatch<React.SetStateAction<ISubjectSearch>>;
}

function SubjectSearchInputs({ setSearch }: Readonly<ISubjectSearchInputs>) {
  const searchKeyword = useAlarmSearchStore(state => state.searchKeyword);
  const setSearchKeyword = useAlarmSearchStore(state => state.setSearchKeyword);
  const isAlarmWish = useAlarmSearchStore(state => state.isAlarmWish);
  const toggleAlarmWish = useAlarmSearchStore(state => state.toggleAlarmWish);
  const selectedDepartment = useAlarmSearchStore(state => state.selectedDepartment);
  const setSelectedDepartment = useAlarmSearchStore(state => state.setSelectedDepartment);

  useEffect(() => {
    if (!setSearch) return;

    const handler = setTimeout(() => {
      setSearch({ searchKeyword, isAlarmWish, selectedDepartment });
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword, setSearch, selectedDepartment]);

  useEffect(() => {
    setSearch({ searchKeyword, isAlarmWish, selectedDepartment });
  }, [isAlarmWish, selectedDepartment]);

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
      <label className="hidden" htmlFor="searchOption">
        검색 옵션
      </label>
      <SearchBox
        type="text"
        placeholder="과목명 또는 교수명 검색"
        value={searchKeyword}
        onDelete={() => setSearchKeyword('')}
        onChange={e => setSearchKeyword(e.target.value)}
      />

      <DepartmentFilter value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} />
      <button
        className="px-4 py-2 rounded-md flex gap-2 items-center text-nowrap border border-gray-400 hover:bg-white cursor-pointer"
        onClick={toggleAlarmWish}
      >
        <AlarmIcon disabled={!isAlarmWish} />
        알림과목
      </button>
    </div>
  );
}

export default PreSeat;
