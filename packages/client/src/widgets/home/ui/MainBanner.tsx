import { Link } from 'react-router-dom';
import { Button, SupportingText } from '@allcll/allcll-ui';
import Section from '@/widgets/home/ui/Section.tsx';
import Image from '@/shared/ui/Image.tsx';
import LogoName from '@/assets/logo/logo-name-summer.svg?react';

// TODO: 학기 롤오버 시 SEMESTER_LABEL을 useServiceSemester의 semesterValue 참조로 되돌리기.
//       학기/기간 설정 단일화 PR(375번)이 머지되면 이 상수들이 @allcll/common config.ts로 이동하므로 거기서 함께 정리.
const SEMESTER_LABEL = '2026-2학기';
const START_DATE = '08/14(금)';
const END_DATE = '08/21(금)';

function MainBanner() {
  return (
    <div className="relative overflow-hidden">
      <Section
        className="relative z-elevated flex flex-col md:flex-row items-center justify-between !py-5"
        bgColor="bg-banner-skysoft"
      >
        <div className="max-w-xl">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/calendar.png" alt={`${SEMESTER_LABEL} 세종대 수강신청 일정 아이콘`} className="w-10 h-10" />
            <span className="italic text-xs text-stone-500 ">
              {SEMESTER_LABEL} 수강신청 기간 <br />
              {START_DATE} ~ {END_DATE}
            </span>
          </div>

          <h1 className="text-lg mt-10 sm:text-xl md:text-2xl leading-snug font-bold mb-3">
            세종대 수강신청 연습 · 수강여석 확인 · 졸업요건까지
          </h1>
          <div className="flex flex-row justify-start items-center text-xl sm:text-2xl md:text-4xl leading-snug font-bold mb-3">
            <LogoName
              aria-label="올클(ALLCLL) 세종대 수강신청 도우미 서비스"
              className="w-20 sm:w-32 md:w-40 lg:w-48 mr-2 animate-updown"
            />
            이 도와드립니다!
          </div>
          <SupportingText>
            수강 신청 연습, 실시간 여석 확인, 졸업요건 분석까지 <br className="md:hidden" />
            올클이 여러분의 학교생활과 함께합니다.
          </SupportingText>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <Button variant="primary" size="medium" asChild>
              <Link to="/live">전체 학년 여석 확인하기</Link>
            </Button>
            <Button variant="outlined" size="medium" asChild>
              <Link to="/simulation">수강 신청 연습하기</Link>
            </Button>
          </div>
        </div>
        <Image
          src="/summer-banner-min.png"
          fetchPriority="high"
          alt=""
          aria-hidden="true"
          className="hidden md:block self-end shrink-0 w-[320px] lg:w-[370px]"
        />
      </Section>
    </div>
  );
}

export default MainBanner;
