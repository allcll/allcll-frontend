import React, {useEffect, useState} from "react";
import {disassemble} from "es-hangul";
import Navbar from "@/components/Navbar.tsx";
import CardWrap from "@/components/CardWrap.tsx";
import SubjectTable from "@/components/subjectTable/SubjectTable.tsx";
import SubjectCards from "@/components/subjectTable/SubjectCards.tsx";
import useWishesPreSeats from "@/hooks/useWishesPreSeats.ts";
import useMobile from "@/hooks/useMobile.ts";
import {Wishes} from "@/utils/types.ts";


const TableHeadTitles = [
  {title: "핀", key: "pin"},
  {title: "과목코드", key: "code"},
  {title: "개설학과", key: "departmentName"},
  {title: "과목명", key: "name"},
  {title: "담당교수", key: "professor"},
  // {title: "학점", key: "credits"}
];

const SearchOptions = [
  {name: "과목명", value: "subjectName"},
  {name: "교수명", value: "professorName"}
];

type ISubjectSearch = Record<string, string>

const SearchCourses = () => {
  const isMobile = useMobile();

  const [search, setSearch] = useState<ISubjectSearch>({searchOption: SearchOptions[0].value, searchKeyword: ''});

  const {data: wishes, titles, isPending} = useWishesPreSeats(TableHeadTitles);

  const [filteredData, setFilteredData] = useState<Wishes[]>([]);

  useEffect(() => {
    const filtered = wishes?.filter((wish) => {
      const target = wish[search.searchOption as keyof Wishes] ?? "";
      const keyword = search.searchKeyword;

      const cleanTarget = target.toString().replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').toLowerCase();
      const cleanKeyword = keyword.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '').toLowerCase();

      const disassembledTarget = disassemble(cleanTarget);
      const disassembledKeyword = disassemble(cleanKeyword);

      return disassembledTarget.includes(disassembledKeyword);
    }) ?? [];

    setFilteredData(filtered);
  }, [wishes, search]);


  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">
        <Navbar/>

        {/* Search Section */}
        <CardWrap>
          <SubjectSearchInputs setSearch={setSearch}/>
        </CardWrap>

        <p className="text-sm text-gray-600 mb-4 italic">
          1학년과목은, 신입생 수강 여석이 아직 제외되지 않았을 수 있습니다! 이 점 양해하고 봐주세요
        </p>

        {/* Course List */}
        <CardWrap>
          {isMobile ? (
            <SubjectCards subjects={filteredData} isPending={isPending}/>
          ) : (
            <SubjectTable titles={titles} subjects={filteredData} isPending={isPending}/>
          )}
        </CardWrap>
      </div>
    </div>
  );
};

interface ISubjectSearchInputs {
  setSearch: React.Dispatch<React.SetStateAction<ISubjectSearch>>;
}

function SubjectSearchInputs({setSearch}: ISubjectSearchInputs) {
  const [searchOption, setSearchOption] = useState<string>(SearchOptions[0].value);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  useEffect(() => {
    if (!setSearch) return;

    const handler = setTimeout(() => {
      setSearch({searchOption, searchKeyword});
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchOption, searchKeyword, setSearch]);

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
      <label className="hidden" htmlFor="searchOption">검색 옵션</label>
      <select className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4"
              id="searchOption"
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}>
        { SearchOptions.map(({name, value}) => (
          <option key={value} value={value}>{name}</option>
        ))
        }
      </select>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className="flex-1 border border-gray-300 rounded-lg p-2"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
    </div>
  );
}

export default SearchCourses;
