import { Day, Grade } from '@/utils/types';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import Chip from '@/components/common/Chip';
import useDepartments from '@/hooks/server/useDepartments';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';

const GRADES: Grade[] = [1, 2, 3, 4];
const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function FilteringBottomSheet() {
  const { data: departments } = useDepartments();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetStore();

  const { selectedDepartment, selectedGrades, selectedDays, setFilterSchedule } = useFilterScheduleStore();

  function toggleSelectedValue<T>(array: T[], value: T): T[] {
    return array.includes(value) ? array.filter(item => item !== value) : [...array, value];
  }

  return (
    <BottomSheet>
      <BottomSheetHeader
        headerType="close"
        onClose={() => {
          closeBottomSheet('filter');
        }}
        onClick={() => {
          closeBottomSheet('filter');
          openBottomSheet('search');
        }}
      />

      <h2 className="font-semibold py-2 mt-2 text-sm border-b border-gray-200">필터링</h2>

      <div className="w-full h-15 flex gap-2 flex flex-col justify-center mt-2">
        <label className="text-xs text-gray-500">학과</label>
        <div className="w-full flex flex-col gap-2 justify-center">
          <select
            className="cursor-pointer border border-gray-300 rounded-sm px-2 py-1 w-full bg-white text-sm"
            value={selectedDepartment}
            onChange={e => setFilterSchedule('selectedDepartment', e.target.value)}
          >
            <option value="전체">전체</option>
            {departments?.map(department => (
              <option key={department.departmentCode} value={department.departmentName}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full h-15 flex gap-2 flex flex-col justify-center">
        <label className="text-xs text-gray-500">학년</label>
        <div className="flex gap-2">
          <Chip
            label="전체"
            selected={selectedGrades.length === GRADES.length}
            onClick={() => {
              const allSelected = selectedGrades.length === GRADES.length;
              setFilterSchedule('selectedGrades', allSelected ? [] : GRADES);
            }}
          />
          {GRADES.map(grade => {
            return (
              <Chip
                label={`${grade}학년`}
                selected={selectedGrades.includes(grade)}
                onClick={() => setFilterSchedule('selectedGrades', toggleSelectedValue(selectedGrades, grade))}
              />
            );
          })}
        </div>
      </div>

      <div className="w-full h-15 flex gap-2 flex flex-col justify-center">
        <label className="text-xs text-gray-500">요일</label>
        <div className="flex gap-2">
          <Chip
            label="전체"
            selected={selectedDays.length === DAYS.length}
            onClick={() => {
              const allSelected = selectedDays.length === DAYS.length;
              setFilterSchedule('selectedDays', allSelected ? [] : DAYS);
            }}
          />
          {DAYS.map(day => {
            return (
              <Chip
                key={day}
                label={day}
                selected={selectedDays.includes(day)}
                onClick={() => setFilterSchedule('selectedDays', toggleSelectedValue(selectedDays, day))}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => closeBottomSheet('filter')}
          type="submit"
          className="text-blue-500 text-xs w-15 rounded px-4 py-2 cursor-pointer "
        >
          저장
        </button>
      </div>
    </BottomSheet>
  );
}

export default FilteringBottomSheet;
