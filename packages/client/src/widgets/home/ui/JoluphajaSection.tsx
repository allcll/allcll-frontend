import { Badge, Card, Heading, SupportingText } from '@allcll/allcll-ui';
import Section from './Section';
import SectionHeader from './SectionHeader';
import ProgressDoughnut from '@/entities/graduation/ui/ProgressDoughnut';

const MOCK_CATEGORIES = [
  { label: '전공필수', earned: 18, required: 24 },
  { label: '전공선택', earned: 20, required: 30 },
  { label: '교양선택', earned: 15, required: 21 },
];

function JoluphajaSection() {
  return (
    <Section>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="primary" appearance="filled">
          새로운 서비스
        </Badge>
        <Badge variant="primary" appearance="outline" size="small">
          베타
        </Badge>
      </div>
      <SectionHeader
        title="세종대 졸업 요건 검사"
        subtitle="졸업 요건 달성 현황을 한눈에 확인하세요."
        href="/graduation"
      />

      <p className="mt-3 text-sm text-gray-400">
        현재 베타 서비스입니다. 직접 사용해보시고 의견을 남겨주시면 더 좋은 서비스로 발전하는 데 큰 도움이 됩니다!
      </p>

      <Card className="mt-4">
        <Heading level={3}>카테고리별 이수 현황</Heading>
        <SupportingText>전공필수·전공선택·교양 등 항목별로 졸업 요건 달성 현황을 분석해드려요.</SupportingText>

        <div className="flex justify-around mt-6">
          {MOCK_CATEGORIES.map(({ label, earned, required }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="sm:hidden">
                <ProgressDoughnut earned={earned} required={required} size="small" />
              </span>
              <span className="hidden sm:block">
                <ProgressDoughnut earned={earned} required={required} size="medium" />
              </span>
              <span className="text-xs text-gray-600 font-medium mt-1">{label}</span>
              <span className="text-xs text-gray-400">
                {earned}/{required}학점
              </span>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

export default JoluphajaSection;
