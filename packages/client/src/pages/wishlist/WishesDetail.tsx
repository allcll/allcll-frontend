import {useMemo, useState} from 'react';
import { useParams } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import CardWrap from "@/components/CardWrap";
import BlurComponents from "@/components/BlurComponents";
import Table from "@/components/wishTable/Table";
import useDetailWishes from '@/hooks/server/useDetailWishes';
import useRecommendWishes from '@/hooks/server/useRecommendWishes';
import useDetailRegisters, {getDoughnutData} from '@/hooks/server/useDetailRegisters';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

function WishesDetail() {
  const params = useParams();
  const [selectedFilter, setSelectedFilter] = useState("전공/비전공");
  const {data, isPending} = useDetailWishes(params.id ?? "-1");
  const {data: registers} = useDetailRegisters(params.id ?? "-1");

  const doughnut = useMemo(() => getDoughnutData(registers), [registers, params]);
  const {data: recommend} = useRecommendWishes(data?.subjectCode ?? "")

  // Todo: 대체 과목 추천
  // Todo: 에브리타임 수강평 보기 - 링크 크롤링
  // Todo: 전공/비전공, 단과대 보기 -> 소속 학과 알아내기
  // Todo: 색상 선정 및 알고리즘 개발

  if (isPending || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }
  //data.everytimeLink

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Info Section */}
      <div className="p-6 max-w-5xl mx-auto">

      <CardWrap>
          <h1 className="text-2xl font-bold">{data.subjectName}</h1>
          <p className="text-gray-600">{data.subjectCode}-{data.classCode} | {data.departmentName} | {data.professorName}</p>
          <a className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
             href="#" target="_blank">
            📘 에브리타임 수강평 보기
          </a>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Doughnut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">학과별 관심도</h2>
                <select className="border px-3 py-1 rounded-md"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}>
                  <option>전공/비전공</option>
                </select>
              </div>
              <Doughnut data={doughnut} />
            </div>

            {/* Competition Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">관심과목 경쟁률 예상</h2>
              <p className="text-red-500 font-bold text-xl">총 {data.totalCount}명</p>

              <BlurComponents>
                <p className="text-sm text-gray-500">작년 대비 관심도 20% 증가 → 경쟁 치열할 가능성 높음</p>
                <div className="mt-4">
                  <Bar data={gradeData} />
                </div>
              </BlurComponents>
            </div>
          </div>

          {/* Alternative Course Table */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">대체과목 추천</h2>

            <Table data={recommend ?? []}/>
          </div>
      </CardWrap>
      </div>

    </div>
  );
}

export default WishesDetail;