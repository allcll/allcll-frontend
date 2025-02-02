import {useState} from 'react';
import {Link} from 'react-router-dom';
import SearchSvg from '@/assets/search.svg?react';
import StarSvg from '@/assets/star.svg?react';
import useWishes from '@/hooks/server/useWishes.ts';

function WishTable() {
  const [favorite, setFavorite] = useState([98765432]);
  const [selectedDepartment, setSelectedDepartment] = useState('전체 학과');
  const {data, isPending} = useWishes();

  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">

        {/* Header */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">수강신청 관심과목 분석</h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row md:items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-1/2">
              <SearchSvg className="absolute left-3 top-3 text-gray-500"/>
              <input type="text" placeholder="과목명 또는 교수명 검색" className="pl-10 pr-4 py-2 border rounded-md w-full"/>
            </div>
            <select
              className="border px-4 py-2 rounded-md"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option>전체 학과</option>
              <option>컴퓨터공학과</option>
            </select>
            <button className="border px-4 py-2 rounded-md flex items-center">
              <StarSvg className="w-4 h-4 mr-1"/> 즐겨찾기만 보기
            </button>
          </div>

          {/* Course Table */}
          <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
              <tr className="border-b bg-gray-100 text-gray-600 text-left text-sm">
                <th className="p-3">즐겨찾기</th>
                <th className="p-3">학수번호</th>
                <th className="p-3">분반</th>
                <th className="p-3">개설 학과</th>
                <th className="p-3">과목명</th>
                <th className="p-3">교수명</th>
                <th className="p-3">관심</th>
                <th className="p-3">시간</th>
              </tr>
              </thead>
              <tbody>
              {isPending ? (
                <tr>
                  <td colSpan={9} className="p-3 text-center">Loading...</td>
                </tr>
              ) : (
                data && data.Baskets.map((course) => (
                  <tr key={course.subjectId} className="border-b text-sm">
                    <td className="p-3">
                      <button onClick={() =>
                        setFavorite((prev) =>
                          prev.includes(course.subjectId) ? prev.filter(id => id !== course.subjectId) : [...prev, course.subjectId]
                        )
                      }>
                        <StarSvg
                          className={`w-5 h-5 ${favorite.includes(course.subjectId) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}/>
                      </button>
                    </td>
                    <td className="p-3">{course.subjectCode}</td>
                    <td className="p-3">{course.classCode}</td>
                    <td className="p-3">{course.departmentCode}</td>
                    <td className="p-3">
                      <Link to={`/wishes/${course.subjectId}`}>
                        {course.subjectName}
                      </Link>
                    </td>
                    <td className="p-3">{course.professorName}</td>
                    <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${course.totalCount >= 40 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                      {course.totalCount}
                    </span>
                    </td>
                    <td className="p-3">시간표</td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishTable;
