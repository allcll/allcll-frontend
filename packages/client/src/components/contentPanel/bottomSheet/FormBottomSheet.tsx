import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ScheduleFormContent from '../ScheduleFormContent';
import { Day } from '@/utils/types';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

interface ScheduleInfo {
  subjectName: string;
  professorName: string;
  location: string;
  dayOfWeek: Day[];
  startTime: string;
  endTime: string;
}

interface IFormBottomSheet {
  schedule?: ScheduleInfo;
  formType: 'add' | 'edit';
}

function FormBottomSheet({ schedule, formType }: IFormBottomSheet) {
  const { closeBottomSheet } = useBottomSheetStore();

  return (
    <BottomSheet>
      <BottomSheetHeader title="과목 수정" headerType="close" onClose={() => closeBottomSheet('edit')} />
      <ScheduleFormContent schedule={schedule} formType={formType} />
    </BottomSheet>
  );
}

export default FormBottomSheet;
