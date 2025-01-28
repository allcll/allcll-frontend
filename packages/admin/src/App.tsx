import { useState } from "react";
import { Search, Upload } from "lucide-react";

const courses = [
  { code: "CS101", name: "컴퓨터프로그래밍", professor: "김교수", credit: 3, type: "전공필수", time: "월,수 10:00-11:30", seats: 30 },
  { code: "MA201", name: "미적분학", professor: "이교수", credit: 3, type: "전공필수", time: "화,목 13:00-14:30", seats: 25 },
  { code: "PH101", name: "일반물리학", professor: "박교수", credit: 3, type: "전공필수", time: "화,목 09:00-10:30", seats: 40 },
  { code: "CH101", name: "일반화학", professor: "최교수", credit: 3, type: "전공필수", time: "월,수 11:00-12:30", seats: 35 },
  { code: "BI101", name: "생물학개론", professor: "정교수", credit: 3, type: "전공선택", time: "화,목 15:00-16:30", seats: 20 },
  { code: "EN101", name: "영어회화", professor: "이교수", credit: 2, type: "교양필수", time: "월,수 14:00-15:00", seats: 50 },
  { code: "EC101", name: "경제학원론", professor: "김교수", credit: 3, type: "전공선택", time: "화,목 10:00-11:30", seats: 45 },
  { code: "PS101", name: "정치학개론", professor: "박교수", credit: 3, type: "전공선택", time: "월,수 13:00-14:30", seats: 30 },
  { code: "HI101", name: "한국사", professor: "최교수", credit: 3, type: "교양선택", time: "화,목 11:00-12:30", seats: 40 },
  { code: "AR101", name: "미술사", professor: "정교수", credit: 3, type: "교양선택", time: "월,수 15:00-16:30", seats: 25 },
];

function App() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-md hidden md:block">
        <h2 className="text-lg font-bold mb-4">LOGO</h2>
        <nav>
          <ul>
            <li className="text-blue-600 font-semibold">📌 과목 관리</li>
            <li className="text-gray-500 mt-2">📍 핀 현황</li>
            <li className="text-gray-500 mt-2">🐞 버그 및 제보</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">과목 관리</h1>
          <div className="flex space-x-4">
            <button className="text-gray-600">관리자</button>
            <button className="text-gray-600">🔄 로그아웃</button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">과목 데이터 업로드</h2>
          <div className="flex space-x-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <Upload className="w-4 h-4 mr-2" /> 엑셀 업로드
            </button>
            <button className="bg-blue-100 text-blue-500 px-4 py-2 rounded">
              📄 템플릿 다운로드
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="과목명, 교수명으로 검색"
            className="w-full outline-none"
          />
          <select className="ml-4 border px-3 py-2 rounded">
            <option>전체 학과</option>
          </select>
        </div>

        {/* Course Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">과목코드</th>
              <th>과목명</th>
              <th>담당교수</th>
              <th>학점</th>
              <th>이수구분</th>
              <th>강의시간</th>
              <th>여석</th>
            </tr>
            </thead>
            <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{course.code}</td>
                <td>{course.name}</td>
                <td>{course.professor}</td>
                <td>{course.credit}</td>
                <td>{course.type}</td>
                <td>{course.time}</td>
                <td>{course.seats}</td>
              </tr>
            ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button className="px-3 py-1 border rounded-l">이전</button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1 border rounded-r">다음</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;