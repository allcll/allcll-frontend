import BlurComponents from '@/shared/ui/BlurComponents.tsx';
import { BarChart } from '@/shared/ui/charts/BarChart';

// 학년별 관심도 (막대 그래프)
const gradeData = {
  labels: ['4학년', '3학년', '2학년', '1학년'],
  datasets: [
    {
      data: [50, 40, 25, 20],
      backgroundColor: '#60a5fa',
    },
  ],
};

function WishesBarChart() {
  return (
    <BlurComponents>
      <p className="text-sm text-gray-500">작년 대비 관심도 20% 증가 → 경쟁 치열할 가능성 높음</p>
      <div className="mt-4">
        <BarChart data={gradeData} />
      </div>
    </BlurComponents>
  );
}

export default WishesBarChart;
