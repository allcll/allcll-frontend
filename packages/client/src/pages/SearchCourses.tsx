import {disassemble} from "es-hangul";
import {useEffect, useState} from "react";
import Navbar from "@/components/Navbar.tsx";
import CardWrap from "@/components/CardWrap.tsx";
import SubjectTable from "@/components/subjectTable/SubjectTable.tsx";
import SubjectCards from "@/components/subjectTable/SubjectCards.tsx";
import useMobile from "@/hooks/useMobile.ts";
import useWishes from "@/hooks/server/useWishes.ts";
import {Subject, Wishes} from "@/utils/types.ts";


const TableHeadTitles = [
  {title: "핀", key: "pin"},
  {title: "과목코드", key: "code"},
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

  const [filteredData, setFilteredData] = useState<Subject[]>([]);
  const {data: wishes, isPending} = useWishes();

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

    const subjects: Subject[] = filtered.map((wishes) => {
      return {
        subjectId: wishes.subjectId,
        subjectCode: wishes.subjectCode,
        classCode: wishes.classCode,
        professorName: wishes.professorName ?? '',
        subjectName: wishes.subjectName,
      }
    });

    setFilteredData(subjects);
  }, [wishes, search]);

  const onSearch = (searchOption: string, searchKeyword: string) => {
    setSearch({searchOption, searchKeyword});
  }


  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">
        <Navbar/>

        {/* Search Section */}
        <CardWrap>
          <SubjectSearchInputs onSearch={onSearch}/>
        </CardWrap>

        {/* Course List */}
        <CardWrap>
          {isMobile ? (
            <SubjectCards subjects={filteredData} isPending={isPending}/>
          ) : (
            <SubjectTable titles={TableHeadTitles} subjects={filteredData} isPending={isPending}/>
          )}
        </CardWrap>
      </div>
    </div>
  );
};

interface ISubjectSearchInputs {
  onSearch: (searchOption: string, searchKeyword: string) => void;
}

function SubjectSearchInputs({onSearch}: ISubjectSearchInputs) {
  const [searchOption, setSearchOption] = useState<string>(SearchOptions[0].value);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  useEffect(() => {
    if (!onSearch) return;

    const handler = setTimeout(() => {
      onSearch(searchOption, searchKeyword);
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchOption, searchKeyword, onSearch]);

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
      <select className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4"
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
