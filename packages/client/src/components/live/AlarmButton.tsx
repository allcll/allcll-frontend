import React from 'react';
import { Subject } from '@/utils/types.ts';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import { useAddPinned, usePinned, useRemovePinned } from '@/store/usePinned.ts';
import { loggingDepartment } from '@/hooks/useSearchRank.ts';
import useSearchLogging from '@/hooks/useSearchLogging.ts';

interface IAlarmButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  subject: Subject;
}

function AlarmButton({ subject, className, onClick, ...props }: IAlarmButtonProps) {
  const { data: pinnedSubjects } = usePinned();
  const { mutate: deletePin } = useRemovePinned();
  const { mutate: addPin } = useAddPinned();
  const { selectTargetOnly } = useSearchLogging();

  const isPinned = pinnedSubjects?.some(pinnedSubject => pinnedSubject.subjectId === subject.subjectId);
  const title = isPinned ? '알림 과목 해제' : '알림 과목 등록';

  const handlePin = (e: React.MouseEvent<HTMLButtonElement>) => {
    selectTargetOnly(subject.subjectId);
    loggingDepartment(subject.deptCd);

    if (onClick) onClick(e);

    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);
  };

  return (
    <button
      className={'cursor-pointer ' + (className ?? '')}
      title={title}
      aria-label={title}
      onClick={handlePin}
      {...props}
    >
      <AlarmIcon disabled={!isPinned} />
    </button>
  );
}

export default AlarmButton;
