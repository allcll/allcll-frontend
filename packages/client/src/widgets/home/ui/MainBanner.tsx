import { Link } from 'react-router-dom';
import Section from '@/widgets/home/ui/Section.tsx';

import { Button, SupportingText } from '@allcll/allcll-ui';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';

const START_DATE = '02월 10일(화)';
const END_DATE = '02월 13일(목)';

function MainBanner() {
  const { data } = useServiceSemester();

  return (
    <Section className="flex flex-col md:flex-row items-center justify-between" bgColor="bg-banner-skysoft">
      <div className="max-w-xl">
        <div className="flex flex-row gap-2 items-center">
          <img src="/calendar.png" alt="calendar" className="w-10 h-10" />
          <span className="italic text-xs text-stone-500 ">
            {data?.semesterValue}학기 수강 신청 기간 <br /> {START_DATE} ~ {END_DATE}
          </span>
        </div>
        <h2 className="text-xl mt-10 sm:text-2xl md:text-4xl leading-snug font-bold mb-3 ">
          {data?.semesterValue}학기 수강신청,
        </h2>
        <div className="flex flex-row justify-start items-center text-xl sm:text-2xl md:text-4xl leading-snug font-bold mb-3">
          <img src="/logo-name.svg" alt="logo-name" className="w-20 sm:w-32 md:w-40 lg:w-48 mr-2 animate-updown" />이
          도와드립니다!
        </div>
        <SupportingText>
          시간표 만들기부터 수강 신청 연습, 실시간 여석 확인까지 ALLCLL이 여러분과 함께합니다.
        </SupportingText>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <Button variant="primary" size="medium" asChild>
            <Link to="/timetable">시간표 만들기</Link>
          </Button>
          <Button variant="outlined" size="medium" asChild>
            <Link to="/simulation">수강 신청 연습하기</Link>
          </Button>
        </div>
      </div>
      <img src="/summer-banner.png" alt="summer-banner" className="w-90 hidden sm:block  mt-8 md:mt-4" />
    </Section>
  );
}

export default MainBanner;
