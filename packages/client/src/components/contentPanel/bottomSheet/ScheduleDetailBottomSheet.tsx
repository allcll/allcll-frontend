import React from 'react';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useSubject from '@/hooks/server/useSubject';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';

function ScheduleInfoBottomSheet() {
  const { schedule } = useScheduleModalData();
  const { deleteSchedule, cancelSchedule } = useScheduleModal();
  const { data: subjects } = useSubject();

  const handleDeleteOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm('해당 과목을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteSchedule(e);
  };

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  return (
    <BottomSheet>
      <BottomSheetHeader headerType="close" onClose={cancelSchedule} />
      <div className="w-full flex items-center gap-2 border-b border-gray-200 p-2 h-12">
        <h3 className="font-semibold text-md">{schedule.subjectName}</h3>
      </div>

      <div className="flex flex-col gap-1 px-2 py-3 text-gray-500 text-sm">
        <p className="text-sm text-gray-500">{schedule.professorName ?? '교수 정보 없음'}</p>
        <div className="flex items-center gap-1">
          <ClockGraySvg className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-sm">{findSubjectById?.lesnTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <HouseSvg className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-sm">{findSubjectById?.lesnRoom ?? '장소 정보 없음'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm">{findSubjectById?.manageDeptNm}</span>
          <span className="text-gray-500 text-sm"> {findSubjectById?.studentYear + '학년'}</span>

          <span className="text-blue-500 text-sm">{findSubjectById?.tmNum[0] + '학점'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500 text-sm font-bold">{findSubjectById?.curiTypeCdNm ?? ''} </span>
          <span className="text-gray-500 text-sm">{findSubjectById?.remark ?? ''}</span>
        </div>
      </div>
      <div className="px-4 py-4">
        <button
          onClick={handleDeleteOfficialSchedule}
          className="text-sm text-red-500 cursor-pointer font-medium ml-auto block"
        >
          삭제
        </button>
      </div>
    </BottomSheet>
  );
}

export default ScheduleInfoBottomSheet;
