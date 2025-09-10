import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Filtering from '@common/components/filtering/Filtering';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import SingleSelectFilterOption from '@common/components/filtering/SingleSelectFilter';
import { ISelectorProps } from '@/components/simulation/modal/before/UserWishModal.tsx';
import { TimetableType, useTimetableSchedules } from '@/hooks/server/useTimetableSchedules';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { applyCreditLimit, findLecturesById } from '@/utils/subjectPicker.ts';
import useLectures from '@/hooks/server/useLectures.ts';

interface ITimetableChip extends ISelectorProps {
  timetables: TimetableType[];
}

const InitTimetable: TimetableType = { timeTableId: -1, timeTableName: '선택된 시간표 없음', semester: '2025-2' };

function TimetableSelector({ timetables, setSubjects }: ITimetableChip) {
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);
  const { currentTimetable } = useScheduleState.getState();
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableType>(currentTimetable ?? InitTimetable);
  const { data: schedules, isLoading: isSchedulesLoading } = useTimetableSchedules(selectedTimetable?.timeTableId);
  const { data: lectures } = useLectures();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const setFilterScheduleWrapper = (field: string, value: string | number | null) => {
    if (field === 'selectedTimetable' && typeof value === 'number') {
      handleSelect(value);
    }
  };

  const timetableOptions = timetables.map(timetable => {
    return {
      value: timetable.timeTableId,
      label: timetable.timeTableName,
    };
  });

  // 시간표 모드일 때, 선택한 시간표의 과목을 불러옵니다.
  useEffect(() => {
    if (isSchedulesLoading || !schedules) return;
    if (schedules.length === 0) {
      setSubjects([]);
      return;
    }

    const validSchedules = schedules.filter(schedule => schedule.scheduleType !== 'custom');
    const scheduleSubjects = validSchedules
      .map(schedule => findLecturesById(lectures, schedule.subjectId ?? 0))
      .filter(l => !!l);

    const limitCreditSubjects = applyCreditLimit(scheduleSubjects);
    setSubjects(limitCreditSubjects);
  }, [schedules, isSchedulesLoading, selectedTimetable]);

  /**
   * 시뮬레이션에 적용할 시간표를 선택합니다.
   * @param optionId
   */
  const handleSelect = (optionId: number) => {
    const timetable = timetables.find(timetable => timetable.timeTableId === optionId) ?? InitTimetable;

    if (!timetable) {
      console.error('해당하는 시간표를 찾을 수 없습니다:', optionId);
      return;
    }

    setSelectedTimetable(timetable);
    setCurrentTimetable(timetable);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-left font-semibold text-sm sm:text-md">시간표를 선택해주세요.</h2>
      <div className="relative inline-block max-w-sm" ref={dropdownRef}>
        <Filtering label="시간표" selected={selectedTimetable.timeTableId !== null} className="min-w-max">
          <SingleSelectFilterOption
            labelPrefix="시간표"
            selectedValue={selectedTimetable.timeTableId}
            field="selectedTimetable"
            setFilter={setFilterScheduleWrapper}
            options={timetableOptions}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
        <Link to="/timetable" className="px-6 py-2 hover:text-blue-500 text-gray-500 rounded-md">
          새 시간표 추가
        </Link>
      </div>
    </div>
  );
}

export default TimetableSelector;
