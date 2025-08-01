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

  const { selectedDepartment, selectedGrades, selectedDays, setFilterSchedule, resetFilterSchedule } =
    useFilterScheduleStore();

  const isFiltered = (selectedDepartment.length || selectedGrades.length || selectedDays.length) > 0;

  function toggleSelectedValue<T>(array: T[], value: T): T[] {
    return array.includes(value) ? array.filter(item => item !== value) : [...array, value];
  }

  const handleClickSave = () => {
    closeBottomSheet('filter');
    openBottomSheet('search');
  };

  return (
    <BottomSheet>
      <BottomSheetHeader
        headerType="close"
        title="필터링"
        onClose={() => {
          closeBottomSheet('filter');
          openBottomSheet('search');
        }}
      />

      <section className="w-full flex flex-col px-4 gap-5">
        <div className="w-full  h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>
          <div className="w-full flex flex-col gap-2 justify-center">
            <select
              className="cursor-pointer border border-gray-300 rounded-sm px-2 py-1 w-full bg-white text-sm"
              value={selectedDepartment}
              onChange={e => setFilterSchedule('selectedDepartment', e.target.value)}
            >
              <option value="">전체</option>
              {departments?.map(department => (
                <option key={department.departmentCode} value={department.departmentCode}>
                  {department.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full h-15 flex gap-2 flex-col justify-center">
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

        <div className="w-full h-15 flex gap-2 flex-col justify-center">
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

        <div className="flex justify-end items-center gap-3 mt-5">
          {isFiltered && (
            <button
              className="text-xs text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
              onClick={resetFilterSchedule}
            >
              필터 초기화
            </button>
          )}

          <button
            onClick={handleClickSave}
            type="submit"
            className="bg-blue-500 font-semibold text-xs w-15 text-white rounded px-4 py-2 cursor-pointer "
          >
            저장
          </button>
        </div>
      </section>
    </BottomSheet>
  );
}

export default FilteringBottomSheet;
