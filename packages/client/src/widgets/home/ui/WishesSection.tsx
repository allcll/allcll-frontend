import { Doughnut } from 'react-chartjs-2';
import Section from '@/widgets/home/ui/Section.tsx';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js/auto';
import { DoughnutColors } from '@/features/wish/lib/doughnut';
import SectionHeader from '@/widgets/home/ui/SectionHeader.tsx';
import BasketBadge from '@/entities/wishes/ui/BasketBadge.tsx';
import { Heading } from '@allcll/allcll-ui';

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
          <Heading level={3}>학과별 관심도</Heading>

          <div className="flex align-center justify-center max-h-96">
            <Doughnut data={doughnut} />
          </div>
        </div>

        {/* 대체 과목 추천 */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <Heading level={3}>대체 과목 추천</Heading>
          {[
            { name: '데이터베이스개론', dept: '데이터베이스 시스템', status: 30 },
            { name: '알고리즘분석', dept: '고급알고리즘', status: 14 },
          ].map((course, index) => (
            <div
              key={'recommend-course-' + index}
              className="mt-4 flex justify-between p-2 rounded-md border border-gray-200"
            >
              <div>
                <Heading level={4}>{course.name}</Heading>
                <p className="text-sm text-gray-500">{course.dept}</p>
              </div>
              <span>
                <BasketBadge wishCount={course.status} formatter={value => `관심: ${value}명`} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default WishesSection;
