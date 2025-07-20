import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import PencilSvg from '@/assets/pencil.svg?react';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';

//TODO: 여기에는 학과 정보도 있는데, 과목 정보 get해올 때 가공해야하나?
function ScheduleDetailBottomSheet() {
  const subject = {
    name: '재밌는 과목',
    professor: '홍길동',
    department: '소프트웨어융합대학 컴퓨터공학과',
    dayTime: '월, 화 10:00 ~ 17:00',
    location: '센 103',
  };

  return (
    <BottomSheet>
      <BottomSheetHeader headerType="close" onClose={() => {}} />
      <div className="w-full flex items-center gap-2 border-b border-gray-200 p-2 h-12">
        <h3 className="font-semibold">재밌는 과목</h3>
        <button className="cursor-pointer" onClick={() => {}}>
          <PencilSvg />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-2 py-3 text-gray-500 text-sm">
        <p className="text-sm text-gray-500">{subject.professor}</p>
        <p>{subject.department}</p>
        <div className="flex items-center gap-1">
          <ClockGraySvg className="w-4 h-4 text-gray-400" />
          <span>{subject.dayTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <HouseSvg className="w-4 h-4 text-gray-400" />
          <span>{subject.location}</span>
        </div>
      </div>
      <div className="px-4 py-4">
        <button className="text-sm text-red-500 cursor-pointer font-medium ml-auto block">과목 삭제</button>
      </div>
    </BottomSheet>
  );
}

export default ScheduleDetailBottomSheet;
