import Chip from '@common/components/chip/Chip';
import RemoveFilterSvg from '@/assets/filter-remove-primary.svg?react';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore.ts';

function FilterDelete() {
  const resetFilter = useFilterScheduleStore(state => state.resetFilterSchedule);
  const { selectedDepartment, selectedGrades, selectedDays, selectedCuriTypes, selectedCredits } =
    useFilterScheduleStore();

  const isFiltered =
    selectedDepartment.length ||
    selectedGrades.length ||
    selectedDays.length ||
    selectedCuriTypes.length ||
    selectedCredits.length;

  if (!isFiltered) {
    return null;
  }

  const handleFilterDelete = () => {
    resetFilter();
  };

  return <Chip label={<RemoveFilterSvg className="w-4 h-4" />} selected={true} onClick={handleFilterDelete} />;
}

export default FilterDelete;
