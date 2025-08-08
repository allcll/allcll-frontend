import { Subject } from '@/utils/types.ts';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import { useAddPinned, usePinned, useRemovePinned } from '@/store/usePinned.ts';
import useSearchLogging from '@/hooks/useSearchLogging.ts';

interface IAlarmButtonProps {
  subject: Subject;
}

function AlarmButton({ subject }: IAlarmButtonProps) {
  const { data: pinnedSubjects } = usePinned();
  const { mutate: deletePin } = useRemovePinned();
  const { mutate: addPin } = useAddPinned();
  const { selectTargetOnly } = useSearchLogging();

  const isPinned = pinnedSubjects?.some(pinnedSubject => pinnedSubject.subjectId === subject.subjectId);
  const title = isPinned ? '알림 과목 해제' : '알림 과목 등록';

  const handlePin = () => {
    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);

    selectTargetOnly(subject.subjectId);
  };

  return (
    <button className="cursor-pointer" title={title} aria-label={title} onClick={handlePin}>
      <AlarmIcon disabled={!isPinned} />
    </button>
  );
}

export default AlarmButton;
