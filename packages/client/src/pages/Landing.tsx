import React from 'react';
import {Link} from "react-router-dom";
import {Doughnut} from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import {DoughnutColors} from '@/utils/doughnut.ts';
import RightArrowSvg from "@/assets/right-arrow.svg?react";
import ClockBlueSvg from "@/assets/clock-blue.svg?react";
import DisabledBlueSvg from "@/assets/disabled-blue.svg?react";
import ReloadBlueSvg from "@/assets/reload-blue.svg?react";
import LinkBlue from "@/assets/link-blue.svg?react";
import ProfileSvg from "@/assets/profile.svg?react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const doughnut = {
  labels: ["컴퓨터공학과", "정보통신공학과", "소프트웨어학과", "기타"],
  datasets: [
    {
      data: [40, 25, 20, 15],
      backgroundColor: DoughnutColors,
    },
  ],
}

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="flex flex-col md:flex-row items-center justify-between" bgColor="bg-blue-50">
        <div className="max-w-lg">
          <h1 className="text-3xl/[1.2] md:text-5xl/[1.2] font-bold">수강 신청, <br/> 매번 어렵고 <br/>번거롭지 않나요?</h1>
          <p className="text-gray-600 mt-4">세종대 수강신청을 더 쉽고 빠르게 도와드릴게요!</p>
          <Link to="/wishes" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-3 mt-6 flex items-center gap-2 w-fit">
            관심과목 분석하기
            <RightArrowSvg className="w-4 h-4"/>
          </Link>
        </div>
        <img src="/hero-illustration.png" alt="Illustration" className="w-80 md:w-96 mt-6 md:mt-0" />
      </Section>

      {/* 고민 Section */}
      <Section className="text-center" bgColor="bg-white">
        <h2 className="text-2xl font-semibold">우리가 겪는 어려움</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            {icon: <ClockBlueSvg className="w-6 h-6"/>, title: '6학점밖에 못 들었던 수강 신청 날...', text: "원하는 강의를 신청하지 못해 졸업이 늦춰질까 걱정했던 순간들"},
            {icon: <DisabledBlueSvg className="w-6 h-6"/>, title: "원하던 강의는 전부 마감...", text: "꿈꾸던 학과로의 전과, 미리 수강하려고 했지만 수강신청의 벽은 높았습니다"},
            {icon: <ReloadBlueSvg className="w-6 h-6"/>, title: "하루 종일 화면을 보며 여석을 기다렸던 시간들...", text: "수강신청 버튼만 수백 번, 그래도 원하는 강의는 잡지 못했습니다"}
          ].map(({icon, title, text}, index) => (
            <div key={index} className="flex flex-col gap-4 p-6 rounded-md bg-gray-50 text-left">
              {icon}
              <h3 className="font-extrabold">{title}</h3>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          ))}
        </div>
        <div className="text-gray-900 mt-16">
          <p>그래서 우리는 올클을 만들었습니다.</p>
          <p>같은 고민을 했던 우리이기에, 진짜 도움이 되는 서비스를 만들고 싶었습니다. </p>
        </div>
      </Section>

      {/* 관심과목 분석 Section */}
      <Section>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">관심과목 분석</h2>
          <Link to="/wishes">
            <LinkBlue className="w-4 h-4"/>
          </Link>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 검색 창 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">학과별 관심도</h2>
            <div className="flex aligh-center justify-center max-h-96">
              <Doughnut data={doughnut} />
            </div>
          </div>

          {/* 대체 과목 추천 */}
          <div className="bg-white p-6 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">대체 과목 추천</h3>
            {[
              { name: "데이터베이스개론", dept: "데이터베이스 시스템", status: "30명" },
              { name: "알고리즘분석", dept: "고급알고리즘", status: "14명" }
            ].map((course, index) => (
              <div key={index} className="mt-4 flex justify-between p-2 rounded-md border border-gray-200">
                <div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-sm text-gray-500">{course.dept}</p>
                </div>
                <span className="text-yellow-500">{course.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* COMING SOON Section */}
      <Section className="text-center text-white" bgColor="bg-blue-950">
        <h2 className="text-2xl font-bold">실시간 수강 여석 확인</h2>
        <h3 className="text-2xl font-bold text-blue-500">(COMING SOON!)</h3>
        <div className="text-center text-gray-300 mt-8">
          <p className="mt-4">강의 여석을 확인하려면 계속 새로고침해야 하나요?</p>
          <p className="mt-2">올클이 더 쉽고 빠른 방법을 준비하고 있어요!</p>
          <p className="mt-2">이제 수강 신청을 기다리는 시간이 줄어듭니다.</p>
          <p className="mt-2">더 나은 서비스로 돌아올게요.</p>
        </div>
      </Section>

      {/* 사용자 후기 */}
      <Section className="text-center" bgColor="bg-white">
        <h2 className="text-2xl font-semibold">올클을 써보신 분들의 한마디!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            {name: '김O수', department: '컴퓨터공학과 2학년', review: '대체과목 추천 덕분에 금방 대체 과목을 찾아서 너무 편했어요!'},
            {name: '김O민', department: "컴퓨터공학과 4학년", review: "실시간으로 관심도를 볼 수 있어서 수강신청 전략을 세울 수 있었어요!"},
            {name: '김O환', department: "컴퓨터공학과 3학년", review: "수강신청이 이렇게 편해질 수 있다니 놀랍네요!"}
          ].map(({name, department, review}, index) => (
            <div key={index} className="flex flex-col gap-4 p-6 rounded-md bg-gray-50 text-left text-sm">
              <div className="flex gap-4 items-center">
                <ProfileSvg className="w-6 h-6"/>
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="text-xs text-gray-500">{department}</p>
                </div>
              </div>
              <p className="text-gray-950">"{review}"</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

interface SectionProps {
  bgColor?: string;
  className?: string;
  children: React.ReactNode;
}

function Section({bgColor, className, children}: SectionProps) {
  const additionalStyle = bgColor ? bgColor : "";
  const additionalClass = className ? ` ${className}` : '';
  return (
    <section className={additionalStyle}>
      <div className={`mx-auto max-w-7xl px-4 md:px-16 py-24 ${additionalClass}`}>
        {children}
      </div>
    </section>
  );
}


export default Landing;
