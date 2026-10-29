import { Card, Flex, SupportingText } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import { useSemester } from '@/hooks/server/service/useSemester';

function SemesterSetting() {
  return (
    <section>
      <Card>
        <Flex direction="flex-col" gap="gap-4">
          <SectionHeader title="현재 학기" description="날짜 기준으로 자동 판별된 현재 학기입니다." />
          <SemesterContent />
        </Flex>
      </Card>
    </section>
  );
}

function SemesterContent() {
  const { data, isLoading, isError } = useSemester();

  if (isLoading) {
    return <SupportingText>불러오는 중...</SupportingText>;
  }

  if (isError || !data) {
    return <SupportingText className="text-red-500">불러오지 못했습니다.</SupportingText>;
  }

  return (
    <Flex direction="flex-col" gap="gap-1">
      <span className="text-lg font-semibold text-gray-800">{data.semesterValue}</span>
      <SupportingText>
        {data.period.startDate} ~ {data.period.endDate}
      </SupportingText>
    </Flex>
  );
}

export default SemesterSetting;
