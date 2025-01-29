import {useState} from "react";
import Navbar from '@/components/Navbar.tsx';
import SubjectTable from '@/components/subjectTable/SubjectTable.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import SubjectCards from '@/components/subjectTable/SubjectCards.tsx';
import useMobile from '@/hooks/useMobile.ts';
import {useSearchSubject} from '@/store/useSearchSubject.ts';


const TableHeadTitles = [
  {title: '핀', key: 'pin'},
  {title: '과목코드', key: 'code'},
  {title: '과목명', key: 'name'},
  {title: '담당교수', key: 'professor'},
  {title: '학점', key: 'credits'}
];

const SearchOptions = [
  {name: '과목명', value: 'subjectName'},
  {name: '교수명', value: 'professorName'},
  {name: '학점', value: 'credits'},
];

type ISubjectSearch = Record<string, string>

const SearchCourses = () => {
  const isMobile = useMobile();

  const [search, setSearch] = useState<ISubjectSearch>({searchOption: SearchOptions[0].value, searchKeyword: ''});
  const {data: searchedData, isPending} = useSearchSubject(search);

  const onSearch = (searchOption: string, searchKeyword: string) => {
    setSearch({[searchOption]: searchKeyword});
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
          {isPending ? (
            <p>Loading...</p>
          ) : isMobile ? (
            searchedData && <SubjectCards subjects={searchedData}/>
          ) : (
            searchedData && <SubjectTable titles={TableHeadTitles} subjects={searchedData}/>
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

  function search() {
    onSearch(searchOption, searchKeyword);
  }

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
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={search}>검색</button>
    </div>
  );
}

export default SearchCourses;
