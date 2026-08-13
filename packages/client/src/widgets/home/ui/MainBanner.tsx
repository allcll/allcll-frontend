import { Link } from 'react-router-dom';
import { Button, SupportingText } from '@allcll/allcll-ui';
import { BANNER_PERIOD_LABEL, CURRENT_SEMESTER } from '@allcll/common';
import { formatSchedulePeriod, useCourseSchedule } from '@/entities/operationPeriod/model/useCourseSchedule';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import Section from '@/widgets/home/ui/Section.tsx';
import Image from '@/shared/ui/Image.tsx';
import LogoName from '@/assets/logo/logo-name-summer.svg?react';

function MainBanner() {
  const { data } = useServiceSemester();
  const schedule = useCourseSchedule();
  const registrationPeriod = schedule && formatSchedulePeriod(schedule.registration);

  return (
    <div className="relative overflow-hidden">
      <Section
        className="relative z-elevated flex flex-col md:flex-row items-center justify-between !py-5"
        bgColor="bg-banner-skysoft"
      >
        <div className="max-w-xl">
          <div className="flex flex-row gap-2 items-center">
            <Image src="/calendar.png" alt="" className="w-10 h-10" />
            <span className="italic text-xs text-stone-500 ">
              {data?.semesterValue ?? CURRENT_SEMESTER.semesterValue}학기 {BANNER_PERIOD_LABEL} <br />
              {registrationPeriod}
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
