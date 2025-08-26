import BottomSheet from '../BottomSheet';
import BottomSheetHeader from '../BottomSheetHeader';
import useDepartments from '@/hooks/server/useDepartments';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import DayFilter from '../../filter/DayFilter';
import CreditFilter from '../../filter/CreditFilter';
import CuriTypeFilter from '../../filter/CuriTypeFilter';
import GradeFilter from '../../filter/GradeFilter';

function FilteringBottomSheet() {
  const { data: departments } = useDepartments();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetStore();

  const { department, grades, time, credits, categories } = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const resetFilter = useScheduleSearchStore(state => state.resetFilters);

  const isFiltered = (department.length || grades.length || time.length || credits.length || categories.length) > 0;

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

      <section className="w-full flex flex-col px-4 gap-5 max-h-[85vh]  overflow-y-scroll">
        <div className="w-full  h-15 flex gap-2 flex-col justify-center mt-2">
          <label className="text-xs text-gray-500">학과</label>
          <div className="w-full flex flex-col gap-2 justify-center">
            <select
              className="cursor-pointer border border-gray-300 rounded-sm px-2 py-1 w-full bg-white text-sm"
              value={department}
              onChange={e => setFilter('department', e.target.value)}
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

        <GradeFilter />
        <DayFilter />
        <CreditFilter />
        <CuriTypeFilter />

        <div className="flex justify-end items-center gap-3 mt-5">
          {isFiltered && (
            <button
              className="text-xs text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
              onClick={resetFilter}
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
