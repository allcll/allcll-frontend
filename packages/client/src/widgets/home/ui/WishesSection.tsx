import { Doughnut } from 'react-chartjs-2';
import Section from '@/widgets/home/ui/Section.tsx';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js/auto';
import { DoughnutColors } from '@/utils/doughnut.ts';
import SectionHeader from '@/widgets/home/ui/SectionHeader.tsx';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const doughnut = {
  labels: ['컴퓨터공학과', '정보통신공학과', '소프트웨어학과', '기타'],
  datasets: [
    {
      data: [40, 25, 20, 15],
      backgroundColor: DoughnutColors,
    },
  ],
};

function WishesSection() {
  return (
    <Section>
      <SectionHeader title="관심과목 분석" href="/wishes" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* 검색 창 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">학과별 관심도</h2>
          <div className="flex aligh-center justify-center max-h-96">
            <Doughnut data={doughnut} />
          </div>
        </div>

        {/* 대체 과목 추천 */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h3 className="text-lg font-semibold">대체 과목 추천</h3>
          {[
            { name: '데이터베이스개론', dept: '데이터베이스 시스템', status: '30명' },
            { name: '알고리즘분석', dept: '고급알고리즘', status: '14명' },
          ].map((course, index) => (
            <div
              key={'recommend-course-' + index}
              className="mt-4 flex justify-between p-2 rounded-md border border-gray-200"
            >
              <div>
                <p className="font-semibold">{course.name}</p>
                <p className="text-sm text-gray-500">{course.dept}</p>
              </div>
              <span className="text-yellow-500">{course.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default WishesSection;
