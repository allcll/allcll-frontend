import Section from '@/components/Landing/Section.tsx';
import SectionHeader from '@/components/Landing/SectionHeader.tsx';

function SimulationSection() {
  return (
    <Section>
      <SectionHeader title="올클 연습" subtitle="세종대 수강신청 연습 부터, 결과 분석까지 한 번에" href="/simulation" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"></div>
    </Section>
  );
}

export default SimulationSection;
