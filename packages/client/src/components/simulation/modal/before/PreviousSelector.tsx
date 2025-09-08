import { findLecturesById } from '@/utils/subjectPicker.ts';
import { useEffect } from 'react';
import useLectures from '@/hooks/server/useLectures.ts';
import { ISelectorProps } from '@/components/simulation/modal/before/UserWishModal.tsx';
import { InterestedSubject } from '@/utils/dbConfig.ts';

interface IPreviousSnapshot {
  subjects: InterestedSubject[];
  snapshot_id: number;
  user_id: string;
  created_at: number;
  simulated: boolean;
}

interface IPreviousSelector extends ISelectorProps {
  prevSnapshot: IPreviousSnapshot | null | undefined;
}

function PreviousSelector({ prevSnapshot, setSubjects }: IPreviousSelector) {
  const { data: lectures, isLoading: isLoadingLectures } = useLectures();

  // 이전 스냅샷이 있을 경우, 해당 스냅샷의 과목을 불러옵니다.
  useEffect(() => {
    if (!prevSnapshot || prevSnapshot.snapshot_id < 0) return;

    if (isLoadingLectures) return;
    const subjectIds = prevSnapshot.subjects.map(subject => subject.subject_id);
    const subjects = subjectIds.map(id => findLecturesById(lectures, id)).filter(s => !!s);
    setSubjects(subjects);
  }, [prevSnapshot]);

  return null;
}

export default PreviousSelector;
