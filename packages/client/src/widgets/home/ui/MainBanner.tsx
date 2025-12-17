import { Link } from 'react-router-dom';
import Section from '@/widgets/home/ui/Section.tsx';
import RightArrowSvg from '@/assets/right-arrow.svg?react';
import RightArrowBlueSvg from '@/assets/arrow-blue.svg?react';

const SEMESTER = '동계';
const YEAR = '2025';
const START_DATE = '12월 1일(월)';
const END_DATE = '12월 3일(수)';

function MainBanner() {
  return (
    <Section className="flex flex-col md:flex-row items-center justify-between" bgColor="bg-banner-skysoft">
      <div className="max-w-xl">
        <div className="flex flex-row gap-2 items-center">
          <img src="/calendar.png" alt="calendar" className="w-10 h-10" />
          <span className="italic text-xs text-stone-500 ">
            {YEAR}학년도 {SEMESTER}학기 수강 신청 기간 <br /> {START_DATE} ~ {END_DATE}
          </span>
        </div>
        <h2 className="text-xl mt-10 sm:text-2xl md:text-4xl leading-snug font-bold mb-3 ">
          {YEAR}학년도 {SEMESTER}학기 수강신청,
        </h2>
        <div className="flex flex-row justify-start items-center text-xl sm:text-2xl md:text-4xl leading-snug font-bold mb-3">
          <img src="/logo-name.svg" alt="logo-name" className="w-20 sm:w-32 md:w-40 lg:w-48 mr-2 animate-updown" />이
          도와드립니다!
        </div>
        <p className="text-gray-400 mt-4">
          시간표 만들기부터 수강 신청 연습, 실시간 여석 확인까지 ALLCLL이 여러분과 함께합니다
        </p>
        <div className="flex flex-col md:flex-row gap-4 ">
          <Link
            to="/live"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-3 mt-6 flex items-center gap-2 w-fit"
          >
            실시간 여석 확인하기
            <RightArrowSvg className="w-4 h-4" />
          </Link>
          <Link
            to="/simulation"
            className="bg-white hover:bg-gray-100 text-blue-500 rounded-md px-6 py-3 mt-6 flex items-center gap-2 w-fit"
          >
            수강 신청 연습하기
            <RightArrowBlueSvg className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <img src="/summer-banner.png" alt="summer-banner" className="w-90 hidden sm:block  mt-8 md:mt-4" />
    </Section>
  );
}

export default MainBanner;
