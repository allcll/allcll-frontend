import Navigation from "@/components/Navigation";
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';
import SubjectTable from '@/components/subjectTable/SubjectTable.tsx';

const CourseList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <Navigation/>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white shadow-sm p-4 rounded-lg">
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
        </div>
      </div>

      {/* Course List */}
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg">
          <SubjectTable/>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default CourseList;
