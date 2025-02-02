import { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import CardWrap from "@/components/CardWrap";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function WishesDetail() {
  const [selectedFilter, setSelectedFilter] = useState("전공/비전공");

  // 학과별 관심도 (도넛 차트)
  const departmentData = {
    labels: ["컴퓨터공학과", "정보통신공학과", "소프트웨어학과", "기타"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"],
      },
    ],
  };

  // 학년별 관심도 (막대 그래프)
  const gradeData = {
    labels: ["4학년", "3학년", "2학년", "1학년"],
    datasets: [
      {
        data: [50, 40, 25, 20],
        backgroundColor: "#60A5FA",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Info Section */}
      <div className="p-6 max-w-5xl mx-auto">

      <CardWrap>
          <h1 className="text-2xl font-bold">데이터베이스 설계</h1>
          <p className="text-gray-600">CSE3010-01 | 컴퓨터공학과 | 김교수</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
            📘 에브리타임 수강평 보기
          </button>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Doughnut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">학과별 관심도</h2>
                <select className="border px-3 py-1 rounded-md" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                  <option>전공/비전공</option>
                </select>
              </div>
              <Doughnut data={departmentData} />
            </div>

            {/* Competition Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">관심과목 경쟁률 예상</h2>
              <p className="text-red-500 font-bold text-xl">총 135명</p>
              <p className="text-sm text-gray-500">작년 대비 관심도 20% 증가 → 경쟁 치열할 가능성 높음</p>
              <div className="mt-4">
                <Bar data={gradeData} />
              </div>
            </div>
          </div>

          {/* Alternative Course Table */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">대체과목 추천</h2>
            <table className="w-full mt-4">
              <thead>
              <tr className="border-b bg-gray-100 text-gray-600 text-left text-sm">
                <th className="p-3">과목명</th>
                <th className="p-3">학수번호-분반</th>
                <th className="p-3">담당교수</th>
                <th className="p-3">여석</th>
              </tr>
              </thead>
              <tbody>
              <tr className="border-b text-sm">
                <td className="p-3">데이터베이스 설계</td>
                <td className="p-3">CSE3010-02</td>
                <td className="p-3">이교수</td>
                <td className="p-3">5</td>
              </tr>
              <tr className="border-b text-sm">
                <td className="p-3">데이터베이스 설계</td>
                <td className="p-3">CSE3010-03</td>
                <td className="p-3">박교수</td>
                <td className="p-3">3</td>
              </tr>
              </tbody>
            </table>
          </div>
      </CardWrap>
      </div>

    </div>
  );
}

export default WishesDetail;