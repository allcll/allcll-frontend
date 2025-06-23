import { Helmet } from 'react-helmet';
import React, { useEffect, useState } from 'react';
import { disassemble } from 'es-hangul';
import Navbar from '@/components/Navbar.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import SubjectTable from '@/components/live/subjectTable/SubjectTable.tsx';
import SubjectCards from '@/components/live/subjectTable/SubjectCards.tsx';
import SearchBox from '@/components/common/SearchBox.tsx';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import useWishesPreSeats from '@/hooks/useWishesPreSeats.ts';
import useMobile from '@/hooks/useMobile.ts';
import { Wishes } from '@/utils/types.ts';
import { usePinned } from '@/store/usePinned.ts';
import useAlarmSearchStore from '@/store/useAlarmSearchStore.ts';

const TableHeadTitles = [
  { title: '핀', key: 'pin' },
  { title: '과목코드', key: 'code' },
  { title: '개설학과', key: 'departmentName' },
  { title: '과목명', key: 'name' },
  { title: '담당교수', key: 'professor' },
  // {title: "학점", key: "credits"}
];

export interface ISubjectSearch {
  searchKeyword: string;
  isAlarmWish: boolean;
}

const SearchCourses = () => {
  const isMobile = useMobile();

  const [search, setSearch] = useState<ISubjectSearch>({ searchKeyword: '', isAlarmWish: false });

  const { data: wishes, titles, isPending } = useWishesPreSeats(TableHeadTitles);
  const { data: pinnedSubjects } = usePinned();

  const [filteredData, setFilteredData] = useState<Wishes[]>([]);

  useEffect(() => {
    const cleanSearchInput = search.searchKeyword.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const disassembledSearchInput = disassemble(cleanSearchInput).toLowerCase();
    const matchesPinned = (id: number) => pinnedSubjects?.some(({ subjectId }) => subjectId === id);

    const filtered =
      wishes?.filter(wish => {
        const disassembledProfessorName = wish.professorName ? disassemble(wish.professorName).toLowerCase() : '';
        const cleanSubjectName = wish.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

        const matchesProfessor = disassembledProfessorName.includes(disassembledSearchInput);
        const matchesSubject = disassembledSubjectName.includes(disassembledSearchInput);
        const matchesFavorite = search.isAlarmWish ? matchesPinned(wish.subjectId) : true;

        return (matchesProfessor || matchesSubject) && matchesFavorite;
      }) ?? [];

    setFilteredData(filtered);
  }, [wishes, search]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 알림 과목 검색</title>
      </Helmet>

      <div className="max-w-screen-xl mx-auto mb-8">
        <div className="container p-4 mx-auto">
          <Navbar />

          {/* Search Section */}
          <CardWrap>
            <SubjectSearchInputs setSearch={setSearch} />
          </CardWrap>

          {/*<p className="text-sm text-gray-600 mb-4 italic">*/}
          {/*  1학년과목은, 신입생 수강 여석이 아직 제외되지 않았을 수 있습니다! 이 점 양해하고 봐주세요*/}
          {/*</p>*/}

          {/* Course List */}
          <CardWrap>
            {isMobile ? (
              <SubjectCards subjects={filteredData} isPending={isPending} />
            ) : (
              <SubjectTable titles={titles} subjects={filteredData} isPending={isPending} />
            )}
          </CardWrap>
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
  const isAlarmWish = useAlarmSearchStore(state => state.isAlarmWish);
  const setSearchKeyword = useAlarmSearchStore(state => state.setSearchKeyword);
  const toggleAlarmWish = useAlarmSearchStore(state => state.toggleAlarmWish);

  useEffect(() => {
    if (!setSearch) return;

    const handler = setTimeout(() => {
      setSearch({ searchKeyword, isAlarmWish });
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword, setSearch]);

  useEffect(() => {
    setSearch({ searchKeyword, isAlarmWish });
  }, [isAlarmWish]);

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

export default SearchCourses;
