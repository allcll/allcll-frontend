import Section from '@/widgets/home/ui/Section.tsx';
import SectionHeader from '@/widgets/home/ui/SectionHeader.tsx';
import SeatBadge from '@/entities/wishes/ui/SeatBadge.tsx';
import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';
import { Flex, Heading, SupportingText } from '@allcll/allcll-ui';

function LiveSection() {
  return (
    <Section>
      <SectionHeader
        title="실시간 수강 여석 확인"
        subtitle="이제 여석이 나올 때 까지, 편하게 기다리세요"
        href="/live"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Heading level={3}>여석 과목 알림</Heading>
          <SupportingText>
            등록된 알림 과목에 대해서, 여석이 생기면 <span className="text-blue-500 font-bold">알림</span>을 드려요
          </SupportingText>
          <div className="flex flex-col gap-4 mt-4">
            {[
              { name: '컴퓨터그래픽스', prof: '003281 | 최수미' },
              { name: '운영체제', prof: '004310 | LEE KANGWON' },
            ].map(({ name, prof }) => (
              <div key={prof} className="bg-gray-50 shadow-sm rounded-lg p-4 w-full">
                <Flex justify="justify-between" className="mb-2">
                  <Heading level={4}>{name}</Heading>
                  <AlarmIcon />
                </Flex>
                <Flex justify="justify-between">
                  <p className="text-sm text-gray-500">{prof}</p>
                  <SeatBadge seat={0} formatter={value => `여석: ${value}`} />
                </Flex>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 shadow-md rounded-md">
          <Heading level={3}>여석 수 TOP 10</Heading>
          <SupportingText>여석이 많은 과목을 놓치지 마세요!</SupportingText>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg text-sm">
              <thead>
                <tr className="bg-gray-50 z-10 text-nowrap">
                  <th className="px-4 py-2">학수번호</th>
                  <th className="px-4 py-2">과목명</th>
                  <th className="px-4 py-2">교수명</th>
                  <th className="px-4 py-2">여석</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '004310-004', name: '운영체제', prof: '이수정', seats: 22 },
                  { id: '003281-001', name: '컴퓨터그래픽스', prof: '최수미', seats: 15 },
                  { id: '004118-007', name: '디지털시스템', prof: 'Rajendra Dhakal', seats: 6 },
                  { id: '009912-006', name: 'C프로그래밍및실습', prof: '김도년', seats: 5 },
                  { id: '007330-001', name: '확률및통계', prof: '김해광', seats: 4 },
                ].map(({ id, name, prof, seats }, index) => (
                  <tr key={'live-non-major-' + index} className="border-t border-gray-200 text-black">
                    <td className="px-4 py-2 text-center">{id}</td>
                    <td className="px-4 py-2 text-center">{name}</td>
                    <td className="px-4 py-2 text-center">{prof}</td>
                    <td className="px-4 py-2 text-center">
                      <SeatBadge seat={seats} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default LiveSection;
