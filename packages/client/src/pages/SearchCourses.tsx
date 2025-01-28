import Navbar from '@/components/Navbar.tsx';
import SubjectTable from '@/components/subjectTable/SubjectTable.tsx';
import CardWrap from '@/components/CardWrap.tsx';
import useMobile from '@/hooks/useMobile.ts';
import SubjectCards from '@/components/subjectTable/SubjectCards.tsx';
import {Subject} from '@/utils/types..ts';


const TableHeadTitles = [
  {title: '핀', key: 'pin'},
  {title: '과목코드', key: 'code'},
  {title: '과목명', key: 'name'},
  {title: '담당교수', key: 'professor'},
  {title: '학점', key: 'credits'}
];

const DummyTableData: Subject[] = [
  {id: 1, code: 'HU301', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 20},
  {id: 2, code: 'HU302', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 15},
  {id: 3, code: 'HU303', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 10},
  {id: 4, code: 'HU304', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 9},
  {id: 5, code: 'HU305', name: '현대문학의 이해', professor: '박교수', credits: 2, seats: 3},
];


const SearchCourses = () => {
  const isMobile = useMobile();

  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">
        <Navbar/>

        {/* Search Section */}
        <CardWrap>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <select className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4">
              <option>과목명</option>
              <option>교수명</option>
              <option>학점</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="flex-1 border border-gray-300 rounded-lg p-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">검색</button>
          </div>
        </CardWrap>

        {/* Course List */}
        <CardWrap>
          {isMobile ? (
            <SubjectCards subjects={DummyTableData}/>
          ) : (
            <SubjectTable titles={TableHeadTitles} subjects={DummyTableData}/>
          )}
        </CardWrap>
      </div>
    </div>
  );
};

export default SearchCourses;
