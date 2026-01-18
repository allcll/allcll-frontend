import Section from '@/widgets/home/ui/Section.tsx';
import ClockBlueSvg from '@/assets/clock-blue.svg?react';
import DisabledBlueSvg from '@/assets/disabled-blue.svg?react';
import ReloadBlueSvg from '@/assets/reload-blue.svg?react';
import { Heading, SupportingText } from '@allcll/allcll-ui';

function PainPointSection() {
  return (
    <Section className="text-center">
      <Heading level={2}>
        우리가 겪는 어려움
        </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[
          {
            icon: <ClockBlueSvg className="w-6 h-6" />,
            title: '6학점밖에 못 들었던 수강 신청 날...',
            text: '원하는 강의를 신청하지 못해 졸업이 늦춰질까 걱정했던 순간들',
          },
          {
            icon: <DisabledBlueSvg className="w-6 h-6" />,
            title: '원하던 강의는 전부 마감...',
            text: '꿈꾸던 학과로의 전과, 미리 수강하려고 했지만 수강신청의 벽은 높았습니다',
          },
          {
            icon: <ReloadBlueSvg className="w-6 h-6" />,
            title: '하루 종일 화면을 보며 여석을 기다렸던 시간들...',
            text: '수강신청 버튼만 수백 번, 그래도 원하는 강의는 잡지 못했습니다',
          },
        ].map(({ icon, title, text }, index) => (
          <div key={'pain-point-' + index} className="flex flex-col gap-4 p-6 rounded-md bg-gray-50 text-left">
            {icon}
            <Heading level={3} className="font-extrabold">{title}</Heading>
            <SupportingText >{text}</SupportingText>
          </div>
        ))}
      </div>
      <div className="text-gray-900 mt-16">
        <p>그래서 우리는 올클을 만들었습니다.</p>
        <p>같은 고민을 했던 우리이기에, 진짜 도움이 되는 서비스를 만들고 싶었습니다. </p>
      </div>
    </Section>
  );
}

export default PainPointSection;
