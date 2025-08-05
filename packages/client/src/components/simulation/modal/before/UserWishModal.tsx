import React, { useEffect, useState } from 'react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import { DepartmentType } from '@/utils/types';
import { applyCreditLimit, pickNonRandomSubjects, pickRandomsubjects } from '@/utils/subjectPicker';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { saveInterestedSnapshot } from '@/utils/simulation/subjects';
import { startSimulation } from '@/utils/simulation/simulation';
import { Lecture } from '@/hooks/server/useLectures';
import GameTips from './GameTips';
import SelectDepartment from './SelectDepartment';
import { TimetableType, useTimetableSchedules } from '@/hooks/server/useTimetableSchedules';
import TimetableChip from '../TimetableChip';
import { useScheduleState } from '@/store/useScheduleState';
import Chip from '@/components/common/Chip';
import SubjectTable from './SubjectTable';
import ActionButtons from './ActionButton';
// import SearchSubjects from './SearchSubjects';

interface UserWishModalIProps {
  lectures: Lecture[];
  timetables: TimetableType[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserWishModal({ lectures, timetables, setIsModalOpen }: UserWishModalIProps) {
  const { setCurrentSimulation } = useSimulationProcessStore();
  const { closeModal } = useSimulationModalStore();

  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

  const [simulationSubjects, setSimulationSubjects] = useState<Lecture[]>([]);
  const [department, setDepartment] = useState<DepartmentType>({
    departmentCode: '',
    departmentName: '',
  });

  const [selectedTimetable, setSelectedTimetable] = useState<TimetableType>(currentTimetable);
  const [subjectMode, setSubjectMode] = useState<'timetable' | 'random'>('timetable');
  const [toggleTip, setToggleTip] = useState(false);
  // const [toggleSearch, setToggleSearch] = useState(false);

  const { data: schedules, isLoading: isSchedulesLoading } = useTimetableSchedules(selectedTimetable?.timeTableId);

  const saveRandomSubjects = (departmentName: string) => {
    const randomSubjects = pickNonRandomSubjects(lectures, departmentName);
    setSimulationSubjects(randomSubjects);
    return randomSubjects;
  };

  const handleRemakeSubjects = () => {
    const randomSubjects = pickRandomsubjects(lectures, department.departmentName);
    setSimulationSubjects(randomSubjects);
  };

  /**
   *
   * 시뮬레이션 시작버튼 클릭
   */
  const handleStartGame = async () => {
    if (simulationSubjects.length === 0) {
      alert('과목 리스트가 비어있습니다. 게임을 시작할 수 없습니다.');
      return;
    }

    try {
      closeModal('wish');

      await saveInterestedSnapshot(simulationSubjects.map(subject => subject.subjectId));
      const result = await startSimulation('', department.departmentCode, department.departmentName);

      if (
        'simulationId' in result &&
        'isRunning' in result &&
        result.simulationId !== -1 &&
        result.isRunning !== undefined
      ) {
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
   * @param scheduleSubjectId
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
  const handleClickSubjectMode = (mode: 'timetable' | 'random') => {
    setSimulationSubjects([]);
    if (mode === 'timetable') {
      setSubjectMode('timetable');
      return;
    }

    if (mode === 'random') {
      setSubjectMode('random');
    }
  };

  const getScheduleSubjectById = (scheduleSubjectId: number) => {
    return lectures.find(lecture => {
      return lecture.subjectId === scheduleSubjectId;
    });
  };

  // const handleAddSubject = (subject: Lecture) => {
  //   setSimulationSubjects([...simulationSubjects, subject]);
  // };

  useEffect(() => {
    if (!subjectMode || isSchedulesLoading) {
      return;
    }

    if (subjectMode === 'random') {
      const subjects = pickNonRandomSubjects(lectures, department.departmentName);
      setSimulationSubjects(subjects);
      return;
    }

    if (subjectMode === 'timetable') {
      if (!schedules || schedules.length === 0) {
        return;
      }

      const validSchedules = schedules.filter(
        schedule => schedule.subjectId !== null && schedule.scheduleType !== 'custom',
      );

      const scheduleSubjects: Lecture[] = validSchedules.map(schedule => {
        return getScheduleSubjectById(schedule.subjectId ?? 0)!;
      });

      const limitCreditSubjects = applyCreditLimit(scheduleSubjects);
      setSimulationSubjects(limitCreditSubjects);
    }
  }, [subjectMode, schedules, isSchedulesLoading]);

  return (
    <Modal>
      <div className="flex flex-col min-w-lg">
        <ModalHeader
          title="수강 신청 연습을 시작하시겠습니까?"
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
        <div className="flex flex-row gap-4 p-2 sm:p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-left font-semibold text-sm sm:text-md">어떤 과목으로 진행하시겠습니까?</h2>
            <div className="flex gap-2 py-2">
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

            {subjectMode === 'random' && (
              <SelectDepartment
                department={department}
                saveRandomSubjects={saveRandomSubjects}
                setDepartment={setDepartment}
              />
            )}

            {simulationSubjects.length !== 0 ? (
              <SubjectTable
                subjectMode={subjectMode}
                subjects={simulationSubjects}
                handleRemakeSubjects={handleRemakeSubjects}
              />
            ) : (
              <div>아직 선택된 과목이 없습니다.</div>
            )}

            {/* {simulationSubjects.length !== 0 && (
              <div className="mt-5">
                <h2 className="text-left font-semibold">과목을 추가하고 싶으신가요?</h2>
                <Chip label="검색으로 추가" selected={toggleSearch} onClick={() => setToggleSearch(!toggleSearch)} />
              </div>
            )} */}

            {toggleTip && <GameTips />}
          </div>

          {/* {toggleSearch && (
            <div className="flex flex-col gap-2 w-full">
              <SearchSubjects handleAddSubject={handleAddSubject} />
            </div>
          )} */}
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
