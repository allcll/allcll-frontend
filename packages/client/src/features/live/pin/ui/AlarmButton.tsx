import React from 'react';
import { Subject } from '@/shared/model/types.ts';
import { useAddPinned, usePinned, useRemovePinned } from '@/entities/subjects/model/capabilities/usePinned.ts';
import { loggingDepartment } from '@/features/filtering/lib/useSearchRank.ts';
import useSearchLogging from '@/features/filtering/lib/useSearchLogging.ts';
import { IconButton, NotificationFilledIcon } from '@allcll/allcll-ui';

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
      icon={<NotificationFilledIcon className={`w-4 h-4 ${isPinned ? 'text-blue-500' : 'text-gray-400'}`} />}
      className={className}
      {...props}
    />
  );
}

export default AlarmButton;
