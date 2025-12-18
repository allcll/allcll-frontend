import React from 'react';
import { Subject } from '@/utils/types.ts';
import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';
import { useAddPinned, usePinned, useRemovePinned } from '@/hooks/server/usePinned.ts';
import { loggingDepartment } from '@/hooks/useSearchRank.ts';
import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { IconButton } from '@allcll/allcll-ui';

/**
 * feature
 */
interface IAlarmButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  subject: Subject;
  variant?: 'contain' | 'plain';
}

function AlarmButton({ subject, variant = 'contain', className, onClick, ...props }: IAlarmButtonProps) {
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
    <IconButton
      aria-label={title}
      title={title}
      variant={variant === 'contain' ? 'contain' : 'plain'}
      onClick={handlePin}
      icon={<AlarmIcon disabled={!isPinned} />}
      className={className}
      {...props}
    />
  );
}

export default AlarmButton;
