import { Link } from 'react-router-dom';
import { Button, SupportingText, Heading, Flex } from '@allcll/allcll-ui';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import Section from '@/widgets/home/ui/Section.tsx';
import Image from '@/shared/ui/Image.tsx';
import LogoName from '@/assets/logo/logo-name-summer.svg?react';

const START_DATE = '06/01(월)';
const END_DATE = '06/04(목)';

function MainBanner() {
  const { data } = useServiceSemester();

  return (
    <div className="relative overflow-hidden">
      <Section
        className="relative z-elevated flex flex-col md:flex-row items-center justify-between !py-5"
        bgColor="bg-banner-skysoft"
      >
        <div className="max-w-xl">
          <Flex direction="flex-row" gap="gap-2" align="items-center">
            <Image src="/calendar.png" alt="2026-여름학기 세종대 수강신청 일정 아이콘" className="w-10 h-10" />
            <span className="italic text-xs text-stone-500 ">
              {data?.semesterValue}학기 수강신청 기간 <br />
              {START_DATE} ~ {END_DATE}
            </span>
          </Flex>

          <Heading level={1} className="mt-10 mb-3 text-lg! sm:text-xl! md:text-2xl! leading-snug font-bold">
            세종대 수강신청 연습 · 수강여석 확인 · 졸업요건까지
          </Heading>
          <Flex
            direction="flex-row"
            justify="justify-start"
            align="items-center"
            className="text-xl sm:text-2xl md:text-4xl leading-snug font-bold mb-3"
          >
            <LogoName
              aria-label="올클(ALLCLL) 세종대 수강신청 도우미 서비스"
              className="w-20 sm:w-32 md:w-40 lg:w-48 mr-2 animate-updown"
            />
            이 도와드립니다!
          </Flex>
          <SupportingText>
            수강 신청 연습, 실시간 여석 확인, 졸업요건 분석까지 <br className="md:hidden" />
            올클이 여러분의 학교생활과 함께합니다.
          </SupportingText>

          <Flex direction="flex-col" className="md:flex-row mt-4" gap="gap-4">
            <Button variant="primary" size="medium" asChild>
              <Link to="/live">전체 학년 여석 확인하기</Link>
            </Button>
            <Button variant="outlined" size="medium" asChild>
              <Link to="/simulation">수강 신청 연습하기</Link>
            </Button>
          </Flex>
        </div>
        <Image
          src="/summer-banner-min.png"
          fetchPriority="high"
          alt=""
          aria-hidden="true"
          width={800}
          height={662}
          className="hidden md:block self-end shrink-0 w-[320px] lg:w-[370px]"
        />
      </Section>
    </div>
  );
}

export default MainBanner;
