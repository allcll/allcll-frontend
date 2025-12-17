import Section from '@/widgets/home/ui/Section.tsx';
import ProfileSvg from '@/assets/profile.svg?react';

function FeedbacksSection() {
  return (
    <Section className="text-center">
      <h2 className="text-2xl font-semibold">올클을 써보신 분들의 한마디!</h2>
      <div className="overflow-hidden mt-6 relative">
        <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="animate-marquee flex gap-6 flex-nowrap w-fit">
          {UserFeedbacks.map((feedback, index) => (
            <UserFeedbackCard key={'feedback-left-' + index} {...feedback} />
          ))}
          {UserFeedbacks.map((feedback, index) => (
            <UserFeedbackCard key={'feedback-right-' + index} {...feedback} />
          ))}
        </div>
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
      </div>
    </Section>
  );
}

interface IUserFeedback {
  name: string;
  department: string;
  review: string;
}

const UserFeedbacks: IUserFeedback[] = [
  {
    name: '김O수',
    department: '컴퓨터공학과 2학년',
    review: '대체과목 추천 덕분에 금방 대체 과목을 찾아서 너무 편했어요!',
  },
  {
    name: '김O민',
    department: '컴퓨터공학과 4학년',
    review: '실시간으로 관심도를 볼 수 있어서 수강신청 전략을 세울 수 있었어요!',
  },
  { name: '김O환', department: '컴퓨터공학과 3학년', review: '수강신청이 이렇게 편해질 수 있다니 놀랍네요!' },
];

function UserFeedbackCard({ name, department, review }: Readonly<IUserFeedback>) {
  return (
    <div className="w-screen md:w-xs flex flex-col gap-4 p-6 rounded-md bg-white text-left text-sm">
      <div className="flex gap-4 items-center">
        <ProfileSvg className="w-6 h-6" />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-xs text-gray-500">{department}</p>
        </div>
      </div>
      <p className="text-gray-950">"{review}"</p>
    </div>
  );
}

export default FeedbacksSection;
