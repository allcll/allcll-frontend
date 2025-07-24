import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ScheduleFormContent from '../ScheduleFormContent';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { Schedule } from '@/hooks/server/useTimetableData';

interface IFormBottomSheet {
  schedule?: Schedule;
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
