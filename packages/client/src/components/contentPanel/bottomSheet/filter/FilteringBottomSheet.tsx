import { Curitype, Day, Grade } from '@/utils/types';
import BottomSheet from '../BottomSheet';
import BottomSheetHeader from '../BottomSheetHeader';
import useDepartments from '@/hooks/server/useDepartments';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore';
import FilterChips from './FilteringChips';
import { GRADE } from '../../filter/GradeFilter';
import { DAYS } from '../../filter/DayFilter';
import { CREDITS } from '../../filter/CreditFilter';
import { CURITYPE } from '../../filter/CuriTypeFilter';

function FilteringBottomSheet() {
  const { data: departments } = useDepartments();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetStore();

  const {
    selectedDepartment,
    selectedGrades,
    selectedDays,
    setFilterSchedule,
    selectedCredits,
    selectedCuriTypes,
    resetFilterSchedule,
  } = useFilterScheduleStore();

  const isFiltered =
    (selectedDepartment.length ||
      selectedGrades.length ||
      selectedDays.length ||
      selectedCredits.length ||
      selectedCuriTypes.length) > 0;

  const handleClickSave = () => {
    closeBottomSheet('filter');
    openBottomSheet('search');
  };

  const setFilterGradeWrapper = (field: string, value: Grade[]) => {
    if (field === 'selectedGrades') {
      setFilterSchedule('selectedGrades', value);
    }
  };

  const setFilterDayWrapper = (field: string, value: Day[]) => {
    if (field === 'selectedDays') {
      setFilterSchedule('selectedDays', value);
    }
  };

  const setFilterCreditsWrapper = (field: string, value: number[]) => {
    if (field === 'selectedCredits') {
      setFilterSchedule('selectedCredits', value);
    }
  };

  const setFilterCuriTypesWrapper = (field: string, value: Curitype[]) => {
    if (field === 'selectedCuriTypes') {
      setFilterSchedule('selectedCuriTypes', value);
    }
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

        <FilterChips
          label="학년"
          field="selectedGrades"
          selectedValue={selectedGrades}
          setFilterSchedule={setFilterGradeWrapper}
          options={GRADE}
        />

        <FilterChips
          label="요일"
          field="selectedDays"
          selectedValue={selectedDays}
          setFilterSchedule={setFilterDayWrapper}
          options={DAYS}
        />

        <FilterChips
          label="학점"
          field="selectedCredits"
          selectedValue={selectedCredits}
          setFilterSchedule={setFilterCreditsWrapper}
          options={CREDITS}
        />

        <FilterChips
          label="유형"
          field="selectedCuriTypes"
          selectedValue={selectedCuriTypes}
          setFilterSchedule={setFilterCuriTypesWrapper}
          options={CURITYPE}
        />

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
