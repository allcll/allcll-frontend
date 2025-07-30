import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useSubject from '@/hooks/server/useSubject';
import React, { useEffect } from 'react';

function ScheduleInfoModal() {
  const { schedule } = useScheduleModalData();
  const { deleteSchedule, cancelSchedule } = useScheduleModal();
  const { data: subjects } = useSubject();

  const handleDeleteOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm('해당 과목을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteSchedule(e);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cancelSchedule(e);
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  return (
    <div className="fixed inset-0 z-50  hidden md:flex items-center justify-center  bg-black/10">
      <div
        className="bg-white flex flex-col border border-gray-200 rounded-xl gap-2 w-[90%] max-w-md p-8 shadow-xl relative"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex w-full justify-between">
          <h3 className="font-semibold text-lg">{schedule.subjectName}</h3>
          <button
            className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
            onClick={cancelSchedule}
          >
            <XDarkGraySvg />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-2 py-3 text-gray-500 text-sm">
          <p className="text-sm text-gray-500">{findSubjectById?.professorName ?? '교수 정보 없음'}</p>
          <div className="flex items-center gap-1">
            <ClockGraySvg className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 text-sm">{findSubjectById?.lesnTime}</span>;
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
            <span className="text-gray-500 text-sm">{findSubjectById?.language}</span>
            <span className="text-gray-500 text-sm">{findSubjectById?.subjectType}</span>
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
      </div>
    </div>
  );
}

export default ScheduleInfoModal;
