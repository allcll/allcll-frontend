import { Flex, Grid, Heading, SupportingText } from '@allcll/allcll-ui';

interface LabelItem {
  title: string;
  desc: string;
}

const LABELS: LabelItem[] = [
  {
    title: '개인정보 수집',
    desc: '세종대학교 학번, 성명, 학부정보 등',
  },
  {
    title: '개인정보 처리 목적',
    desc: '세종대 시스템 연동, 사용자 인증 및 학사 정보 조회',
  },
  {
    title: '개인정보 보유 기간',
    desc: '회원 탈퇴 시까지, 로그아웃 시까지',
  },
  {
    title: '개인정보 제3자 제공',
    desc: '세종대학교 시스템 연동',
  },
  {
    title: '개인정보 파기',
    desc: '회원 탈퇴 시 즉시 삭제',
  },
  {
    title: '고충처리 부서',
    desc: '올클(ALLCLL) 개발자 (allclllclla@gmail.com)',
  },
];

function PrivacyLabelGrid() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
      <Flex justify="justify-center" className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <Heading level={2}>주요 개인정보 처리 사항 안내</Heading>
      </Flex>
      <Grid columns={{ base: 2, md: 3 }} className="divide-x divide-y divide-gray-100">
        {LABELS.map(item => (
          <Flex key={item.title} direction="flex-col" align="items-center" className="px-4 py-6 gap-2">
            <SupportingText className="font-semibold text-gray-700 text-lg">{item.title}</SupportingText>
            <SupportingText className="text-gray-500 text-xs leading-relaxed text-center">{item.desc}</SupportingText>
          </Flex>
        ))}
      </Grid>
    </div>
  );
}

export default PrivacyLabelGrid;
