import { useState } from 'react';
import { TimetableType, useDeleteTimetable } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Checkbox, Flex, Popover, SupportingText, usePopoverContext } from '@allcll/allcll-ui';
import ConfirmDialog from '@/shared/ui/ConfirmDialog.tsx';
import { showTimetableApiErrorToast } from '@/features/timetable/lib/showTimetableApiErrorToast';

function TimetableActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const { close } = usePopoverContext();

  return (
    <Flex gap="gap-4">
      <Button
        variant="text"
        size="small"
        onClick={() => {
          close();
          onEdit();
        }}
      >
        수정
      </Button>
      <Button
        variant="text"
        size="small"
        textColor="secondary"
        onClick={() => {
          close();
          onDelete();
        }}
      >
        삭제
      </Button>
    </Flex>
  );
}

interface TimetableSelectProps {
  setIsOpenModal: React.Dispatch<React.SetStateAction<'edit' | 'create' | null>>;
  openCreateModal?: () => void;
  timetables: TimetableType[];
  currentTimetable: TimetableType | null;
}

const TimetableSelect = ({ setIsOpenModal, openCreateModal, timetables, currentTimetable }: TimetableSelectProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const pickTimetable = useScheduleState(state => state.pickTimetable);

  const { mutate: deleteTimetable } = useDeleteTimetable();

  const handleOptionClick = (option: TimetableType) => {
    const selectedTimetable = timetables.find(
      (timetable: TimetableType) => timetable.timeTableId === option.timeTableId,
    );

    if (selectedTimetable) {
      pickTimetable(selectedTimetable);
    }
  };

  const handleTimetableEdit = () => {
    setIsOpenModal('edit');
  };

  const handleTimetableDelete = (optionId: number) => {
    setPendingDeleteId(optionId);
  };

  const confirmTimetableDelete = () => {
    if (pendingDeleteId === null) return;
    deleteTimetable(pendingDeleteId, {
      onError: error =>
        showTimetableApiErrorToast(error, {
          fallbackMessage: '시간표 삭제에 실패했습니다. 다시 시도해주세요.',
          tag: 'timetable-delete-error',
        }),
    });
    setPendingDeleteId(null);
  };

  if (!currentTimetable && timetables.length === 0) {
    return (
      <Button variant="primary" size="medium" onClick={openCreateModal}>
        시간표 만들기
      </Button>
    );
  }

  return (
    <>
      <Popover>
        <Popover.Trigger label={currentTimetable ? currentTimetable.timeTableName : '새 시간표'} />

        <Popover.Content>
          <Flex direction="flex-col" gap="gap-4">
            {timetables.length === 0 && <SupportingText>새로운 시간표를 추가해주세요.</SupportingText>}
            {timetables.map(option => (
              <Flex gap="gap-4" key={option.timeTableName + option.timeTableId}>
                <Checkbox
                  key={option.timeTableId}
                  label={option.timeTableName}
                  checked={currentTimetable?.timeTableId === option.timeTableId}
                  onChange={() => handleOptionClick(option)}
                />
                {currentTimetable?.timeTableId === option.timeTableId && (
                  <TimetableActions
                    onEdit={handleTimetableEdit}
                    onDelete={() => handleTimetableDelete(option.timeTableId)}
                  />
                )}
              </Flex>
            ))}

            {currentTimetable && (
              <Button variant="text" size="small" textColor="gray" onClick={openCreateModal}>
                + 시간표 추가하기
              </Button>
            )}
          </Flex>
        </Popover.Content>
      </Popover>

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        title="시간표 삭제"
        description="시간표를 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={confirmTimetableDelete}
        onClose={() => setPendingDeleteId(null)}
      />
    </>
  );
};

export default TimetableSelect;
