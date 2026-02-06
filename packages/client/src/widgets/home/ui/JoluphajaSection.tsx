import { Badge, Card, colors, Flex, Heading } from '@allcll/allcll-ui';
import Section from './Section';
import SectionHeader from './SectionHeader';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

function JoluphajaSection() {
  return (
    <Section>
      <SectionHeader
        title="세종대 졸업 요건 검사"
        subtitle="세종대 졸업 요건 검사부터 과목 추천까지 도와드려요. 서비스가 곧 오픈될 예정이니, 조금만 기다려주세요."
      />

      <Badge variant="danger">새로 나온 서비스</Badge>

      <Flex className="mt-6" direction="flex-col" gap="gap-2">
        <Card>
          <Flex direction="flex-row" gap="gap-4">
            <Heading level={3}>졸업 요건 현황</Heading>
            <Badge variant="default">진행 중</Badge>
          </Flex>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 justify-items-center">
            <ProgressDoughnut
              earned={mockGraduationData.totalCredits.earned}
              required={mockGraduationData.totalCredits.required}
              label="전체 학점"
            />
            <ProgressDoughnut
              earned={mockGraduationData.majorCredits.earned}
              required={mockGraduationData.majorCredits.required}
              label="전필 학점"
            />
            <div className="hidden md:block">
              <ProgressDoughnut
                earned={mockGraduationData.generalCredits.earned}
                required={mockGraduationData.generalCredits.required}
                label="전선 학점"
              />
            </div>
            <div className="hidden md:block">
              <ProgressDoughnut
                earned={mockGraduationData.liberalCredits.earned}
                required={mockGraduationData.liberalCredits.required}
                label="교양 학점"
              />
            </div>
          </div>
        </Card>
      </Flex>
    </Section>
  );
}

export default JoluphajaSection;

interface ProgressDoughnutProps {
  earned: number;
  required: number;
  label: string;
}

function ProgressDoughnut({ earned, required, label }: ProgressDoughnutProps) {
  const percentage = required === 0 ? 100 : Math.round((earned / required) * 100);
  const remaining = Math.max(0, required - earned);

  const data = {
    datasets: [
      {
        data: [earned, remaining],
        backgroundColor: [colors.primary[500], '#E5E7EB'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-primary-500">{percentage}%</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <p className="text-xs text-gray-500">
          {earned} / {required} 학점
        </p>
      </div>
    </div>
  );
}

const mockGraduationData = {
  totalCredits: { earned: 98, required: 130 },
  majorCredits: { earned: 18, required: 24 },
  generalCredits: { earned: 20, required: 32 },
  liberalCredits: { earned: 60, required: 74 },
};
