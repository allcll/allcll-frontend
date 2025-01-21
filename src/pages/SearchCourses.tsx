import Navbar from '@/components/Navbar.tsx';
import SubjectTable from '@/components/subjectTable/SubjectTable.tsx';
import CardWrap from '@/components/CardWrap.tsx';


const SearchCourses = () => {
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
          <SubjectTable/>
        </CardWrap>
      </div>
    </div>
  );
};

export default SearchCourses;
