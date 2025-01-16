const CourseList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">LOGO</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6 text-sm font-medium text-gray-700">
            <li className="border-b-2 border-blue-500 py-2">검색</li>
            <li className="py-2 hover:text-blue-500 cursor-pointer">핀 목록</li>
            <li className="py-2 hover:text-blue-500 cursor-pointer">교양과목</li>
            <li className="py-2 hover:text-blue-500 cursor-pointer">전공과목</li>
          </ul>
        </div>
      </nav>

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
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
            <tr>
              <th className="p-4">핀</th>
              <th className="p-4">과목코드</th>
              <th className="p-4">과목명</th>
              <th className="p-4">담당교수</th>
              <th className="p-4">학점</th>
              <th className="p-4">여석</th>
              <th className="p-4">최근 갱신</th>
            </tr>
            </thead>
            <tbody>
            <tr className="border-b">
              <td className="p-4">📌</td>
              <td className="p-4">CS101</td>
              <td className="p-4">프로그래밍 기초</td>
              <td className="p-4">김교수</td>
              <td className="p-4">3</td>
              <td className="p-4 text-green-500">2</td>
              <td className="p-4">1분 전</td>
            </tr>
            <tr>
              <td className="p-4">📌</td>
              <td className="p-4">BA201</td>
              <td className="p-4">경영학원론</td>
              <td className="p-4">이교수</td>
              <td className="p-4">3</td>
              <td className="p-4 text-red-500">0</td>
              <td className="p-4">방금 전</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 bg-white text-center text-sm text-gray-500 py-4">
        © 2024 수강신청 시스템. All rights reserved.
      </footer>
    </div>
  );
};

export default CourseList;
