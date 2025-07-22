import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import { useState } from 'react';
import ScheduleFormContent from '../ScheduleFormContent';
import { Day } from '@/utils/types';

interface ScheduleInfo {
  subjectName: string;
  professorName: string;
  location: string;
  dayOfWeek: Day[];
  startTime: string;
  endTime: string;
}

interface IEditBottomSheet {
  shedule?: ScheduleInfo;
}

/**
 *
 * @param shedule
 * EditBottomSheet에서는 수정하는 값들을 관리한다.
 * 즉, 상태를 관리한다.
 * 하위 컴포넌트인 ScheduleFormContent은 데이터를 받아 렌더링 하는데에 집중한다.
 * @returns
 */
function EditBottomSheet({ shedule }: IEditBottomSheet) {
  const [scheduleForm, setScheduleForm] = useState<ScheduleInfo>({
    subjectName: shedule?.subjectName ?? '',
    professorName: shedule?.professorName ?? '',
    location: shedule?.location ?? '',
    dayOfWeek: shedule?.dayOfWeek ?? [],
    startTime: shedule?.startTime ?? '',
    endTime: shedule?.endTime ?? '',
  });

  const onChange = (key: string, value: string | Day[]) => {
    setScheduleForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <BottomSheet>
      <BottomSheetHeader title="과목 추가" headerType="close" onClose={() => {}} />
      <ScheduleFormContent scheduleForm={scheduleForm} onChange={onChange} handleSubmit={handleSubmit} />
    </BottomSheet>
  );
}

export default EditBottomSheet;
