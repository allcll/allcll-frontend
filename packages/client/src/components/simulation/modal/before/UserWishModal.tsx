import React, { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import { applyCreditLimit, pickNonRandomSubjects, pickRandomsubjects } from '@/utils/subjectPicker';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { getRecentInterestedSnapshot, saveInterestedSnapshot } from '@/utils/simulation/subjects';
import { startSimulation } from '@/utils/simulation/simulation';
import { Lecture } from '@/hooks/server/useLectures';
import GameTips from './GameTips';
import SelectDepartment from './SelectDepartment';
import { Department } from '@/hooks/server/useDepartments.ts';
import { TimetableType, useTimetableSchedules } from '@/hooks/server/useTimetableSchedules';
import TimetableChip from '../TimetableChip';
import { useScheduleState } from '@/store/useScheduleState';
import Chip from '@/components/common/Chip';
import SubjectTable from './SubjectTable';
import ActionButtons from './ActionButton';

interface UserWishModalIProps {
  lectures: Lecture[];
  timetables: TimetableType[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type ModeType = 'previous' | 'timetable' | 'random';

const InitDepartment: Department = { departmentCode: '', departmentName: '' };

function UserWishModal({ lectures, timetables, setIsModalOpen }: Readonly<UserWishModalIProps>) {
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const closeModal = useSimulationModalStore(state => state.closeModal);

  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

  const [simulationSubjects, setSimulationSubjects] = useState<Lecture[]>([]);
  const [department, setDepartment] = useState<Department>({ ...InitDepartment });

  const [selectedTimetable, setSelectedTimetable] = useState<TimetableType>(currentTimetable);
  const [subjectMode, setSubjectMode] = useState<ModeType>('timetable');
  const [toggleTip, setToggleTip] = useState(false);

  const { data: schedules, isLoading: isSchedulesLoading } = useTimetableSchedules(selectedTimetable?.timeTableId);
  const prevSnapshot = useLiveQuery(getRecentInterestedSnapshot);

  const handleRemakeSubjects = () => {
    setSimulationSubjects(pickRandomsubjects(lectures, department.departmentName));
  };

  /**시뮬레이션 시작버튼 클릭 */
  const handleStartGame = async () => {
    if (simulationSubjects.length === 0) {
      alert('과목 리스트가 비어있습니다. 게임을 시작할 수 없습니다.');
      return;
    }

    try {
      closeModal();

      // Todo: 기존 과목 판별 더 정확하게 할 수 있도록 개선 (시간표 선택 -> 같은 시간표 선택 시 등)
      if (subjectMode !== 'previous') {
        await saveInterestedSnapshot(simulationSubjects.map(subject => subject.subjectId));
      }
      const result = await startSimulation('', department.departmentCode, department.departmentName);

      const isStarted =
        'simulationId' in result &&
        'isRunning' in result &&
        result.simulationId !== -1 &&
        result.isRunning !== undefined;

      if (isStarted) {
        const { simulationId, isRunning } = result;

        setCurrentSimulation({
          simulationId,
          simulationStatus: isRunning ? 'start' : 'before',
          simulatonSubjects: simulationSubjects,
        });
      } else {
        console.error('시뮬레이션 시작 결과가 유효하지 않음', result);
      }
    } catch (e) {
      console.error('시뮬레이션 시작 중 오류 발생:', e);
    }
  };

  /**
   * 시뮬레이션에 적용할 시간표를 선택합니다.
   * @param optionId
   */
  const handleSelect = (optionId: number) => {
    const timetable = timetables.find(timetable => timetable.timeTableId === optionId);

    if (!timetable) {
      console.error('해당하는 시간표를 찾을 수 없습니다:', optionId);
      return;
    }

    setSelectedTimetable(timetable);
    setCurrentTimetable(timetable);
  };

  /**
   * 과목 모드를 선택합니다. (시간표 / 랜덤)
   * @param mode
   * @returns
   */
  const handleClickSubjectMode = (mode: ModeType) => {
    setSimulationSubjects([]);
    setSubjectMode(mode);
  };

  const getScheduleSubjectById = (scheduleSubjectId: number) => {
    return lectures.find(lecture => lecture.subjectId === scheduleSubjectId);
  };

  // 시간표 모드일 때, 선택한 시간표의 과목을 불러옵니다.
  useEffect(() => {
    if (isSchedulesLoading || subjectMode !== 'timetable') return;
    if (!schedules || schedules.length === 0) return;

    const validSchedules = schedules.filter(
      schedule => schedule.subjectId !== null && schedule.scheduleType !== 'custom',
    );

    const scheduleSubjects: Lecture[] = validSchedules.map(schedule => {
      return getScheduleSubjectById(schedule.subjectId ?? 0)!;
    });

    const limitCreditSubjects = applyCreditLimit(scheduleSubjects);
    setSimulationSubjects(limitCreditSubjects);
  }, [subjectMode, schedules, isSchedulesLoading]);

  // 랜덤 과목 모드일 때, 학과를 선택한 후 과목을 불러옵니다.
  useEffect(() => {
    if (subjectMode !== 'random') return;

    setSimulationSubjects(pickNonRandomSubjects(lectures, department.departmentName));
  }, [subjectMode, department]);

  // 이전 스냅샷이 있을 경우, 해당 스냅샷의 과목을 불러옵니다.
  useEffect(() => {
    if (subjectMode !== 'previous') return;
    if (!prevSnapshot || prevSnapshot.snapshot_id < 0) return;

    const subjectIds = prevSnapshot.subjects.map(subject => subject.subject_id);
    const subjects = subjectIds.map(i => lectures.find(l => l.subjectId === i) ?? null) as Lecture[];
    setSimulationSubjects(subjects);
  }, [subjectMode, prevSnapshot]);

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

  return (
    <Modal onClose={() => setIsModalOpen(false)}>
      <div className="flex flex-col w-full overflow-y-auto max-h-[90vh] max-w-[900px] sm:min-w-[600px]">
        <ModalHeader title="수강 신청 연습을 시작하시겠습니까?" onClose={() => setIsModalOpen(false)} />

        <div className="flex flex-col gap-2 p-2 sm:p-6">
          <h2 className="text-left font-semibold text-sm sm:text-md">어떤 과목으로 진행하시겠습니까?</h2>
          <div className="flex gap-2 py-2">
            {prevSnapshot && (
              <Chip
                label="기존 과목"
                selected={subjectMode === 'previous'}
                onClick={() => handleClickSubjectMode('previous')}
              />
            )}
            <Chip
              label="시간표 과목"
              selected={subjectMode === 'timetable'}
              onClick={() => handleClickSubjectMode('timetable')}
            />
            <Chip
              label="랜덤 과목"
              selected={subjectMode === 'random'}
              onClick={() => handleClickSubjectMode('random')}
            />
          </div>

          {subjectMode === 'timetable' && (
            <TimetableChip
              timetables={timetables}
              selectedTimetable={selectedTimetable}
              onSelect={handleSelect}
              setSelectedTimetable={setSelectedTimetable}
            />
          )}

          {subjectMode === 'random' && <SelectDepartment department={department} setDepartment={setDepartment} />}

          {simulationSubjects.length !== 0 ? (
            <SubjectTable
              subjects={simulationSubjects}
              handleRemakeSubjects={subjectMode === 'random' ? handleRemakeSubjects : undefined}
            />
          ) : (
            <div>아직 선택된 과목이 없습니다.</div>
          )}

          {toggleTip && <GameTips />}
        </div>

        <ActionButtons
          simulationSubjects={simulationSubjects}
          handleStartGame={handleStartGame}
          setToggleTip={setToggleTip}
        />
      </div>
    </Modal>
  );
}

export default UserWishModal;
