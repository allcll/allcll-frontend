import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Chip from '@common/components/chip/Chip';
import Button from '@common/components/Button.tsx';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import PreviousSelector from '@/components/simulation/modal/before/PreviousSelector.tsx';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal.ts';
import { Department } from '@/hooks/server/useDepartments.ts';
import useLectures, { Lecture } from '@/hooks/server/useLectures';
import { TimetableType } from '@/hooks/server/useTimetableSchedules';
import { pickRandomSubjects } from '@/utils/subjectPicker';
import { getRecentInterestedSnapshot } from '@/utils/simulation/subjects';
import RandomSelector from './RandomSelector.tsx';
import SubjectTable from './SubjectTable';
import ModalActions from './ActionButton';
import TimetableSelector from '../TimetableSelector.tsx';
import GameTips from './GameTips';
import { useSimulationActions } from '@/hooks/simulation/useSimulationActions.ts';

interface UserWishModalIProps {
  timetables: TimetableType[];
}

export interface ISelectorProps {
  setSubjects: React.Dispatch<React.SetStateAction<Lecture[]>>;
}

type ModeType = 'previous' | 'timetable' | 'random';

const InitDepartment: Department = { departmentCode: '', departmentName: '' };

function UserWishModal({ timetables }: Readonly<UserWishModalIProps>) {
  const closeModal = useSimulationModalStore(state => state.closeModal);
  const SimulationActions = useSimulationActions();
  const { data: lectures, isLoading: isLoadingLectures } = useLectures();

  const [simulationSubjects, setSimulationSubjects] = useState<Lecture[]>([]);
  const [department, setDepartment] = useState<Department>({ ...InitDepartment });

  const [subjectMode, setSubjectMode] = useState<ModeType>('timetable');
  const [toggleTip, setToggleTip] = useState(false);

  const prevSnapshot = useLiveQuery(getRecentInterestedSnapshot);

  const handleRemakeSubjects = () => {
    setSimulationSubjects(pickRandomSubjects(lectures, department.departmentName));
  };

  // 처음 입장 시 어떤 항목으로 갈지 결정
  useEffect(() => {
    if (prevSnapshot && prevSnapshot.snapshot_id >= 0) {
      setSubjectMode('previous');
    } else if (timetables.length > 0) {
      setSubjectMode('timetable');
    } else {
      setSubjectMode('random');
    }
  }, [prevSnapshot, timetables]);

  const handleStart = async () => {
    await SimulationActions.start(subjectMode, simulationSubjects, department);
  };

  return (
    <Modal onClose={() => closeModal()}>
      <ModalHeader title="수강 신청 연습을 시작하시겠습니까?" onClose={() => closeModal()} />
      <div className="flex flex-col w-full max-w-[900px] sm:min-w-[600px] gap-2 p-2 sm:p-6">
        <h2 className="text-left font-semibold text-sm sm:text-md">어떤 과목으로 진행하시겠습니까?</h2>
        <div className="flex gap-2 py-2">
          {prevSnapshot && (
            <Chip label="기존 과목" selected={subjectMode === 'previous'} onClick={() => setSubjectMode('previous')} />
          )}
          <Chip
            label="시간표 과목"
            selected={subjectMode === 'timetable'}
            onClick={() => setSubjectMode('timetable')}
          />
          <Chip label="랜덤 과목" selected={subjectMode === 'random'} onClick={() => setSubjectMode('random')} />
        </div>

        {subjectMode === 'previous' ? (
          <PreviousSelector prevSnapshot={prevSnapshot} setSubjects={setSimulationSubjects} />
        ) : subjectMode === 'timetable' ? (
          <TimetableSelector timetables={timetables} setSubjects={setSimulationSubjects} />
        ) : (
          // subjectMode === 'random'
          <RandomSelector department={department} setDepartment={setDepartment} setSubjects={setSimulationSubjects} />
        )}

        <SubjectTable
          isLoadingLectures={isLoadingLectures}
          subjects={simulationSubjects}
          handleRemakeSubjects={subjectMode === 'random' ? handleRemakeSubjects : undefined}
        />

        {toggleTip && <GameTips />}
      </div>

      <ModalActions>
        <Button variants="primary" className="font-semibold" onClick={() => setToggleTip(true)}>
          팁 보기
        </Button>

        <Button
          variants="primary"
          onClick={handleStart}
          disabled={simulationSubjects.length === 0}
          className="font-semibold"
        >
          시작하기
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default UserWishModal;
