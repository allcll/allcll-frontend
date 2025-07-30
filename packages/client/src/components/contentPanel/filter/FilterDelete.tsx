import Chip from '@/components/common/Chip.tsx';
import RemoveFilterSvg from '@/assets/filter-remove-primary.svg?react';
import { useFilterScheduleStore } from '@/store/useFilterScheduleStore.ts';

const DefaultFilter = {
  selectedDepartment: '',
  selectedGrades: [],
  isMajor: undefined,
  selectedDays: [],
  selectedTimeRange: {
    startHour: '9',
    startMinute: '00',
    endHour: '10',
    endMinute: '00',
  },
};

function FilterDelete() {
  const resetFilter = useFilterScheduleStore(state => state.resetFilterSchedule);
  const getFilter = useFilterScheduleStore(state => state.getFilterSchedule);

  // Fixme: 비어있는 경우 찾기
  const isFiltered = !isFilterEmpty(getFilter(), DefaultFilter);

  if (!isFiltered) {
    return null;
  }

  const handleFilterDelete = () => {
    resetFilter();
  };

  return <Chip label={<RemoveFilterSvg className="w-4 h-4" />} selected={true} onClick={handleFilterDelete} />;
}

function isFilterEmpty(a: object, initial: object): boolean {
  return Object.entries(a).every(([key, value]) => {
    const initialKey = key as keyof typeof initial;
    const targetValue = key in initial ? initial[initialKey] : undefined;

    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'object' && value !== null) {
      return isFilterEmpty(value, targetValue ?? {});
    }
    return value === targetValue;
  });
}

export default FilterDelete;
