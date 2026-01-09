import { TimetableType, useDeleteTimetable, useTimetables } from '@/entities/timetable/api/useTimetableSchedules.ts';
import useSemesterTimetableSync from '@/features/timetable/lib/useSemesterTimetableSync.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Checkbox, Flex, Popover, SupportingText } from '@allcll/allcll-ui';

interface TimetableSelectProps {
  setIsOpenModal: React.Dispatch<React.SetStateAction<'edit' | 'create' | null>>;
  openCreateModal?: () => void;
}

// Fixme : 기존에 있는 Chip 형태의 Selectbox 와 통합하기
const TimetableSelect = ({ setIsOpenModal, openCreateModal }: TimetableSelectProps) => {
  const { data: timetables = [] } = useTimetables();

  const { currentTimetable, filteredTimetablesBySemester } = useSemesterTimetableSync(timetables);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

  const { mutate: deleteTimetable } = useDeleteTimetable();

  const handleOptionClick = (option: TimetableType) => {
    const selectedTimetable = timetables.find(
      (timetable: TimetableType) => timetable.timeTableId === option.timeTableId,
    );

    if (selectedTimetable) {
      setCurrentTimetable(selectedTimetable);
    }
  };

  const handleTimetableEdit = () => {
    setIsOpenModal('edit');
  };

  const handleTimetableDelete = (optionId: number) => {
    deleteTimetable(optionId);
  };

  if (!currentTimetable) {
    return (
      <Button variant="primary" size="medium" onClick={openCreateModal}>
        새 시간표 만들기
      </Button>
    );
  }

  return (
    <Popover>
      <Popover.Trigger label={currentTimetable ? currentTimetable.timeTableName : '새 시간표'} />

      <Popover.Content>
        <Flex direction="flex-col" gap="gap-4">
          {filteredTimetablesBySemester.length === 0 && <SupportingText>새로운 시간표를 추가해주세요.</SupportingText>}
          {filteredTimetablesBySemester.map(option => (
            <Flex gap="gap-4" key={option.timeTableName + option.timeTableId}>
              <Checkbox
                key={option.timeTableId}
                label={option.timeTableName}
                checked={currentTimetable.timeTableId === option.timeTableId}
                onChange={() => handleOptionClick(option)}
              />
              {currentTimetable.timeTableId === option.timeTableId && (
                <Flex gap="gap-4">
                  <Button variant="text" size="small" onClick={handleTimetableEdit}>
                    수정
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    textColor="secondary"
                    onClick={() => handleTimetableDelete(option.timeTableId)}
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

export default TimetableSelect;
