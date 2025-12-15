import { TimetableType, useDeleteTimetable } from '@/hooks/server/useTimetableSchedules';
import { useScheduleState } from '@/store/useScheduleState';
import { Button, Checkbox, Flex, Popover, SupportingText } from '@allcll/allcll-ui';

interface DropdownSelectProps {
  timetables: TimetableType[];
  onSelect: (optionId: number) => void;
  setIsOpenModal: React.Dispatch<React.SetStateAction<'edit' | 'create' | null>>;
  openCreateModal?: () => void;
}

// Fixme : 기존에 있는 Chip 형태의 Selectbox 와 통합하기
const DropdownSelect = ({ timetables, onSelect, setIsOpenModal, openCreateModal }: DropdownSelectProps) => {
  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);
  const { mutate: deleteTimetable } = useDeleteTimetable();

  const handleOptionClick = (option: TimetableType) => {
    setCurrentTimetable(option);
    onSelect(option.timeTableId);
  };

  const handleEditClick = () => {
    setIsOpenModal('edit');
  };

  const handleDeleteClick = (optionId: number) => {
    deleteTimetable(optionId);
  };

  return (
    <Popover>
      <Popover.Trigger label={currentTimetable?.timeTableName ?? '새 시간표'} />
      <Popover.Content>
        <Flex direction="flex-col" gap="gap-4">
          {timetables.length === 0 && <SupportingText>새로운 시간표를 추가해주세요.</SupportingText>}
          {timetables.map(option => (
            <Flex gap="gap-4" key={option.timeTableName + option.timeTableId}>
              <Checkbox
                key={option.timeTableId}
                label={option.timeTableName}
                checked={currentTimetable.timeTableId === option.timeTableId}
                onChange={() => handleOptionClick(option)}
              />
              {currentTimetable.timeTableId === option.timeTableId && (
                <Flex gap="gap-4">
                  <Button variant="text" size="small" onClick={handleEditClick}>
                    수정
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    textColor="secondary"
                    onClick={() => handleDeleteClick(option.timeTableId)}
                  >
                    삭제
                  </Button>
                </Flex>
              )}
            </Flex>
          ))}

          <Button variant="text" size="small" textColor="gray" onClick={openCreateModal}>
            + 시간표 만들기
          </Button>
        </Flex>
      </Popover.Content>
    </Popover>
  );
};

export default DropdownSelect;
